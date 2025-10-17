import { Link } from 'react-router-dom';

function BranchPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Branch Page!</h2>
      <p>This is your Branch page content</p>
      {/* Add your actual compare functionality here */}

      <Link
          to="/"
        >
          Go back to Home Page
        </Link>
    </div>
  );
}

export default BranchPage;