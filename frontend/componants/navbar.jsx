import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const [cartCount, setCartCount] = useState(getCartCount);

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartCount());
    window.addEventListener("shopzoneCartUpdated", updateCartCount);
    return () => window.removeEventListener("shopzoneCartUpdated", updateCartCount);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          ShopZone
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/products">Products</Link>
          </li>

          <li>
            <Link to="/offers">Offers</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div className="nav-right">

          <Link to="/cart" className="cart">
            Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <span className="user-greeting">
            Hi, {localStorage.getItem("shopzoneUserName") || "Shopper"}
          </span>

          <Link to="/login" className="login-btn">
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
}

function getCartCount() {
  return JSON.parse(localStorage.getItem("shopzoneCart") || "[]")
    .reduce((total, item) => total + item.quantity, 0);
}

export default Navbar;