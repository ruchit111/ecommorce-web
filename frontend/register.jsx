import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { apiRequest } from "./api";

function register() {
    const navigate = useNavigate();

    const [formdata, setformdata] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });

    const handleChange = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formdata.name ||
            !formdata.email ||
            !formdata.password ||
            !formdata.confirmpassword
        ) {
            alert("please fill all fields");
            return;
        }

        if (formdata.password !== formdata.confirmpassword) {
            alert("password do not match");
            return;
        }

        try {
            const result = await apiRequest("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ name: formdata.name.trim(), email: formdata.email, password: formdata.password })
            });
            localStorage.setItem("shopzoneRegistered", "true");
            localStorage.setItem("shopzoneUserName", result.user.name);
            localStorage.setItem("shopzoneToken", result.token);
            alert("Registration successful.");
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>create account</h2> 
                <p>create your shopzone account</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text"
                            id="name"
                            name="name"
                            placeholder="enter your name"
                            value={formdata.name}
                            onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            id="email"
                            name="email"
                            placeholder="enter your email"
                            value={formdata.email}
                            onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            id="password"
                            name="password"
                            placeholder="create password"
                            value={formdata.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm password</label>
                        <input type="password"
                            id="confirmpassword"
                            name="confirmpassword"
                            placeholder="confirm password"
                            value={formdata.confirmpassword}
                            onChange={handleChange} />

                    </div>
                    <button type="submit" className="auth-button">
                        register
                    </button>
                </form>

                <p className="register-text">
                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>
                </p>


            </div>
        </div>
    );

}

export default register;

