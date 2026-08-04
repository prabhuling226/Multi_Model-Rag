import api from "./api";

const documentService = {
    uploadDocuments: async (files) => {

        console.log("FILES RECEIVED:", files);

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        console.log("----- FORM DATA -----");
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

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