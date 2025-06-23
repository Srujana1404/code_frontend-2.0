import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, AlertTriangle, Shield, Home } from 'lucide-react';

interface DisqualificationState {
  reason: string;
  contestId: string;
}

const DisqualifiedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as DisqualificationState;

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBack);
    return () => window.removeEventListener('popstate', preventBack);
  }, []);

  const preventBack = () => {
    window.history.pushState(null, '', window.location.href);
  };

  const handleReturnHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-strong overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 fill-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Disqualified</h1>
                <p className="text-red-100">Contest #{state?.contestId || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Reason Section */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-red-800 mb-2">Disqualification Reason</h2>
                  <p className="text-red-700 leading-relaxed">
                    {state?.reason || 'Multiple malpractice violations detected during the contest.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Violations */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Common Security Violations</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Exiting fullscreen mode</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Switching tabs or applications</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Using keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Opening developer tools or other applications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
              <button
                onClick={handleReturnHome}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-medium hover:shadow-strong"
              >
                <Home className="w-5 h-5" />
                <span>Return to Home</span>
              </button>
            </div>


            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-800 mb-2">What happens next?</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your disqualification has been recorded. If you believe this was an error,
                please contact the contest administrators with your contest ID for review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisqualifiedPage;