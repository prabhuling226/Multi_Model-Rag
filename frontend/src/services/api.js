import axios from "axios";

const getBaseUrl = () => {
    // If running locally in development or on localhost, connect directly to local FastAPI server
    if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ) {
        return "http://localhost:8000/api/v1";
    }

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

    return "https://multi-model-rag.onrender.com/api/v1";
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

// Request Interceptor: Attach Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor: Redirect to /login on 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (
                typeof window !== "undefined" &&
                window.location.pathname !== "/login" &&
                window.location.pathname !== "/register"
            ) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;