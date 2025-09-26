import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Auth from "./Pages/Auth.jsx";
import Home from "./Pages/Home.jsx";
import Collection from "./Pages/Collection.jsx";
import Navbar from "./Pages/Navbar.jsx";
import Footer from "./Pages/Footer.jsx";
import { ShopProvider } from "./context/ShopContext";
import ProductPage from "./Pages/ProductPage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import PaymentPage from "./Pages/PaymentPage.jsx";
import ThankYou from "./Pages/ThankYou.jsx";
import SellerPage from "./Pages/SellerPage.jsx";
import KolamAnalyzer from "./Pages/KolamAnalyzer .jsx";

const App = () => {
  return (
    <ShopProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<SellerPage />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/api/auth" element={<Auth />} />
        <Route path="/kolam" element={<KolamAnalyzer />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Footer />
    </ShopProvider>
  );
};

export default App;
