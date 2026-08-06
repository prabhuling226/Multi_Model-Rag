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
        <div className="flex h-screen bg-[#FBF9F5] overflow-hidden text-[#1F1D1C]">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Navbar */}
                <header className="bg-[#FFFFFF] border-b border-[#E8E2D5] px-8 py-4 shadow-xs flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#1F1D1C]">
                            Knowledge Intelligence Workspace
                        </h1>
                        <p className="text-xs text-[#8C8782] mt-0.5">
                            FastAPI & Vector Search RAG Pipeline
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <h2 className="text-sm font-semibold text-[#1F1D1C]">
                                {profile ? profile.full_name : "User Account"}
                            </h2>
                            <p className="text-xs text-[#8C8782]">
                                {profile ? profile.email : "Authenticated User"}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-[#E8E2D5] border border-[#DFD7C7] text-[#2C2A29] flex items-center justify-center font-semibold text-base shadow-xs">
                            {profile && profile.full_name
                                ? profile.full_name.charAt(0).toUpperCase()
                                : "U"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-[#FBF9F5]">
                    {children ? children : <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;