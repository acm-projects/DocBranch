import React from 'react';
import { GitBranch, FileText, History } from 'lucide-react';

const DocBranchLanding = () => {
  return (
    <div className="min-h-screen bg-white border">
      {/* Header */}
      <div className="text-center pt-16 pb-12 px-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-emerald-500">DocBranch</span>!
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Create, manage, and version control your professional resumes with
          <br />
          powerful branching capabilities
        </p>
      </div>

      {/* What We Do Section */}
      <div className="pb-16 px-8 md:px-16 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">What We Do</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Document Branching Card */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <GitBranch className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-xl mb-4 text-gray-800">Document Branching</h3>
            <p className="text-gray-600 leading-relaxed">
              Create multiple branches for Git-like branching for different opportunities
            </p>
          </div>

          {/* Professional Templates Card */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <FileText className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-xl mb-4 text-gray-800">Professional Templates</h3>
            <p className="text-gray-600 leading-relaxed">
              Access expertly designed templates that make your documents stand out
            </p>
          </div>

          {/* Version Tracking Card */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <History className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-xl mb-4 text-gray-800">Version Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Never lose progress. Track all changes and revert to any previous version
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <button className="w-full sm:w-auto px-12 py-4 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors">
            Log-In
          </button>
          <button className="w-full sm:w-auto px-12 py-4 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocBranchLanding;