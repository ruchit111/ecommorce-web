const { app, connectDatabase } = require("../backend/server");

module.exports = async function handler(request, response) {
    try {
        await connectDatabase();
        return app(request, response);
    } catch (error) {
        console.error("API startup failed:", error);
        return response.status(503).json({ message: "ShopZone API is not configured", error: error.message });
    }
};