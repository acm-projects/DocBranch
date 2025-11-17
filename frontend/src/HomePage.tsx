import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Home Page</h1>
        <p className="text-lg text-gray-600 mb-6">Welcome to the home page!</p>
        <Link
          to="/ComparePage"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Compare Page <br></br>
        </Link>

        <Link
          to="/BranchPage"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Branch Page <br></br>
        </Link>

        <Link
          to="/TemplatesPage"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Resume Templates <br></br>
        </Link>

        <Link
          to="/LandingPage"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Landing Page <br></br>
        </Link>

        <Link
          to="/HomePageMain"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Home Page <br></br>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
