import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import dashboardService from "../../services/dashboardService";
import { FileText, MessageSquare, FileUp, Sparkles, Database, Layers } from "lucide-react";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await dashboardService.getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64 text-[#8C8782] gap-3">
                    <Sparkles className="animate-spin text-[#C5A059]" size={24} />
                    <span>Loading Analytics Workspace...</span>
                </div>
            </DashboardLayout>
        );
    }

    const cards = [
        {
            title: "Total Knowledge Assets",
            value: stats.total_documents,
            icon: <FileText size={22} className="text-[#C5A059]" />,
            desc: "Uploaded files"
        },
        {
            title: "AI RAG Sessions",
            value: stats.total_chats,
            icon: <MessageSquare size={22} className="text-[#2C2A29]" />,
            desc: "Conversations held"
        },
        {
            title: "PDF Documents",
            value: stats.total_pdfs,
            icon: <Layers size={22} className="text-[#8C7A6B]" />,
            desc: "PDF files processed"
        },
        {
            title: "Multimodal Images",
            value: stats.total_images,
            icon: <Database size={22} className="text-[#A89886]" />,
            desc: "OCR & Vision artifacts"
        },
        {
            title: "Monthly Ingestion",
            value: stats.uploads_this_month,
            icon: <FileUp size={22} className="text-[#C5A059]" />,
            desc: "Files added this month"
        },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Hero Header */}
                <div className="bg-white border border-[#E8E2D5] rounded-3xl p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F3EA] border border-[#E8E2D5] rounded-full text-xs font-semibold text-[#8C7A6B] mb-3">
                            <Sparkles size={14} className="text-[#C5A059]" />
                            <span>FastAPI + Gemini Vector Search Active</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#1F1D1C] font-serif">
                            Knowledge Engine Overview
                        </h1>
                        <p className="text-sm text-[#54504C] mt-2 max-w-xl leading-relaxed">
                            Monitor ingested document corpora, chunk indexing, and real-time LLM query activity across your organization.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/upload")}
                            className="px-5 py-3 rounded-xl bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] transition text-sm font-semibold shadow-xs flex items-center gap-2"
                        >
                            <FileUp size={16} />
                            Ingest Document
                        </button>

                        <button
                            onClick={() => navigate("/chat")}
                            className="px-5 py-3 rounded-xl bg-[#E8E2D5] text-[#2C2A29] hover:bg-[#DFD7C7] transition text-sm font-semibold flex items-center gap-2"
                        >
                            <MessageSquare size={16} />
                            Launch RAG Chat
                        </button>
                    </div>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    {cards.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white rounded-2xl p-6 border border-[#E8E2D5] shadow-xs hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="p-2.5 rounded-xl bg-[#F7F3EA] border border-[#F0EAE1]">
                                    {item.icon}
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold mt-4 text-[#1F1D1C]">
                                {item.value}
                            </h2>

                            <p className="text-xs font-semibold text-[#1F1D1C] mt-1">
                                {item.title}
                            </p>

                            <p className="text-xs text-[#8C8782] mt-0.5">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;