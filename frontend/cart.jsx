import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { calculatePricing, DISCOUNT_THRESHOLD } from "./pricing";

function readCart() {
    return JSON.parse(localStorage.getItem("shopzoneCart") || "[]");
}

function Cart() {
    const [cart, setCart] = useState(readCart);
    const navigate = useNavigate();

    useEffect(() => {
        const updateCart = () => setCart(readCart());
        window.addEventListener("shopzoneCartUpdated", updateCart);
        return () => window.removeEventListener("shopzoneCartUpdated", updateCart);
    }, []);

    const updateCart = (productId, quantity) => {
        const nextCart = cart
            .map((item) => item.id === productId ? { ...item, quantity } : item)
            .filter((item) => item.quantity > 0);
        setCart(nextCart);
        localStorage.setItem("shopzoneCart", JSON.stringify(nextCart));
        window.dispatchEvent(new Event("shopzoneCartUpdated"));
    };

    const removeProduct = (productId) => updateCart(productId, 0);
    const { subtotal, delivery, discount, total } = calculatePricing(cart);

    if (cart.length === 0) {
        return (
            <main className="cart-page empty-cart">
                <p className="eyebrow">Your ShopZone bag</p>
                <h1>Your cart is empty</h1>
                <p>Add something useful from the collection and it will appear here.</p>
                <Link className="primary-action" to="/products">Continue shopping</Link>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <section className="cart-heading">
                <div>
                    <p className="eyebrow">Your ShopZone bag</p>
                    <h1>Shopping cart</h1>
                </div>
                <Link className="continue-link" to="/products">Continue shopping</Link>
            </section>

            <div className="cart-layout">
                <section className="cart-items" aria-label="Cart items">
                    {cart.map((item) => (
                        <article className="cart-item" key={item.id}>
                            <img
                                src={item.image}
                                alt={item.name}
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.style.display = "none";
                                    event.currentTarget.parentElement.classList.add("image-fallback");
                                }}
                            />
                            <div className="cart-item-details">
                                <p className="product-category">{item.category}</p>
                                <h2>{item.name}</h2>
                                <strong>₹{item.price.toLocaleString("en-IN")}</strong>
                                <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
                                    <button type="button" onClick={() => updateCart(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button type="button" onClick={() => updateCart(item.id, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                            <button className="remove-button" type="button" onClick={() => removeProduct(item.id)}>Remove</button>
                        </article>
                    ))}
                </section>

                <aside className="order-summary">
                    <h2>Order summary</h2>
                    <div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
                    <div><span>Delivery</span><strong>{delivery ? `₹${delivery}` : "Free"}</strong></div>
                    <div className={discount ? "discount-line" : "discount-line muted"}>
                        <span>10% offer {subtotal > DISCOUNT_THRESHOLD ? "applied" : `above ₹${DISCOUNT_THRESHOLD.toLocaleString("en-IN")}`}</span>
                        <strong>{discount ? `-₹${discount.toLocaleString("en-IN")}` : "-"}</strong>
                    </div>
                    <div className="summary-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
                    <button className="primary-action" type="button" onClick={() => navigate("/payment")}>Place order</button>
                </aside>
            </div>
        </main>
    );
}

export default Cart;
    