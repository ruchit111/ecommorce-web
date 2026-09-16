import React from "react";
import { Link } from "react-router-dom";

function Offers() {
    return (
        <main className="content-page offers-page">
            <section className="content-hero">
                <div className="content-hero-copy">
                    <p className="eyebrow">The ShopZone advantage</p>
                    <h1>More in your basket, less on your bill.</h1>
                    <p>Build a useful collection and unlock extra value at checkout.</p>
                    <Link className="primary-action" to="/products">Browse the collection</Link>
                </div>
                <img className="content-hero-image" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85" alt="Leather wallet and everyday accessories" />
            </section>

            <section className="offer-highlight">
                <div><span className="content-card-number">10%</span><h2>A little thank-you for a fuller cart.</h2></div>
                <p>Spend over ₹10,000 and 10% is applied automatically at checkout.</p>
            </section>

            <section className="content-grid" aria-label="ShopZone offers">
                <article className="content-card"><img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=85" alt="Organized workspace with desk accessories" /><div className="content-card-body"><span className="content-card-number">01</span><h2>Under ₹2,000</h2><p>Small upgrades for everyday spaces.</p><Link to="/products">Shop the edit</Link></div></article>
                <article className="content-card"><img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85" alt="Canvas travel bag ready for a weekend away" /><div className="content-card-body"><span className="content-card-number">02</span><h2>Travel-ready</h2><p>Useful companions for the journey.</p><Link to="/products">See travel pieces</Link></div></article>
                <article className="content-card"><img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=700&q=85" alt="Shopping packages prepared for delivery" /><div className="content-card-body"><span className="content-card-number">03</span><h2>Free delivery</h2><p>Complimentary above ₹999.</p><Link to="/products">Start shopping</Link></div></article>
            </section>
        </main>
    );
}

export default Offers;