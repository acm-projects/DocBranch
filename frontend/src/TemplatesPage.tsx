import { Link } from 'react-router-dom';

function TemplatePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Resume Templates</h2>
      <p>Browse and select from our resume templates</p>
      {/* Add your resume template content here */}
      
      <Link to="/">
        Go back to Home Page
      </Link>
    </div>
  );
}

export default TemplatePage;