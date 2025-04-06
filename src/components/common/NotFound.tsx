import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-orange-100 p-6 rounded-full inline-flex mb-6">
          <FileQuestion className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;