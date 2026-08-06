import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import profileService from "../../services/profileService";
import { User, KeyRound, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [editData, setEditData] = useState({
    full_name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setEditData({
        full_name: data.full_name,
        email: data.email,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      await profileService.updateProfile(editData);
      setStatusMessage({ type: "success", text: "Profile updated successfully." });
      setEditing(false);
      fetchProfile();
    } catch (error) {
      setStatusMessage({ type: "error", text: error.response?.data?.detail || "Update failed." });
    }
  };

  const changePassword = async () => {
    try {
      await profileService.changePassword(passwordData);
      setStatusMessage({ type: "success", text: "Password changed successfully." });
      setPasswordData({ current_password: "", new_password: "" });
    } catch (error) {
      setStatusMessage({ type: "error", text: error.response?.data?.detail || "Password update failed." });
    }
  };

  if (loading || !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-[#8C8782] gap-3">
          <Sparkles className="animate-spin text-[#C5A059]" size={24} />
          <span>Loading Profile Data...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1F1D1C] font-serif">
            Account Profile
          </h1>
          <p className="text-sm text-[#54504C] mt-1">
            Manage your personal profile details, authentication parameters, and security settings.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
              statusMessage.type === "success"
                ? "bg-[#F3F9F4] border-[#D1E8D5] text-[#2D6A3E]"
                : "bg-[#FAF0F0] border-[#F4D3D3] text-[#A34343]"
            }`}
          >
            {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] p-8 shadow-xs">
          <div className="flex items-center gap-6 pb-6 border-b border-[#E8E2D5] mb-6">
            <div className="w-20 h-20 rounded-2xl bg-[#F7F3EA] border border-[#E8E2D5] text-[#2C2A29] flex items-center justify-center text-3xl font-bold font-serif shadow-xs">
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F1D1C]">{profile.full_name}</h2>
              <p className="text-sm text-[#8C8782]">{profile.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold uppercase bg-[#F3F9F4] text-[#2D6A3E] border border-[#D1E8D5]">
                {profile.is_active ? "Active Account" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Full Name
              </label>
              <input
                className="w-full mt-1 bg-[#FBF9F5] border border-[#E8E2D5] rounded-xl px-4 py-3 text-sm text-[#1F1D1C] outline-none focus:border-[#C5A059] disabled:opacity-75"
                disabled={!editing}
                value={editData.full_name}
                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Email Address
              </label>
              <input
                className="w-full mt-1 bg-[#FBF9F5] border border-[#E8E2D5] rounded-xl px-4 py-3 text-sm text-[#1F1D1C] outline-none focus:border-[#C5A059] disabled:opacity-75"
                disabled={!editing}
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2.5 rounded-xl bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] text-sm font-semibold transition"
                >
                  Edit Information
                </button>
              ) : (
                <button
                  onClick={updateProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-white hover:bg-[#B38F48] text-sm font-semibold transition"
                >
                  Save Profile Changes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="text-[#C5A059]" size={22} />
            <h2 className="text-lg font-bold text-[#1F1D1C]">Security & Password</h2>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 bg-[#FBF9F5] border border-[#E8E2D5] rounded-xl px-4 py-3 text-sm text-[#1F1D1C] outline-none focus:border-[#C5A059]"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 bg-[#FBF9F5] border border-[#E8E2D5] rounded-xl px-4 py-3 text-sm text-[#1F1D1C] outline-none focus:border-[#C5A059]"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              />
            </div>

            <button
              onClick={changePassword}
              className="mt-2 px-6 py-2.5 rounded-xl bg-[#2C2A29] text-[#FBF9F5] hover:bg-[#1A1918] text-sm font-semibold transition"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;