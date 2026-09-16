import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "./api";

function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("shopzoneCart") || "[]");
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) existingProduct.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("shopzoneCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("shopzoneCartUpdated"));
}

function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let isCurrent = true;
        apiRequest(`/api/products/${productId}`).then((data) => {
            if (isCurrent) setProduct(data);
        }).catch((requestError) => {
            if (isCurrent) setError(requestError.message);
        });
        return () => { isCurrent = false; };
    }, [productId]);

    if (error) return <main className="product-detail-page empty-products"><h1>{error}</h1><Link to="/products">Back to products</Link></main>;
    if (!product) return <main className="product-detail-page product-loading">Loading product...</main>;

    return (
        <main className="product-detail-page">
            <Link className="back-link" to="/products">&lt;- Back to products</Link>
            <section className="product-detail-layout">
                <div className="product-detail-art">
                    <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.style.display = "none"; event.currentTarget.parentElement.classList.add("image-fallback"); }} />
                </div>
                <div className="product-detail-copy">
                    <p className="product-category">{product.category}</p>
                    <h1>{product.name}</h1>
                    <strong className="product-detail-price">₹{product.price.toLocaleString("en-IN")}</strong>
                    <p className="product-detail-description">A thoughtfully selected {product.category.toLowerCase()} essential made for daily use, with a balance of useful details and easy style.</p>
                    <div className="product-detail-points"><span>✓ Carefully selected by ShopZone</span><span>✓ Free delivery above ₹999</span><span>✓ 10% off orders above ₹10,000</span></div>
                    <button className="primary-action" type="button" onClick={() => { addToCart(product); navigate("/cart"); }}>Add to cart</button>
                </div>
            </section>
        </main>
    );
}

export default ProductDetail;