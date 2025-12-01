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
    if (isElectron) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      try {
        await fetch(`${AUTH_SERVER}/logout`, { credentials: "include" });
      } catch (e) {}
      // Optionally refresh UI or navigate
      window.location.href = "/";
    } else {
      try {
        await fetch(`${AUTH_SERVER}/logout`, { credentials: "include" });
      } catch (e) {}
      window.location.href = "/";
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
