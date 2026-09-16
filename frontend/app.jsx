import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./componants/navbar";

import Home from "./home";
import Products from "./product";
import Login from "./login";
import Register from "./register";
import Cart from "./cart";
import Payment from "./payment";
import Offers from "./offers";
import About from "./about";
import ProductDetail from "./product-detail";

import "./app.css"


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isRegistered = localStorage.getItem("shopzoneRegistered") === "true";
  const isRegistrationPage = location.pathname === "/register";

  return (
    <>
      {isRegistered && !isRegistrationPage && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={isRegistered ? <Home /> : <Navigate to="/register" replace />}
        />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to={isRegistered ? "/" : "/register"} replace />} />
      </Routes>
    </>
  );
}

export default App;