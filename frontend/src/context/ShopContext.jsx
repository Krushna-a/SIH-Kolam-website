import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api";
import axios from "axios";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
    fetchProducts();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await api.get("/api/me");
        setUser(response.data);
        await fetchCart();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await api.get("/api/cart/");
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error(
        "Error fetching cart:",
        error.response?.data || error.message
      );
      setCartItems([]);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/login", { email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem("token", access_token);
      setUser(userData);
      await fetchCart();

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const register = async (fullname, email, password) => {
    try {
      const response = await api.post("/api/register", {
        fullname,
        email,
        password,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartItems([]);
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await api.post("/api/cart/add", {
        product_id: product.id,
        quantity: quantity,
      });
      await fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.detail || "Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/api/cart/remove/${productId}`);
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

const updateQuantity = async (productId, newQuantity) => {
  try {
    const response = await api.put(`/api/cart/update/${productId}`, {
      quantity: newQuantity,
    });

    // Use consistent state update
    setCartItems(prev => 
      prev.map(item => 
        item.product_id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw error; // Let components handle the error
  }
};

  const checkout = async () => {
    try {
      await api.post("/api/checkout/");
      setCartItems([]);
      alert("Order placed successfully!");
      return { success: true };
    } catch (error) {
      console.error("Checkout error:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Checkout failed",
      };
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        user,
        loading,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        cartItems,
        setCartItems,
        updateQuantity,
        checkout,
        fetchCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
