const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "shopzone-development-secret";

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    productId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        productId: Number,
        name: String,
        category: String,
        price: Number,
        image: String,
        quantity: Number
    }],
    total: { type: Number, required: true },
    deliveryDetails: { name: String, address: String },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentLastFour: String,
    status: { type: String, default: "paid" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

let memoryServer;

async function connectDatabase() {
    if (mongoose.connection.readyState === 1) return;

    let mongoUri = process.env.MONGODB_URI;
    if (process.env.USE_MEMORY_DB === "true") {
        memoryServer = memoryServer || await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri("shopzone");
        console.log("Development MongoDB started automatically.");
    }

    if (!mongoUri) {
        throw new Error("MONGODB_URI is required in production");
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
}

function createToken(user) {
    return jwt.sign({ userId: user._id, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
}

function requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Authentication required" });

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

app.get("/", (req, res) => {
    res.json({ message: "ShopZone API is running" });
});

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required" });
        if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: "Email is already registered" });

        const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
        res.status(201).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Could not create account", error: error.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email?.toLowerCase() });
        if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password" });
        res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Could not log in", error: error.message });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const filter = req.query.category && req.query.category !== "All"
            ? { category: req.query.category }
            : {};
        const products = await Product.find(filter).sort({ productId: 1 }).lean();
        res.json(products.map((product) => ({
            id: product.productId,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image
        })));
    } catch (error) {
        res.status(500).json({ message: "Could not load products", error: error.message });
    }
});

app.get("/api/products/categories", async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.json(categories.filter(Boolean).sort((first, second) => first.localeCompare(second)));
    } catch (error) {
        res.status(500).json({ message: "Could not load categories", error: error.message });
    }
});

app.get("/api/products/:productId", async (req, res) => {
    try {
        const product = await Product.findOne({ productId: Number(req.params.productId) }).lean();
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ id: product.productId, name: product.name, category: product.category, price: product.price, image: product.image });
    } catch (error) {
        res.status(400).json({ message: "Could not load product", error: error.message });
    }
});

app.post("/api/products/sync-many", async (req, res) => {
    try {
        if (!Array.isArray(req.body?.products)) return res.status(400).json({ message: "Products must be an array" });
        await Product.bulkWrite(req.body.products.map((product) => ({
            updateOne: {
                filter: { productId: product.id },
                update: { productId: product.id, name: product.name, category: product.category, price: product.price, image: product.image },
                upsert: true
            }
        })));
        res.status(201).json({ count: req.body.products.length });
    } catch (error) {
        res.status(400).json({ message: "Could not sync products", error: error.message });
    }
});

app.post("/api/products/sync", async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { productId: req.body.id },
            { productId: req.body.id, name: req.body.name, category: req.body.category, price: req.body.price, image: req.body.image },
            { upsert: true, new: true, runValidators: true }
        );
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Could not save product", error: error.message });
    }
});

app.post("/api/orders", requireAuth, async (req, res) => {
    try {
        const { items, deliveryDetails, paymentLastFour } = req.body || {};
        if (!items?.length || !deliveryDetails?.name || !deliveryDetails?.address) {
            return res.status(400).json({ message: "Order details are incomplete" });
        }

        if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
            return res.status(401).json({ message: "Your session is invalid. Please log in again." });
        }

        const normalizedItems = items.map((item) => ({
            productId: Number(item.productId ?? item.id),
            name: item.name,
            category: item.category,
            price: Number(item.price),
            image: item.image,
            quantity: Number(item.quantity)
        }));

        if (normalizedItems.some((item) => !Number.isInteger(item.productId) || !Number.isFinite(item.price) || !Number.isInteger(item.quantity) || item.quantity < 1)) {
            return res.status(400).json({ message: "Cart contains invalid product details" });
        }

        const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = subtotal > 0 && subtotal < 999 ? 99 : 0;
        const discount = subtotal > 10000 ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal + deliveryFee - discount;

        const order = await Order.create({
            user: req.user.userId,
            items: normalizedItems,
            subtotal,
            deliveryFee,
            discount,
            total,
            deliveryDetails: { name: deliveryDetails.name.trim(), address: deliveryDetails.address.trim() },
            paymentLastFour,
            status: "paid"
        });
        res.status(201).json({
            orderId: order._id,
            status: order.status,
            subtotal: order.subtotal,
            deliveryFee: order.deliveryFee,
            discount: order.discount,
            total: order.total
        });
    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ message: "Could not save order", error: process.env.NODE_ENV === "development" ? error.message : undefined });
    }
});

async function startServer() {
    try {
        await connectDatabase();
        app.listen(PORT, () => console.log(`ShopZone API running on port ${PORT}`));

        const shutdown = async () => {
            await mongoose.disconnect();
            if (memoryServer) await memoryServer.stop();
            process.exit(0);
        };
        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    } catch (error) {
        console.error("MongoDB startup failed:", error.message);
        process.exit(1);
    }
}

if (require.main === module) startServer();

module.exports = { app, connectDatabase };
