import React from "react";

function home () {
    return (
        <main className="home-page">
            <section className="hero-section">
                <p className="eyebrow">Curated daily essentials</p>
                <h1>Good things,<br />well chosen.</h1>

                <p className="hero-copy">
                    Find useful, beautiful products at prices that feel just right.
                </p>
                <a className="hero-link" href="/products">Explore products <span aria-hidden="true">-&gt;</span></a>
            </section>
        </main>

    );
}

export default home;
