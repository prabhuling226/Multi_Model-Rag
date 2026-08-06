import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import documentService from "../../services/documentService";
import { UploadCloud, File, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

function Upload() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleFileChange = (event) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setStatusMessage({ type: "error", text: "Please select at least one document to ingest." });
            return;
        }

        try {
            setLoading(true);
            setStatusMessage({ type: "info", text: "Ingesting documents, generating embeddings & vector chunks..." });

            await documentService.uploadDocuments(files);

            setStatusMessage({ type: "success", text: "Documents successfully ingested and vector indexed!" });
            setFiles([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error(error);
            setStatusMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to process documents."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#1F1D1C] font-serif">
                        Document Ingestion & Chunk Vectorizer
                    </h1>
                    <p className="text-sm text-[#54504C] mt-2">
                        Upload PDFs, Word documents, Excel spreadsheets, PPT presentations, text files, or images for automated chunking and embedding storage.
                    </p>
                </div>

                <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 shadow-xs">
                    {/* Drag and Drop Zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#DFD7C7] hover:border-[#C5A059] bg-[#FBF9F5] rounded-2xl p-10 text-center cursor-pointer transition-all group"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.txt,.md,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className="w-16 h-16 rounded-full bg-[#F7F3EA] border border-[#E8E2D5] text-[#C5A059] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud size={30} />
                        </div>

                        <h3 className="text-base font-bold text-[#1F1D1C]">
                            Click to browse or drag & drop files here
                        </h3>
                        <p className="text-xs text-[#8C8782] mt-1">
                            Supported: PDF, DOCX, XLSX, PPTX, TXT, MD, PNG, JPG (Max 50MB per file)
                        </p>
                    </div>

                    {/* Selected Files List */}
                    {files.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-xs font-bold uppercase text-[#8C7A6B] tracking-wider mb-3">
                                Ready for Vector Ingestion ({files.length})
                            </h4>

                            <ul className="space-y-2 max-h-48 overflow-y-auto">
                                {files.map((file, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between bg-[#FBF9F5] border border-[#E8E2D5] rounded-xl px-4 py-3 text-sm text-[#1F1D1C]"
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            <File size={18} className="text-[#C5A059] shrink-0" />
                                            <span className="truncate font-medium">{file.name}</span>
                                        </div>
                                        <span className="text-xs text-[#8C8782] shrink-0 ml-3">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Status Alert Banner */}
                    {statusMessage && (
                        <div
                            className={`mt-6 p-4 rounded-xl text-sm flex items-center gap-3 border ${
                                statusMessage.type === "success"
                                    ? "bg-[#F3F9F4] border-[#D1E8D5] text-[#2D6A3E]"
                                    : statusMessage.type === "error"
                                    ? "bg-[#FAF0F0] border-[#F4D3D3] text-[#A34343]"
                                    : "bg-[#F7F3EA] border-[#E8E2D5] text-[#8C7A6B]"
                            }`}
                        >
                            {statusMessage.type === "success" ? (
                                <CheckCircle2 size={18} />
                            ) : statusMessage.type === "error" ? (
                                <AlertCircle size={18} />
                            ) : (
                                <Sparkles size={18} className="animate-spin text-[#C5A059]" />
                            )}
                            <span>{statusMessage.text}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleUpload}
                            disabled={loading || files.length === 0}
                            className="flex-1 bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] py-3.5 rounded-xl font-semibold shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Sparkles size={18} className="animate-spin text-[#C5A059]" />
                                    <span>Processing & Vectorizing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Start Document Ingestion</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        {statusMessage?.type === "success" && (
                            <button
                                onClick={() => navigate("/documents")}
                                className="px-6 bg-[#E8E2D5] text-[#2C2A29] hover:bg-[#DFD7C7] py-3.5 rounded-xl font-semibold transition"
                            >
                                View Knowledge Library
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Upload;