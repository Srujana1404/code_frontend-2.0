import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const ContestOver: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <div className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl rounded-3xl p-8 text-center animate-fade-in-down transition-all duration-500">
          
          {/* ❌ Animated emoji */}
          <div
            className="text-6xl mb-4 transition-transform duration-300 transform hover:animate-shake animate-fade-scale"
            role="img"
            aria-label="error"
          >
            ❌
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Contest Unavailable
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Oops! This contest has already ended.<br />
            You were just a bit late.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <div className="mt-6 pt-5 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Stay ready — your next challenge is coming soon! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestOver;
