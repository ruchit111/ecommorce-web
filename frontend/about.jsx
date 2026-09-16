import React from "react";

function About() {
    return (
        <main className="content-page about-page">
            <section className="content-hero">
                <div className="content-hero-copy">
                    <p className="eyebrow">A little about us</p>
                    <h1>Useful can still feel special.</h1>
                    <p>A quiet edit of products for daily rituals and thoughtful spaces.</p>
                </div>
                <img className="content-hero-image" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85" alt="Warm, considered workspace with useful objects" />
            </section>
            <section className="about-details">
                <div><p className="eyebrow">Our point of view</p><h2>Less noise.<br />Better picks.</h2></div>
                <p>Practical materials, considered details, and fair prices. Useful first, beautiful enough to keep around.</p>
            </section>
            <section className="about-values">
                <article><span>01</span><h2>Considered</h2><p>A focused collection, easy to browse.</p></article>
                <article><span>02</span><h2>Honest</h2><p>Clear prices and automatic offers.</p></article>
                <article><span>03</span><h2>Everyday</h2><p>Made for real routines.</p></article>
            </section>
            <section className="about-image-row" aria-label="ShopZone collection details">
                <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=85" alt="Stoneware mug on a quiet table" />
                <div><p className="eyebrow">Made for your rhythm</p><h2>Objects with staying power.</h2><p>Designed to meet real life with ease.</p></div>
            </section>
        </main>
    );
}

export default About;