import React from 'react';
import { AlertTriangle, X, Shield } from 'lucide-react';
import type { WarningModalProps } from '../../types/dataTypes';

const WarningModal: React.FC<WarningModalProps> = ({
  message,
  violationCount,
  maxViolations,
  onClose
}) => {
  const remainingWarnings = maxViolations - violationCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-strong max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 fill-amber-300" />
              </div>
              <h2 className="text-xl font-bold">Security Violation</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-colors duration-200"
              aria-label="Close warning"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
              <p className="text-red-800 font-medium">{message}</p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Warning {violationCount} of {maxViolations}
                </span>
              </div>
              
              {remainingWarnings > 0 ? (
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">{remainingWarnings}</div>
                  <div className="text-xs text-yellow-600 font-medium">
                    warning{remainingWarnings !== 1 ? 's' : ''} left
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600 uppercase tracking-wide">
                    Final Warning
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <h3 className="font-bold text-yellow-800 mb-3">Consequences:</h3>
            <ul className="space-y-2 text-yellow-700">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                <span>This violation has been recorded</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                <span>Continued malpractice will result in disqualification</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                <span>All actions are being monitored</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-medium hover:shadow-strong"
          >
            I Understand - Continue Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;