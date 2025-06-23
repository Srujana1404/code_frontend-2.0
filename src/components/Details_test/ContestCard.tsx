import React from 'react';
import { Calendar, Clock, Award } from 'lucide-react';

interface ContestCardProps {
  title: string;
  description: string;
  status: string;
}

const ContestCard: React.FC<ContestCardProps> = ({ title, description, status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-8 h-8" />
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-blue-100 leading-relaxed">{description}</p>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-6 mb-6 text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">2 hours</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Important Security Notice
          </h3>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• Contest will run in secure full-screen mode</li>
            <li>• Tab switching and shortcuts are disabled</li>
            <li>• 2 violations will result in disqualification</li>
            <li>• Make sure you're ready before starting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
