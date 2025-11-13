// import { useState } from "react";
import {
  Upload,
  FileText,
  GitBranch,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const menuItems = [
    { icon: <Upload size={20} />, label: "Upload Resume" },
    { icon: <FileText size={20} />, label: "Make Resume" },
    { icon: <GitBranch size={20} />, label: "View Branches" },
  ];

  const topItems = [
    { icon: <User size={20} />, label: "Profile" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  const itemClass = "flex items-center w-full rounded-lg hover:bg-gray-100 transition-colors";

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1
          className={`font-bold text-green-500 transition-all duration-300 ${
            collapsed ? "text-sm" : "text-xl"
          }`}
        >
          {collapsed ? "DB" : "DocBranch"}
        </h1>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Combined Navigation & Menu */}
      <div className={`flex flex-col ${collapsed ? "p-2" : "p-4"} space-y-2`}>
        {/* Top Items */}
        {topItems.map((item) => (
          <button
            key={item.label}
            className={`${itemClass} ${collapsed ? "justify-center p-3" : "gap-3 px-3 py-2"}`}
          >
            {item.icon}
            {!collapsed && (
              <span className="text-gray-700 font-normal text-sm">{item.label}</span>
            )}
          </button>
        ))}

        {/* Menu Items */}
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`${itemClass} ${collapsed ? "justify-center p-3" : "gap-3 px-3 py-2"}`}
          >
            {item.icon}
            {!collapsed && (
              <span className="text-gray-700 font-normal text-sm">{item.label}</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}