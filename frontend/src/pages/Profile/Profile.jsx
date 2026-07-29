import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import profileService from "../../services/profileService";

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
      alert("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      await profileService.updateProfile(editData);

      alert("Profile updated successfully.");

      setEditing(false);

      fetchProfile();

    } catch (error) {
      alert(error.response?.data?.detail || "Update failed");
    }
  };

  const changePassword = async () => {
    try {
      await profileService.changePassword(passwordData);

      alert("Password changed successfully.");

      setPasswordData({
        current_password: "",
        new_password: "",
      });

    } catch (error) {
      alert(error.response?.data?.detail || "Password update failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20 text-xl">
          Loading Profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        <div className="bg-white rounded-2xl shadow p-8">

          <div className="flex justify-center mb-8">

            <div className="w-28 h-28 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>

          </div>

          <div className="space-y-6">

            <div>

              <label className="font-semibold">
                Full Name
              </label>

              <input
                className="w-full mt-2 border rounded-lg p-3"
                disabled={!editing}
                value={editData.full_name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    full_name: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="font-semibold">
                Email
              </label>

              <input
                className="w-full mt-2 border rounded-lg p-3"
                disabled={!editing}
                value={editData.email}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    email: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="font-semibold">
                Account Status
              </label>

              <p className="mt-2">
                {profile.is_active ? "Active" : "Inactive"}
              </p>

            </div>

            <div>

              <label className="font-semibold">
                Joined On
              </label>

              <p className="mt-2">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>

            </div>

            <div className="flex gap-4 mt-6">

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={updateProfile}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg"
                >
                  Save Changes
                </button>
              )}

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-8 mt-8">

          <h2 className="text-2xl font-bold mb-6">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="Current Password"
            className="w-full border rounded-lg p-3 mb-4"
            value={passwordData.current_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                current_password: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded-lg p-3 mb-6"
            value={passwordData.new_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                new_password: e.target.value,
              })
            }
          />

          <button
            onClick={changePassword}
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Update Password
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;