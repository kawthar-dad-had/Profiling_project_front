import React from "react";
import { useCart } from "./CartProvider"; // Utilisez le hook pour accéder au panier
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

export function Carts() {
  const { cart, removeFromCart } = useCart(); // Accédez au panier

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
        // Affiche l'image PNG au centre quand le panier est vide
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "60vh", // Hauteur minimale
          }}
        >
          <img
            src="/images/shoping.jpg" // Remplacez par le chemin de votre image PNG
            alt="empty cart"
            style={{ maxWidth: "400px" }} // Ajuste la taille de l'image si nécessaire
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
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ mt: 2 }}
                    >
                      ${product.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeFromCart(product.id)} // Retirer le produit du panier
                >
                  Remove from Cart
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
