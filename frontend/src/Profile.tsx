import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Profile: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const AUTH_SERVER =
    (import.meta as any).env?.VITE_AUTH_SERVER_URL || "http://localhost:3100";

  const handleLogout = async () => {
    // Clear client-side tokens first
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
    } catch (e) {
      console.warn("Failed to clear localStorage", e);
    }

    // Navigate top-level to backend logout so Cognito end_session runs in a
    // full navigation and provider cookies are cleared. Using fetch does
    // not reliably clear provider cookies because redirects happen in the
    // XHR context.
    try {
      if (typeof window !== "undefined") {
        window.location.href = `${AUTH_SERVER}/logout`;
      }
    } catch (e) {
      console.warn("Logout navigation failed", e);
      try {
        window.location.reload();
      } catch (e) {}
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div style={{ padding: 24 }}>
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p>This is the Profile Page</p>
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
