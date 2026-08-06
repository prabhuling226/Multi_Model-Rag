import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileText,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      title: "Document Ingestion",
      path: "/upload",
      icon: <Upload size={19} />,
    },
    {
      title: "Knowledge Library",
      path: "/documents",
      icon: <FileText size={19} />,
    },
    {
      title: "AI RAG Chat",
      path: "/chat",
      icon: <MessageSquare size={19} />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <User size={19} />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings size={19} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-[#2C2A29] text-[#FBF9F5] flex flex-col border-r border-[#3D3A38] shadow-2xl z-20 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#3D3A38]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C7A6B] flex items-center justify-center shadow-md">
          <Sparkles className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-wide text-[#FBF9F5]">DocMind AI</h1>
          <p className="text-xs text-[#B5AEA7] tracking-wider uppercase">Multimodal RAG</p>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-[#C5A059] text-white shadow-md font-semibold"
                  : "text-[#D8D1C5] hover:bg-[#3D3A38] hover:text-[#FBF9F5]"
              }`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="border-t border-[#3D3A38] p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3D3A38] text-[#E8DDD0] hover:bg-[#A34343] hover:text-white transition-all text-sm font-medium"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;