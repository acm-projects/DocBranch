import { useState } from "react";
import {
  Search,
  ArrowRight,
  GitMerge,
  Edit3,
} from "lucide-react";
import Sidebar from "./Sidebar";


export default function HomePageMain() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-pink-50">
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
            Welcome to, <span className="text-green-600">DocBranch</span>
          </h1>



          {/* Recents Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">Create, manage, and version control your professional resumes with powerful branching capabilities</h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">What We Do</h2>
            </div>

          </div>


          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make Branch */}
            <button className="bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 p-6 rounded-2xl border-2 border-green-600 transition-all hover:shadow-lg text-left group">
              <div className="flex items-start gap-3 mb-4">
                <GitMerge size={24} className="text-green-700" />
                <div>
                  <h3 className="font-semibold text-gray-800">Document Branching</h3>
                  <p className="text-sm text-gray-600">
                    Create multiple branches for Git-like branching for different opportunities
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
                  <h3 className="font-semibold text-gray-800"> Professional Templates</h3>
                  <p className="text-sm text-gray-600">
                    Access expertly designed templates that make your documents stand out
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <span>Go Home</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
            
            {/* Version Tracking */}
            <button className="bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 p-6 rounded-2xl border-2 border-green-600 transition-all hover:shadow-lg text-left group">
              <div className="flex items-start gap-3 mb-4">
                <Edit3 size={24} className="text-green-700" />
                <div>
                  <h3 className="font-semibold text-gray-800"> Professional Templates</h3>
                  <p className="text-sm text-gray-600">
                    Access expertly designed templates that make your documents stand out
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <span>Go Home</span>
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


