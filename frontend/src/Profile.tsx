// src/App.tsx

import React, { useState } from "react";
import Sidebar from "./Sidebar";

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const AUTH_SERVER =
    (import.meta as any).env?.VITE_AUTH_SERVER_URL || "http://localhost:3100";
  const isElectron =
    typeof window !== "undefined" && !!(window as any).electronAPI;

  const handleLogout = async () => {
    // Clear local tokens (renderer-side)
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
    } catch (e) {
      console.warn("Failed to clear localStorage", e);
    }

    // Tell backend to clear session and perform provider logout
    try {
      await fetch(`${AUTH_SERVER}/logout`, { credentials: "include" });
    } catch (e) {
      console.warn("Logout request failed", e);
    }

    // Navigate back to the app home. App uses a hash router, so set the
    // hash to the root route so the HomePage (login button) shows.
    try {
      if (typeof window !== "undefined") {
        // Use hash navigation to work both in Electron and browser
        window.location.hash = "#/";
        // Also update location.href as a fallback
        window.location.href = window.location.href.split("#")[0] + "#/";
      }
    } catch (e) {
      // Last resort: reload the page
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

export default App;
