import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import "./auth.css";
import { apiRequest } from "./api";

function login () {
const navigate = useNavigate();

const [formData, setFormData] = useState({
    email :"",
    password : ""
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
    });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    alert("Please fill in all fields.");
        return ;
    }

    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      localStorage.setItem("shopzoneRegistered", "true");
      localStorage.setItem("shopzoneUserName", result.user.name);
      localStorage.setItem("shopzoneToken", result.token);
      alert("Login successful.");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
}

return(
      <div className="auth-container">

      <div className="auth-box">

        <h2>Welcome Back</h2>
        <p>Login to your ShopZone account</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account?

          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );

}

export default login