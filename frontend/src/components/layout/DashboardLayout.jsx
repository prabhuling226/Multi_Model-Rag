import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import profileService from "../../services/profileService";

const DashboardLayout = ({ children }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                AI Document Assistant
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Multimodal RAG powered by Gemini
                            </p>
                        </div>

                        <div className="flex items-center gap-4">

                            <div className="text-right">

                                <h2 className="font-semibold text-gray-800">
                                    Welcome 👋
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {profile ? profile.full_name : "Loading..."}
                                </p>

                            </div>

                            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">

                                {profile
                                    ? profile.full_name.charAt(0).toUpperCase()
                                    : "U"}

                            </div>

                        </div>

                    </div>

                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {children ? children : <Outlet />}
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;