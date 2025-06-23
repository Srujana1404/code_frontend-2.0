import React, { useState } from 'react';
import { FileText, Trophy, Clock, Timer, Play } from 'lucide-react';

interface InfoTableProps {
  totalQuestions: number;
  totalScore: number;
  contestDuration: string;
  startTime: string;
  endTime: string;
  onStart?: () => void;
}

const InfoTable: React.FC<InfoTableProps> = ({
  totalQuestions,
  totalScore,
  contestDuration,
  startTime,
  endTime,
  onStart
}) => {
  const [agree, setAgree] = useState(false);



  return (
    <div className="w-full max-w-5xl mx-auto mb-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-indigo-600" />
          Contest Information
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">Total Questions</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">Total Score</span>
              </div>
              <span className="text-xl font-bold text-green-600">{totalScore}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Timer className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">Duration</span>
              </div>
              <span className="text-xl font-bold text-purple-600">{contestDuration}</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gray-600 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">Schedule</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-medium text-gray-900">{startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Time:</span>
                  <span className="font-medium text-gray-900">{endTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Security Guidelines</h3>
          <ul className="text-red-700 text-sm space-y-1">
            <li>• Full-screen mode is mandatory throughout the contest</li>
            <li>• Do not attempt to minimize, switch tabs, or exit full-screen</li>
            <li>• Avoid using function keys (F11, ESC, F5, etc.)</li>
            <li>• Right-clicking and keyboard shortcuts are disabled</li>
            <li>• Any violation will be logged and may result in disqualification</li>
          </ul>
        </div>

        {/* Checkbox for confirmation */}
        <div className="mt-6 mb-4 flex items-start space-x-2">
          <input
            id="agree"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I have read and agree to the security instructions.
          </label>
        </div>

        {/* Start Button */}
        <button
  disabled={!agree}
  onClick={onStart}
  className={`w-full max-w-2xl mx-auto font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform flex items-center justify-center space-x-3
    ${agree
      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:scale-[1.02] hover:shadow-lg'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
  `}
>
  <Play className="w-5 h-5" />
  <span className="text-lg">Start Contest</span>
</button>

      </div>
    </div>
  );
};

export default InfoTable;
