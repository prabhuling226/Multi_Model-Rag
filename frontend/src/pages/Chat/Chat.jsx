import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import DashboardLayout from "../../components/layout/DashboardLayout";
import chatService from "../../services/chatService";
import { Send, Bot, User, Sparkles, Layers, ChevronDown, ChevronUp, FileText } from "lucide-react";

function Chat() {
    const { id } = useParams();
    const documentId = id ? Number(id) : null;

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: documentId
                ? "👋 Hello! I am your AI assistant trained on this specific document. Ask me any factual or analytical question."
                : "👋 Hello! I am your global RAG assistant. Ask me questions across all your ingested knowledge documents.",
            sources: [],
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [expandedSourceIndex, setExpandedSourceIndex] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!question.trim() || loading) return;

        const currentQuestion = question;
        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: currentQuestion,
                sources: [],
            },
        ]);

        setQuestion("");
        setLoading(true);

        try {
            let response;
            if (documentId) {
                response = await chatService.askQuestion(documentId, currentQuestion);
            } else {
                response = await chatService.askGlobalQuestion(currentQuestion);
            }

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: response.answer,
                    sources: response.sources || [],
                },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "❌ An error occurred while performing vector search and generating the LLM response.",
                    sources: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
                {/* Header Title Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2D5]">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1F1D1C] font-serif flex items-center gap-2">
                            <Bot className="text-[#C5A059]" size={26} />
                            <span>{documentId ? `Document Chat (File #${documentId})` : "Global AI Knowledge Chat"}</span>
                        </h1>
                        <p className="text-xs text-[#8C8782] mt-0.5">
                            {documentId
                                ? "Targeted vector retrieval restricted to selected document chunks"
                                : "Cross-document semantic vector retrieval over entire uploaded repository"}
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F7F3EA] border border-[#E8E2D5] rounded-full text-xs font-semibold text-[#8C7A6B]">
                        <Sparkles size={14} className="text-[#C5A059]" />
                        <span>Gemini 2.0 Flash</span>
                    </div>
                </div>

                {/* Message Log Feed */}
                <div className="flex-1 overflow-y-auto bg-white rounded-3xl border border-[#E8E2D5] p-6 space-y-6 shadow-xs">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 ${
                                message.sender === "user" ? "flex-row-reverse" : "flex-row"
                            }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-xs ${
                                    message.sender === "user"
                                        ? "bg-[#2C2A29] text-white"
                                        : "bg-[#F7F3EA] border border-[#E8E2D5] text-[#C5A059]"
                                }`}
                            >
                                {message.sender === "user" ? <User size={18} /> : <Bot size={18} />}
                            </div>

                            {/* Message Container */}
                            <div
                                className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                                    message.sender === "user"
                                        ? "bg-[#2C2A29] text-[#FBF9F5]"
                                        : "bg-[#FBF9F5] border border-[#E8E2D5] text-[#1F1D1C]"
                                }`}
                            >
                                {message.sender === "user" ? (
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                                ) : (
                                    <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#1F1D1C] prose-p:text-[#383533] prose-li:text-[#383533] prose-table:border prose-table:border-[#E8E2D5] prose-th:bg-[#F7F3EA] prose-th:p-2 prose-td:p-2 prose-code:bg-[#E8E2D5] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#2C2A29] prose-pre:text-white">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.text}
                                        </ReactMarkdown>
                                    </div>
                                )}

                                {/* Source Chunks Accordion */}
                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-[#E8E2D5]">
                                        <button
                                            onClick={() =>
                                                setExpandedSourceIndex(
                                                    expandedSourceIndex === index ? null : index
                                                )
                                            }
                                            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7A6B] hover:text-[#2C2A29] transition"
                                        >
                                            <Layers size={14} className="text-[#C5A059]" />
                                            <span>Retrieved Context Chunks ({message.sources.length})</span>
                                            {expandedSourceIndex === index ? (
                                                <ChevronUp size={14} />
                                            ) : (
                                                <ChevronDown size={14} />
                                            )}
                                        </button>

                                        {expandedSourceIndex === index && (
                                            <div className="mt-3 space-y-2">
                                                {message.sources.map((src, sIdx) => (
                                                    <div
                                                        key={sIdx}
                                                        className="bg-white border border-[#E8E2D5] rounded-xl p-3 text-xs text-[#54504C]"
                                                    >
                                                        <div className="flex items-center justify-between font-semibold text-[#1F1D1C] mb-1">
                                                            <span className="flex items-center gap-1.5 truncate">
                                                                <FileText size={13} className="text-[#C5A059]" />
                                                                {src.document_name}
                                                            </span>
                                                            <span className="text-[10px] bg-[#F7F3EA] px-2 py-0.5 rounded-full border border-[#E8E2D5] text-[#8C7A6B]">
                                                                Page {src.page_number}
                                                            </span>
                                                        </div>
                                                        <p className="italic text-[#6E6A66] line-clamp-3">
                                                            "{src.snippet}"
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-9 h-9 rounded-xl bg-[#F7F3EA] border border-[#E8E2D5] text-[#C5A059] flex items-center justify-center shrink-0">
                                <Bot size={18} />
                            </div>
                            <div className="bg-[#FBF9F5] border border-[#E8E2D5] rounded-2xl px-5 py-3.5 text-xs text-[#8C7A6B] flex items-center gap-2">
                                <Sparkles size={16} className="animate-spin text-[#C5A059]" />
                                <span>Retrieving vector embeddings & generating response...</span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Bar */}
                <div className="flex gap-3 mt-4">
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                        placeholder={
                            documentId
                                ? "Ask a question about this document..."
                                : "Ask a query across all your knowledge documents..."
                        }
                        className="flex-1 bg-white border border-[#E8E2D5] rounded-2xl px-5 py-3.5 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#F7F3EA] text-sm text-[#1F1D1C] placeholder-[#8C8782] shadow-xs"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading || !question.trim()}
                        className="bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] px-7 rounded-2xl font-semibold transition disabled:opacity-50 flex items-center gap-2 shadow-xs"
                    >
                        <span>Send</span>
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Chat;