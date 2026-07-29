import api from "./api";

const profileService = {
    async getProfile() {
        const response = await api.get("/profile/");
        return response.data;
    },
};

export default profileService;