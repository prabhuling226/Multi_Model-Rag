import axios from "axios";

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    if (!url || typeof url !== "string") {
        return "https://multi-model-rag.onrender.com/api/v1";
    }
    // Clean up if duplicated "VITE_API_URL=" prefix exists
    if (url.includes("VITE_API_URL=")) {
        url = url.replace(/VITE_API_URL=/g, "");
    }
    return url.trim() || "https://multi-model-rag.onrender.com/api/v1";
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