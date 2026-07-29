import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import documentService from "../../services/documentService";

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
            "Are you sure you want to delete this document?"
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Documents</h1>

                <button
                    onClick={() => navigate("/upload")}
                    className="bg-[#25211E] text-white px-5 py-2 rounded-lg"
                >
                    Upload New
                </button>
            </div>

            {loading ? (
                <div className="text-center mt-20">
                    Loading...
                </div>
            ) : documents.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#E8DDD0] p-12 text-center">
                    <h2 className="text-xl font-semibold">
                        No Documents Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Upload your first document.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white rounded-xl border border-[#E8DDD0] p-6 shadow-sm hover:shadow-lg transition"
                        >
                            <h2 className="text-lg font-semibold break-all">
                                {doc.filename}
                            </h2>

                            <p className="text-gray-500 mt-2">
                                {doc.file_type.toUpperCase()}
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                                Uploaded:
                                {" "}
                                {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={() => navigate(`/chat/${doc.id}`)}
                                    className="flex-1 bg-[#25211E] text-white py-2 rounded-lg hover:bg-black"
                                >
                                    💬 Chat
                                </button>

                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

export default Documents;