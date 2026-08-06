import axios from "axios";

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    if (url && typeof url === "string" && url.trim()) {
        if (url.includes("VITE_API_URL=")) {
            url = url.replace(/VITE_API_URL=/g, "");
        }
        url = url.trim();
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
            return url;
        }
    }
    // Default to relative API endpoint (proxied by Vercel serverless rewrite)
    return "/api/v1";
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;