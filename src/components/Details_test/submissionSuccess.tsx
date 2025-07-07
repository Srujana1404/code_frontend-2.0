import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SubmissionSuccessProps {
  successMessage?: string;
  onClose: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ successMessage, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fade-in-up transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="text-green-500 mb-4 animate-bounce-in" size={64} />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">🎉 ${successMessage} </h2>
          <p className="text-gray-600 mb-6">Your quiz contest has been created and is ready to use.</p>
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2 rounded-lg shadow transition-all duration-200 text-lg"
          >
            Great!
          </button>
        </div>
      </div>
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-bounce-in {
          animation: bounceIn 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes bounceIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        `}
      </style>
    </div>
  );
};

export default SubmissionSuccess;
