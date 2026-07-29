import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import DashboardLayout from "../../components/layout/DashboardLayout";
import chatService from "../../services/chatService";

function Chat() {
    const { id } = useParams();

    const documentId = id ? Number(id) : null;

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: documentId
                ? "👋 Hello! Ask me anything about this document."
                : "👋 Hello! Ask me anything across all your uploaded documents.",
        },
    ]);

    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const sendMessage = async () => {
        if (!question.trim()) return;

        const currentQuestion = question;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: currentQuestion,
            },
        ]);

        setQuestion("");
        setLoading(true);

        try {
            let response;

            if (documentId) {
                response = await chatService.askQuestion(
                    documentId,
                    currentQuestion
                );
            } else {
                response = await chatService.askGlobalQuestion(
                    currentQuestion
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: response.answer,
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "❌ Something went wrong while generating the response.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[85vh]">

                <h1 className="text-3xl font-bold mb-6">
                    {documentId ? "📄 Document Chat" : "🤖 Global AI Chat"}
                </h1>

                <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-[#E8DDD0] p-6">

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-5 flex ${
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm ${
                                    message.sender === "user"
                                        ? "bg-[#25211E] text-white"
                                        : "bg-[#F7F2EB] text-gray-800"
                                }`}
                            >
                                {message.sender === "user" ? (
                                    <p className="whitespace-pre-wrap">
                                        {message.text}
                                    </p>
                                ) : (
                                    <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-table:border prose-th:border prose-td:border prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {message.text}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="bg-[#F7F2EB] inline-block px-5 py-3 rounded-2xl shadow-sm">
                            🤖 Thinking...
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <div className="flex gap-4 mt-5">

                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        placeholder={
                            documentId
                                ? "Ask anything about this document..."
                                : "Ask anything across your documents..."
                        }
                        className="flex-1 border border-[#E8DDD0] rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#25211E]"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="bg-[#25211E] text-white px-8 rounded-xl hover:bg-black transition disabled:opacity-50"
                    >
                        Send
                    </button>

                </div>
            </div>
        </DashboardLayout>
    );
}

export default Chat;