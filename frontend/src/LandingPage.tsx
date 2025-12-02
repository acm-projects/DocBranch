import { useState } from "react";
import {
  Search,
  ArrowRight,
  GitMerge,
  Edit3,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";



export default function LandingPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    // <div className="flex h-screen bg-gradient-to-br from-blue-50 to-pink-50">
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />


      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          {/* Welcome Header */}
          <h1 className="text-5xl font-bold mb-6">
            Hello, <span className="text-green-600">User</span>
          </h1>


          {/* Search Bar */}
          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-12 pr-4 py-3 bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>


          {/* Recents Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">Recents</h2>
              <ArrowRight size={18} />
            </div>


            {/* Document Cards */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Doc 1", "Doc 2", "Doc 3"].map((doc) => (
                  <div
                    key={doc}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 mb-3"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{doc}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((dot) => (
                          <div
                            key={dot}
                            className="w-1.5 h-1.5 bg-gray-300 rounded-full"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make Branch */}
            <button 
              onClick={() => navigate('/BranchPage', { state: { openModal: true } })}
              className="bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 p-6 rounded-2xl border-2 border-green-600 transition-all hover:shadow-lg text-left group"
              >
              <div className="flex items-start gap-3 mb-4">
                <GitMerge size={24} className="text-green-700" />
                <div>
                  <h3 className="font-semibold text-gray-800">Make Branch</h3>
                  <p className="text-sm text-gray-600">
                    Create a new branch of current doc
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <span>Get Started</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>


            {/* Edit Branch */}
            <button className="bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 p-6 rounded-2xl border-2 border-green-600 transition-all hover:shadow-lg text-left group">
              <div className="flex items-start gap-3 mb-4">
                <Edit3 size={24} className="text-green-700" />
                <div>
                  <h3 className="font-semibold text-gray-800">Edit Branch</h3>
                  <p className="text-sm text-gray-600">
                    Edit existing branch or current
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <span>Get Started</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


