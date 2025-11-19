import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  GitBranch,
  User,
  ChevronLeft,
  ChevronRight,
  Files,
  FilePlus,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    // { icon: <Upload size={20} />, label: "Upload Resume", path: "/upload" },
    { icon: <FilePlus size={20} />, label: "Create Resume", path: "/CreatePage" },
    { icon: <Files size={20} />, label: "Compare Resumes", path: "/ComparePage" },
    { icon: <FileText size = {20} />, label: "Directory", path: "/TemplatePage" },
    { icon: <GitBranch size={20} />, label: "View Branches", path: "/BranchPage" },

  ];

  const topItems = [
    { icon: <User size={20} />, label: "Profile", path: "/Profile" },
    // { icon: <Settings size={20} />, label: "Settings", path: "/settings" },

  ];

  const itemClass = "flex items-center w-full rounded-lg hover:bg-gray-100 transition-colors";

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
{/* Header */}
<div className="p-4 border-b border-gray-200 flex items-center justify-between">
  <button
    onClick={() => navigate("/LandingPage")}
    className={`font-bold text-green-500 transition-all duration-300 ${
      collapsed ? "text-sm" : "text-xl"
    }`}
  >
    {collapsed ? "DB" : "DocBranch"}
  </button>

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
            onClick={() => handleNavigation(item.path)}
            className={`${itemClass} ${
              collapsed ? "justify-center p-3" : "gap-3 px-3 py-2"
            } ${isActive(item.path) ? "bg-green-100 text-emerald-500" : ""}`}
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
            onClick={() => handleNavigation(item.path)}
            className={`${itemClass} ${
              collapsed ? "justify-center p-3" : "gap-3 px-3 py-2"
            } ${isActive(item.path) ? "bg-green-100 text-emerald-500" : ""}`}
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


