import api from "./api";

const chatService = {
    askQuestion: async (documentId, question) => {
        const response = await api.post("/chat/", {
            document_id: documentId,
            question: question,
        });
        return response.data;
    },

    askGlobalQuestion: async (question) => {
        const response = await api.post("/chat/", {
            document_id: null,
            question: question,
        });
        return response.data;
    },

    getHistory: async (documentId = null) => {
        const url = documentId ? `/chat/history?document_id=${documentId}` : "/chat/history";
        const response = await api.get(url);
        return response.data;
    }
};

export default chatService;