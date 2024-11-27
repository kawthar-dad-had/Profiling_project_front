import React, { useEffect, useState } from "react";
import { useCart } from "./CartProvider"; // Hook pour le panier
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActionArea,
  Box,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Icône du panier
import axios from "axios"; // Pour récupérer l'image via Axios
import { trace } from "@opentelemetry/api"; // Import OpenTelemetry API


const tracer = trace.getTracer("frontend-service"); // Initialiser le traceur

export function Carts() {
  const { cart, removeFromCart } = useCart(); // Accès au panier
  const [imageUrls, setImageUrls] = useState({}); // Pour stocker les URLs des images

  // Fonction pour récupérer l'image pour chaque produit
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
        `http://localhost:8080/api/products/${productId}/image`, // L'endpoint pour récupérer l'image
        {
          responseType: "blob", // Nous attendons un Blob
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
          },
        }
      );

      span.setAttribute("product.id", productId); // Ajouter l'ID du produit
      span.setAttribute("http.status_code", response.status);

      // Créer une URL temporaire pour l'image
      const imageUrl = URL.createObjectURL(response.data);
      setImageUrls((prevUrls) => ({
        ...prevUrls,
        [productId]: imageUrl, // Associer l'URL à l'ID du produit
      }));
    } catch (error) {
      span.setStatus({ code: 2, message: error.message }); // Erreur lors du chargement de l'image
      console.error("Erreur lors du chargement de l'image:", error);
    } finally {
      span.end(); // Terminer la trace
    }
  };

  // Récupérer les images pour tous les produits du panier lorsque le panier change
  useEffect(() => {
    cart.forEach((product) => {
      if (!imageUrls[product.id]) {
        fetchImage(product.id); // Appel à fetchImage pour chaque produit
      }
    });
  }, [cart, imageUrls]); // Recharger les images chaque fois que le panier change

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton sx={{ mr: 2 }}>
          <ShoppingCartIcon fontSize="large" color="primary" />
        </IconButton>
        <Typography variant="h4" color="text.primary">
          Your Cart
        </Typography>
      </Box>

      {cart.length === 0 ? (
        // Affiche une image et un message lorsque le panier est vide
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "60vh",
          }}
        >
          <img
            src="/images/shoping.jpg" // Assurez-vous que l'image est disponible à ce chemin
            alt="empty cart"
            style={{ maxWidth: "400px" }}
          />
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            Your cart is empty
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cart.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
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
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {product.quantity}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeFromCart(product.id)} // Suppression du produit
                >
                  {product.quantity > 1 ? "Remove 1" : "Remove from Cart"}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
