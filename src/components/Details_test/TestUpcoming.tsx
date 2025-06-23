import React from "react";
import { Clock, Timer, ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestUpcoming: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full text-center">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md shadow-2xl border border-white/30 rounded-3xl p-8 animate-fade-in-down">

          {/* Clock Emoji */}
          <div className="text-6xl mb-4 animate-pulse">⏳</div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Test Will Begin Soon!
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Please stay on this page. The test will start automatically at the scheduled time.
          </p>

          {/* Test Info */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6 text-left">
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-gray-700 font-medium">Start Time:</span>
              <span className="ml-auto font-semibold text-indigo-700">11:00 AM</span>
            </div>
            <div className="flex items-center">
              <Timer className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-gray-700 font-medium">Duration:</span>
              <span className="ml-auto font-semibold text-indigo-700">60 Minutes</span>
            </div>
          </div>

          {/* Optional Action */}
          <button
            onClick={() => navigate("/")}
            className="mt-2 w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Footer Note */}
          <div className="mt-6 text-sm text-gray-500">
            Don’t refresh or close this page. Your test will launch on time. ⏱️
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUpcoming;
