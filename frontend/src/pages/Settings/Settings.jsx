import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Settings
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your application preferences and account settings.
          </p>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-5">
            Account
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Name
              </label>

              <input
                type="text"
                value="John Doe"
                readOnly
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>

              <input
                type="email"
                value="john@example.com"
                readOnly
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">
            Preferences
          </h2>

          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Push Notifications
                </h3>

                <p className="text-gray-500 text-sm">
                  Receive notifications for uploads and chats.
                </p>
              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={() =>
                  setNotifications(!notifications)
                }
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Email Alerts
                </h3>

                <p className="text-gray-500 text-sm">
                  Receive important updates via email.
                </p>
              </div>

              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() =>
                  setEmailAlerts(!emailAlerts)
                }
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Dark Mode
                </h3>

                <p className="text-gray-500 text-sm">
                  Enable dark theme for the application.
                </p>
              </div>

              <input
                type="checkbox"
                checked={darkMode}
                onChange={() =>
                  setDarkMode(!darkMode)
                }
                className="w-5 h-5"
              />
            </div>

          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-5">
            Security
          </h2>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
          >
            Change Password
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-5">
            Danger Zone
          </h2>

          <p className="text-gray-500 mb-5">
            Permanently delete your account and all uploaded documents.
          </p>

          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
          >
            Delete Account
          </button>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;