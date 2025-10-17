import { Link } from 'react-router-dom';

const ComparePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Page</h1>
        <p className="text-lg text-gray-600 mb-6">This is the compare page.</p>
        {//put ur code here
         }
        <Link
          to="/"
        >
          Go back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default ComparePage;