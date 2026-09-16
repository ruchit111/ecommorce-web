import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "./api";
import { calculatePricing } from "./pricing";

function Payment() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: localStorage.getItem("shopzoneUserName") || "",
        address: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const cart = JSON.parse(localStorage.getItem("shopzoneCart") || "[]");
    const pricing = calculatePricing(cart);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        if (Object.values(formData).some((value) => !value.trim())) {
            alert("Please fill in all payment and delivery details.");
            return;
        }

        setIsSubmitting(true);
        try {
            await apiRequest("/api/orders", {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("shopzoneToken")}` },
                body: JSON.stringify({
                    items: cart,
                    total: pricing.total,
                    subtotal: pricing.subtotal,
                    delivery: pricing.delivery,
                    discount: pricing.discount,
                    deliveryDetails: { name: formData.name, address: formData.address },
                    paymentLastFour: formData.cardNumber.replace(/\s/g, "").slice(-4)
                })
            });
            localStorage.removeItem("shopzoneCart");
            window.dispatchEvent(new Event("shopzoneCartUpdated"));
            alert("Payment successful. Your order has been placed.");
            navigate("/");
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <main className="payment-page empty-cart">
                <h1>No order to pay for</h1>
                <Link className="primary-action" to="/products">Return to products</Link>
            </main>
        );
    }

    return (
        <main className="payment-page">
            <section className="payment-heading">
                <p className="eyebrow">Secure checkout</p>
                <h1>Complete your order</h1>
                <p>Enter your delivery and payment details to finish your purchase.</p>
            </section>

            <form className="payment-layout" onSubmit={handleSubmit}>
                <section className="payment-form">
                    <h2>Delivery details</h2>
                    <label className="payment-field">Full name<input name="name" value={formData.name} onChange={handleChange} /></label>
                    <label className="payment-field">Delivery address<textarea name="address" rows="3" value={formData.address} onChange={handleChange} /></label>
                    <h2>Payment details</h2>
                    <label className="payment-field">Card number<input inputMode="numeric" name="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleChange} /></label>
                    <div className="payment-row">
                        <label className="payment-field">Expiry date<input name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleChange} /></label>
                        <label className="payment-field">CVV<input inputMode="numeric" name="cvv" placeholder="123" value={formData.cvv} onChange={handleChange} /></label>
                    </div>
                </section>
                <aside className="payment-summary">
                    <h2>Amount to pay</h2>
                    <div className="payment-breakdown"><span>Subtotal</span><strong>₹{pricing.subtotal.toLocaleString("en-IN")}</strong></div>
                    <div className="payment-breakdown"><span>Delivery</span><strong>{pricing.delivery ? `₹${pricing.delivery}` : "Free"}</strong></div>
                    {pricing.discount > 0 && <div className="payment-breakdown discount-line"><span>10% offer</span><strong>-₹{pricing.discount.toLocaleString("en-IN")}</strong></div>}
                    <strong className="payment-total">₹{pricing.total.toLocaleString("en-IN")}</strong>
                    <p>{cart.reduce((sum, item) => sum + item.quantity, 0)} items in your order</p>
                    <button className="primary-action" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving order..." : "Pay securely"}
                    </button>
                </aside>
            </form>
        </main>
    );
}

export default Payment;
