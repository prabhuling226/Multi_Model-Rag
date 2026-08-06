import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import documentService from "../../services/documentService";
import { FileText, MessageSquare, Trash2, Plus, Sparkles, Layers, Calendar } from "lucide-react";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document and all associated embeddings?"
        );

        if (!confirmDelete) return;

        try {
            await documentService.deleteDocument(id);
            loadDocuments();
        } catch (error) {
            console.error(error);
            alert("Failed to delete document.");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1F1D1C] font-serif">
                            Knowledge Library
                        </h1>
                        <p className="text-sm text-[#54504C] mt-1">
                            Browse ingested documents, chunk counts, and query any specific file directly with Gemini AI.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/upload")}
                        className="bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] px-5 py-3 rounded-xl font-semibold text-sm shadow-xs transition flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Ingest New Document
                    </button>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-[#8C8782] gap-3">
                        <Sparkles className="animate-spin text-[#C5A059]" size={24} />
                        <span>Loading Ingested Documents...</span>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#E8E2D5] p-12 text-center shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-[#F7F3EA] border border-[#E8E2D5] text-[#C5A059] flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-[#1F1D1C]">
                            No Documents Found in Vector Store
                        </h2>
                        <p className="text-sm text-[#8C8782] mt-2 max-w-sm mx-auto">
                            Get started by ingesting your PDF, DOCX, or text files into the RAG pipeline.
                        </p>
                        <button
                            onClick={() => navigate("/upload")}
                            className="mt-6 px-6 py-3 rounded-xl bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] text-sm font-semibold transition inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Upload First Document
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <span className="p-2.5 rounded-xl bg-[#F7F3EA] border border-[#F0EAE1] text-[#C5A059]">
                                            <FileText size={20} />
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F5F2EB] text-[#8C7A6B] border border-[#E8E2D5]">
                                            {doc.file_type ? doc.file_type.replace(".", "").toUpperCase() : "DOC"}
                                        </span>
                                    </div>

                                    <h2 className="text-base font-bold text-[#1F1D1C] break-all line-clamp-2">
                                        {doc.filename}
                                    </h2>

                                    <div className="flex items-center gap-4 mt-4 text-xs text-[#8C8782]">
                                        <div className="flex items-center gap-1.5">
                                            <Layers size={14} className="text-[#C5A059]" />
                                            <span>{doc.chunk_count ?? 0} Vector Chunks</span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <span>
                                                {doc.uploaded_at
                                                    ? new Date(doc.uploaded_at).toLocaleDateString()
                                                    : "Ingested"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-6 pt-4 border-t border-[#F0EAE1]">
                                    <button
                                        onClick={() => navigate(`/chat/${doc.id}`)}
                                        className="flex-1 bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={14} />
                                        <span>Query File</span>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="bg-[#FAF0F0] hover:bg-[#FAF0F0] text-[#A34343] p-2.5 rounded-xl transition border border-[#F4D3D3]"
                                        title="Delete document"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Documents;