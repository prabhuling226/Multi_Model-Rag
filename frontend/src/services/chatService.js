import api from "./api";

const chatService = {
    askQuestion: async (documentId, question) => {
        const response = await api.post("/chat/", {
            document_id: documentId,
            question: question,
        });

        return response.data;
    },
};

export default chatService;