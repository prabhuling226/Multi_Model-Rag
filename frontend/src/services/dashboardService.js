import api from "./api";

const dashboardService = {
    async getDashboardStats() {
        const response = await api.get("/dashboard");
        return response.data;
    },
};

export default dashboardService;