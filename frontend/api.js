const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: { "Content-Type": "application/json", ...(options.headers || {}) }
        });
    } catch {
        throw new Error("ShopZone API is unavailable. Start MongoDB and the backend server, then try again.");
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("shopzoneRegistered");
            localStorage.removeItem("shopzoneUserName");
            localStorage.removeItem("shopzoneToken");
            if (window.location.pathname !== "/login") window.location.assign("/login");
        }
        throw new Error(data.error ? `${data.message}: ${data.error}` : (data.message || "Request failed"));
    }
    return data;
}  

export { API_URL };
