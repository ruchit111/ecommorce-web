import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./api";

const catalogProducts = [
    { id: 1, name: "Canvas Weekender", category: "Travel", price: 5699, color: "sage", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85" },
    { id: 2, name: "Stoneware Mug Set", category: "Home", price: 2699, color: "clay", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85" },
    { id: 3, name: "Everyday Linen Shirt", category: "Apparel", price: 4499, color: "sky", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85" },
    { id: 4, name: "Desk Lamp No. 2", category: "Workspace", price: 7199, color: "sun", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85" },
    { id: 5, name: "Cedar Scented Candle", category: "Home", price: 1999, color: "rose", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85" },
    { id: 6, name: "Leather Card Holder", category: "Accessories", price: 3499, color: "moss", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85" },
    { id: 7, name: "Soft Knit Throw", category: "Home", price: 6199, color: "lavender", image: "https://images.unsplash.com/photo-1580301762395-21cecc77f9a1?auto=format&fit=crop&w=700&q=85" },
    { id: 8, name: "Ribbed Travel Bottle", category: "Travel", price: 2399, color: "blue", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85" },
    { id: 9, name: "Leather Passport Wallet", category: "Travel", price: 2899, color: "moss", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85" },
    { id: 10, name: "Compact Travel Pillow", category: "Travel", price: 1899, color: "lavender", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85" },
    { id: 11, name: "Packable Daypack", category: "Travel", price: 3299, color: "sky", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=700&q=85" },
    { id: 12, name: "Travel Shoe Pouch", category: "Travel", price: 1299, color: "clay", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85" },
    { id: 13, name: "Foldable Sunglasses", category: "Travel", price: 2199, color: "sun", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85" },
    { id: 14, name: "Canvas Packing Cubes", category: "Travel", price: 2499, color: "sage", image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=700&q=85" },
    { id: 15, name: "Insulated Travel Flask", category: "Travel", price: 2799, color: "blue", image: "https://images.unsplash.com/photo-1544003484-3cd181d17917?auto=format&fit=crop&w=700&q=85" },
    { id: 16, name: "Weekend Travel Journal", category: "Travel", price: 999, color: "rose", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=85" },
    { id: 17, name: "Oak Serving Board", category: "Home", price: 3199, color: "sun", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85" },
    { id: 18, name: "Woven Storage Basket", category: "Home", price: 2899, color: "moss", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=700&q=85" },
    { id: 19, name: "Minimal Wall Clock", category: "Home", price: 3899, color: "clay", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=700&q=85" },
    { id: 20, name: "Linen Cushion Cover", category: "Home", price: 1499, color: "sky", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85" },
    { id: 21, name: "Ceramic Planter", category: "Home", price: 1799, color: "rose", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85" },
    { id: 22, name: "Cotton Hand Towel Set", category: "Home", price: 1299, color: "lavender", image: "https://images.unsplash.com/photo-1583845112203-454c3b7c9c8c?auto=format&fit=crop&w=700&q=85" },
    { id: 23, name: "Brass Candle Holder", category: "Home", price: 2199, color: "sun", image: "https://images.unsplash.com/photo-1602874801006-e26c8f0e7f56?auto=format&fit=crop&w=700&q=85" },
    { id: 24, name: "Relaxed Cotton T-Shirt", category: "Apparel", price: 1899, color: "sage", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=85" },
    { id: 25, name: "Relaxed Chino Trouser", category: "Apparel", price: 3299, color: "clay", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=85" },
    { id: 26, name: "Textured Overshirt", category: "Apparel", price: 3999, color: "moss", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85" },
    { id: 27, name: "Classic Denim Jacket", category: "Apparel", price: 4799, color: "blue", image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=85" },
    { id: 28, name: "Pleated Midi Skirt", category: "Apparel", price: 3599, color: "rose", image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=700&q=85" },
    { id: 29, name: "Merino Crewneck", category: "Apparel", price: 5299, color: "lavender", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85" },
    { id: 30, name: "Canvas Slip-On Shoes", category: "Apparel", price: 2899, color: "sky", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85" },
    { id: 31, name: "Ribbed Wool Scarf", category: "Apparel", price: 1699, color: "sun", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=700&q=85" },
    { id: 32, name: "Everyday Cotton Cap", category: "Apparel", price: 1199, color: "sage", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=85" },
    { id: 33, name: "Walnut Desk Organizer", category: "Workspace", price: 2499, color: "moss", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=85" },
    { id: 34, name: "Mechanical Pencil Set", category: "Workspace", price: 899, color: "sky", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85" },
    { id: 35, name: "Leather Desk Mat", category: "Workspace", price: 2899, color: "clay", image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=700&q=85" },
    { id: 36, name: "Ceramic Pen Cup", category: "Workspace", price: 1199, color: "rose", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=85" },
    { id: 37, name: "Adjustable Laptop Stand", category: "Workspace", price: 4299, color: "sun", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=700&q=85" },
    { id: 38, name: "Grid Project Notebook", category: "Workspace", price: 799, color: "lavender", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=85" },
    { id: 39, name: "Ergonomic Mouse Pad", category: "Workspace", price: 1499, color: "blue", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=85" },
    { id: 40, name: "Glass Water Carafe", category: "Workspace", price: 1899, color: "sage", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=700&q=85" },
    { id: 41, name: "Desk Cable Tray", category: "Workspace", price: 1399, color: "clay", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85" },
    { id: 42, name: "Slim Leather Belt", category: "Accessories", price: 2499, color: "moss", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85" },
    { id: 43, name: "Minimal Steel Watch", category: "Accessories", price: 6499, color: "blue", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85" },
    { id: 44, name: "Sculptural Hoop Earrings", category: "Accessories", price: 1899, color: "sun", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85" },
    { id: 45, name: "Everyday Tote Bag", category: "Accessories", price: 3799, color: "rose", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85" },
    { id: 46, name: "Round Acetate Sunglasses", category: "Accessories", price: 2199, color: "lavender", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=700&q=85" },
    { id: 47, name: "Silk Hair Scarf", category: "Accessories", price: 1599, color: "clay", image: "https://images.unsplash.com/photo-1601924928379-7f4d3f4c6b2f?auto=format&fit=crop&w=700&q=85" },
    { id: 48, name: "Braided Bracelet", category: "Accessories", price: 1299, color: "sage", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=85" },
    { id: 49, name: "Classic Leather Wallet", category: "Accessories", price: 2999, color: "moss", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=85" },
    { id: 50, name: "Pearl Pendant Necklace", category: "Accessories", price: 3299, color: "sky", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85" }
];

const maximumPrice = Math.max(...catalogProducts.map((product) => product.price));

function addToCart(product) {
    apiRequest("/api/products/sync", {
        method: "POST",
        body: JSON.stringify(product)
    }).catch((error) => console.error("Product sync failed:", error.message));

    const cart = JSON.parse(localStorage.getItem("shopzoneCart") || "[]");
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("shopzoneCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("shopzoneCartUpdated"));
}

function products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState(catalogProducts);
    const [categories, setCategories] = useState(["All"]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [priceLimit, setPriceLimit] = useState(maximumPrice);

    useEffect(() => {
        let isCurrent = true;

        async function loadCatalog() {
            try {
                await apiRequest("/api/products/sync-many", {
                    method: "POST",
                    body: JSON.stringify({ products: catalogProducts })
                });
                const [databaseProducts, databaseCategories] = await Promise.all([
                    apiRequest("/api/products"),
                    apiRequest("/api/products/categories")
                ]);
                if (isCurrent && databaseProducts.length) {
                    setProducts(databaseProducts);
                    setCategories(["All", ...databaseCategories]);
                }
            } catch (error) {
                console.error("Product catalog load failed:", error.message);
                if (isCurrent) setCategories(["All", ...new Set(catalogProducts.map((product) => product.category))]);
            }
        }

        loadCatalog();
        return () => { isCurrent = false; };
    }, []);

    const databaseMaximumPrice = Math.max(...products.map((product) => product.price), maximumPrice);

    useEffect(() => {
        setPriceLimit(databaseMaximumPrice);
    }, [databaseMaximumPrice]);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch = !query || `${product.name} ${product.category}`.toLowerCase().includes(query);
            const matchesCategory = category === "All" || product.category === category;
            return matchesSearch && matchesCategory && product.price <= priceLimit;
        });
    }, [category, priceLimit, products, search]);

    return(
        <main className="products-page">
            <section className="products-heading">
                <div>
                    <p className="eyebrow">The ShopZone edit</p>
                    <h1>Products</h1>
                    <p className="products-copy">Thoughtful picks for everyday living.</p>
                </div>
                <span className="product-count">{filteredProducts.length} items</span>
            </section>

            <section className="filter-panel" aria-label="Product filters">
                <label className="search-field">
                    <span>Search</span>
                    <input
                        type="search"
                        placeholder="Search the collection"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>

                <div className="category-filter">
                    <span>Category</span>
                    <div className="category-options">
                        {categories.map((item) => (
                            <button
                                className={category === item ? "category-button active" : "category-button"}
                                key={item}
                                onClick={() => setCategory(item)}
                                type="button"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <label className="price-filter">
                    <span>Up to <strong>₹{priceLimit.toLocaleString("en-IN")}</strong></span>
                    <input
                        type="range"
                        min="799"
                        max={databaseMaximumPrice}
                        value={priceLimit}
                        onChange={(event) => setPriceLimit(Number(event.target.value))}
                    />
                    <span className="price-range"><span>₹799</span><span>₹{databaseMaximumPrice.toLocaleString("en-IN")}</span></span>
                </label>
            </section>

            {filteredProducts.length > 0 ? (
                <section className="product-grid" aria-label="Product collection">
                    {filteredProducts.map((product) => (
                        <article
                            className="product-card"
                            key={product.id}
                            onClick={() => navigate(`/products/${product.id}`)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") navigate(`/products/${product.id}`);
                            }}
                            role="link"
                            tabIndex="0"
                        >
                            <div className={`product-art ${product.color}`}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.style.display = "none";
                                        event.currentTarget.parentElement.classList.add("image-fallback");
                                    }}
                                />
                            </div>
                            <div className="product-card-content">
                                <p className="product-category">{product.category}</p>
                                <h2>{product.name}</h2>
                                <div className="product-meta">
                                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                                    <button className="add-button" type="button" onClick={(event) => { event.stopPropagation(); addToCart(product); }} aria-label={`Add ${product.name} to cart`}>+</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <div className="empty-products">No pieces match those filters. Try widening your search.</div>
            )}
        </main>
    );
}
export default products;