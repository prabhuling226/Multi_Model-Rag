import api from "./api";

const documentService = {
    uploadDocuments: async (files) => {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        // Do not pass manual Content-Type header so browser automatically computes multipart boundary
        const response = await api.post(
            "/documents/upload",
            formData
        );

        return response.data;
    },

    getDocuments: async () => {
        const response = await api.get("/documents/");
        return response.data;
    },

    deleteDocument: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },
};

export default documentService;