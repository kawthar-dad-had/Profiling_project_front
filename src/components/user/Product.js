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
import { CircularIndeterminate } from "../utils/CircularIndeterminate"; // Importez le composant de chargement
import { useCart } from "./CartProvider"; // Importez le hook pour accéder au panier

export function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { addToCart } = useCart(); // Utilisez le hook pour ajouter au panier

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
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
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Affiche le composant de chargement tant que les produits sont en cours de récupération
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
                  <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                    ${product.price}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => addToCart(product)} // Ajoutez le produit au panier
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
