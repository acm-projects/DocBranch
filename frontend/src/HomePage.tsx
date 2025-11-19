// import { Link } from 'react-router-dom';


// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">Home Page</h1>
//         <p className="text-lg text-gray-600 mb-6">Welcome to the home page!</p>
//         <Link
//           to="/ComparePage"

//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
//         >
//           Go to Compare Page <br></br>
//         </Link>

//         <Link
//           to="/BranchPage"
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
//         >
//           Go to Branch Page <br></br>
//         </Link>

//         <Link
//             to="/TemplatesPage"
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
//           >
//             Go to Resume Templates <br></br>
//           </Link>
        

//         <Link
//             to="/LandingPage"
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
//           >
//             Go to Landing Page <br></br>
//           </Link>

//         <Link
//             to="/HomePageMain"
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
//           >
//             Go to Home Page <br></br>
//           </Link>


//       </div>
//     </div>
//   );
// };

// export default HomePage;




import React from 'react';
import { GitBranch, FileText, History } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const DocBranchLanding = () => {
  const navigate = useNavigate();

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
          {/* <button className="w-full sm:w-auto px-12 py-4 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors">
            Log-In
          </button> */}
            <button 
              onClick={() => navigate("/LandingPage")}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
              }}
            >
              Log in
            </button>

          {/* <button className="w-full sm:w-auto px-12 py-4 bg-white border-2 border-emerald-500 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors">
            Continue as Guest
          </button> */}
                      <button 
              onClick={() => navigate("/LandingPage")}
              style={{
                background: 'white',
                color: '#10b981)',
                border: '2px solid #10b981',
                padding: '20px 40px',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
              }}
            >
              Continue as Guest
            </button>


        </div>
      </div>
    </div>
  );
};

export default DocBranchLanding;