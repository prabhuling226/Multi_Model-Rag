import { useRef, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import documentService from "../../services/documentService";

function Upload() {
    const fileInputRef = useRef(null);

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessage("Please select at least one file.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            console.log("FILES:", files);
            console.log("FIRST FILE:", files[0]);
            console.log("IS FILE:", files[0] instanceof File);

            await documentService.uploadDocuments(files);

            setMessage("Documents uploaded successfully.");

            setFiles([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.detail ||
                    "Failed to upload documents."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Upload Documents
                </h1>

                <div className="bg-white border border-[#E8DDD0] rounded-2xl p-8">

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="w-full border rounded-lg p-3"
                    />

                    <div className="mt-6">

                        <h2 className="font-semibold mb-3">
                            Selected Files
                        </h2>

                        {files.length === 0 ? (
                            <p className="text-gray-500">
                                No files selected.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li
                                        key={index}
                                        className="border rounded-lg px-4 py-2"
                                    >
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {message && (
                        <p className="mt-6 text-center text-blue-600">
                            {message}
                        </p>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="mt-8 w-full bg-[#25211E] text-white py-3 rounded-xl hover:bg-[#3B342F] transition"
                    >
                        {loading
                            ? "Uploading..."
                            : "Upload Documents"}
                    </button>

                </div>
            </div>
        </DashboardLayout>
    );
}

export default Upload;