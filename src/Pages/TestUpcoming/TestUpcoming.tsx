import React from "react";
import { Clock, Timer, ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestUpcoming: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#dfe9f3] via-[#f7faff] to-[#e3e4f3] animate-gradient-x">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white/70 backdrop-blur-lg border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-8 animate-fade-scale transition-all duration-500">
          
          {/* ⏳ Emoji */}
          <div className="text-6xl mb-6 animate-pulse drop-shadow-lg">⏳</div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
           Your Test Will Begin Soon!
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Please stay on this page. The test will launch automatically at the scheduled time.
          </p>

          {/* Test Info Card */}
          <div className="bg-indigo-100/60 border border-indigo-200 rounded-xl p-5 mb-6 text-left">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-indigo-700 mr-2" />
              <span className="text-gray-700 font-medium">Start Time:</span>
              <span className="ml-auto font-semibold text-indigo-800">11:00 AM</span>
            </div>
            <div className="flex items-center">
              <Timer className="w-5 h-5 text-indigo-700 mr-2" />
              <span className="text-gray-700 font-medium">Duration:</span>
              <span className="ml-auto font-semibold text-indigo-800">60 Minutes</span>
            </div>
          </div>

          {/* Go Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mt-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Note */}
          <div className="mt-6 text-sm text-gray-500 italic">
            Do not refresh, minimize, or close this tab.<br />
            We’re getting everything ready for your test! 🔒
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUpcoming;
