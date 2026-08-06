import api from "./api";

const authService = {
    register: async (data) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    login: async ({ email, password }) => {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const response = await api.post(
            "/auth/login",
            formData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data;
    },
};

export default authService;