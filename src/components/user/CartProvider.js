import React, { createContext, useContext, useState } from "react";

// Créer le Contexte
const CartContext = createContext();

// Fournisseur du Contexte
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Liste des produits dans le panier

  // Fonction pour ajouter un produit au panier
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Fonction pour retirer un produit du panier (facultatif)
  const removeFromCart = (productId) => {
    setCart(cart.filter((product) => product.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le Contexte
export const useCart = () => useContext(CartContext);
