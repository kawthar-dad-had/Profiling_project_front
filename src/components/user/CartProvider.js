// CartProvider.js
import React, { createContext, useContext, useState } from "react";

// Créer le Contexte
const CartContext = createContext();

// Fournisseur du Contexte
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Ajouter un produit au panier (avec quantité)
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }  // Incrémenter la quantité
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]); // Ajouter un nouveau produit avec quantité 1
    }
  };

  // Supprimer un produit (ou réduire la quantité si > 1)
  const removeFromCart = (productId) => {
    const product = cart.find(item => item.id === productId);
    if (product.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 } // Réduire la quantité
            : item
        )
      );
    } else {
      setCart(cart.filter((product) => product.id !== productId)); // Supprimer le produit s'il ne reste plus de quantité
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le Contexte
export const useCart = () => useContext(CartContext);
