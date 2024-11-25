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

export function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [imageUrls, setImageUrls] = useState({}); // Pour stocker les URLs des images

  const { addToCart } = useCart(); // Hook pour ajouter au panier

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products") // Appel à votre backend
      .then((response) => {
        setProducts(response.data); // Assurez-vous que vos données ont le bon format
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de récupération des produits:", error);
        setLoading(false);
      });
  }, []);

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
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/${productId}/image`,
        {
          responseType: "blob", // Important : on s'attend à recevoir un Blob
        }
      );
      // Créer une URL temporaire pour l'image
      const imageUrl = URL.createObjectURL(response.data);
      setImageUrls((prevUrls) => ({
        ...prevUrls,
        [productId]: imageUrl,
      }));
    } catch (error) {
      console.error("Erreur lors du chargement de l'image:", error);
    }
  };

  useEffect(() => {
    products.forEach((product) => {
      fetchImage(product.id); // Appel pour chaque produit
    });
  }, [products]);

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
                  height="140"
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
                  onClick={() => addToCart(product)} // Ajout au panier
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
