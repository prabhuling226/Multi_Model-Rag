import axios from "axios";

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    if (url && typeof url === "string" && url.trim()) {
        if (url.includes("VITE_API_URL=")) {
            url = url.replace(/VITE_API_URL=/g, "");
        }
        url = url.trim();
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
    }
    return "https://multi-model-rag.onrender.com/api/v1";
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor: Automatically redirect to /login on 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (
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