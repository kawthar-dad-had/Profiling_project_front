import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActionArea,
  CardActions,
} from "@mui/material";
import axios from "axios";
import SearchInput from "../utils/Search";
import { CircularIndeterminate } from "../utils/CircularIndeterminate"; // Composant de chargement
import { useCart } from "./CartProvider"; // Hook pour gérer le panier
import { trace } from "@opentelemetry/api"; // Import OpenTelemetry API

const tracer = trace.getTracer("frontend-service"); // Initialiser le traceur

export function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [imageUrls, setImageUrls] = useState({}); // Pour stocker les URLs des images

  const { addToCart } = useCart(); // Hook pour ajouter au panier

  // Récupérer les produits depuis le backend
  useEffect(() => {
    const fetchProducts = async () => {
      const span = tracer.startSpan("fetch_products");
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          alert("Please log in first");
          span.setStatus({ code: 2, message: "No token found" }); // Error status
          return [];
        }
        const response = await axios.get("http://localhost:8080/api/products",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Appel à votre backend
        span.setAttribute("http.status_code", response.status);
        span.setAttribute("product.count", response.data.length); // Ajouter le nombre de produits
        setProducts(response.data); // Assurez-vous que vos données ont le bon format
        setLoading(false);
      } catch (error) {
        span.setStatus({ code: 2, message: error.message }); // Erreur lors de la récupération
        console.error("Erreur de récupération des produits:", error);
        setLoading(false);
      } finally {
        span.end(); // Terminer la trace
      }
    };

    fetchProducts();
  }, []);

  // Filtrer les produits en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Récupérer l'image via Axios et créer un objet URL pour l'image
  const fetchImage = async (productId) => {
    const span = tracer.startSpan("fetch_image");
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Please log in first");
        span.setStatus({ code: 2, message: "No token found" }); // Error status
        return [];
      }
      const response = await axios.get(
        `http://localhost:8080/api/products/${productId}/image`,
        {
          responseType: "blob", // Important : on s'attend à recevoir un Blob
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
          },
        },
        
      );
      span.setAttribute("product.id", productId); // Ajouter l'ID du produit
      span.setAttribute("http.status_code", response.status);

      // Créer une URL temporaire pour l'image
      const imageUrl = URL.createObjectURL(response.data);
      setImageUrls((prevUrls) => ({
        ...prevUrls,
        [productId]: imageUrl,
      }));
    } catch (error) {
      span.setStatus({ code: 2, message: error.message }); // Erreur lors du chargement de l'image
      console.error("Erreur lors du chargement de l'image:", error);
    } finally {
      span.end(); // Terminer la trace
    }
  };

  useEffect(() => {
    products.forEach((product) => {
      fetchImage(product.id); // Appel pour chaque produit
    });
  }, [products]);

  // Ajouter un produit au panier avec une trace
  const handleAddToCart = (product) => {
    const span = tracer.startSpan("add_to_cart");
    span.setAttribute("product.id", product.id);
    span.setAttribute("product.name", product.name);
    span.setAttribute("product.price", product.price);
    try {
      addToCart(product); // Ajout au panier
      span.setStatus({ code: 1, message: "Product added to cart" });
    } catch (error) {
      span.setStatus({ code: 2, message: error.message });
      console.error("Erreur lors de l'ajout au panier:", error);
    } finally {
      span.end();
    }
  };

  if (loading) {
    return <CircularIndeterminate />;
  }

  return (
    <div>
      <SearchInput setSearchTerm={setSearchTerm} />
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  image={imageUrls[product.id] || "path_to_default_image.jpg"} // Image ou fallback
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expiration: {product.expirationDate}
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                    ${product.price}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleAddToCart(product)} // Ajout au panier avec trace
                >
                  Add to Cart
                </Button>
                <Button size="small" color="primary">
                  Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
