import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import dashboardService from "../../services/dashboardService";

function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await dashboardService.getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!stats) {
        return (
            <DashboardLayout>
                <h2>Loading...</h2>
            </DashboardLayout>
        );
    }

    const cards = [
        {
            title: "Documents",
            value: stats.total_documents,
        },
        {
            title: "AI Chats",
            value: stats.total_chats,
        },
        {
            title: "PDFs",
            value: stats.total_pdfs,
        },
        {
            title: "Images",
            value: stats.total_images,
        },
        {
            title: "Uploads This Month",
            value: stats.uploads_this_month,
        },
    ];

    return (
        <DashboardLayout>
            <h1 className="text-4xl font-bold text-[#25211E] mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-5 gap-6">
                {cards.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white rounded-2xl p-6 border border-[#E8DDD0]"
                    >
                        <p className="text-gray-500">{item.title}</p>

                        <h2 className="text-4xl font-bold mt-4">
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;