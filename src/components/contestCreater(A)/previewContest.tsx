import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Send, Clock, FileText, Award, Minus } from 'lucide-react';
import SubmissionSuccess from './submissionSuccess';
import { useContest } from './contestContext';

const PreviewContest: React.FC = () => {
  const navigate = useNavigate();
  const { contest, showUpdateAlert, setShowUpdateAlert } = useContest();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (showUpdateAlert) {
      const timer = setTimeout(() => {
        setShowUpdateAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showUpdateAlert, setShowUpdateAlert]);

  const handleEdit = () => {
    navigate('/contestcreator');
  };

  const handleSubmit = () => {
    // ...submit logic...
    setShowSuccessModal(true);
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'Not set';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!contest.cName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 px-2 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center animate-fade-in-up max-w-md w-full">
          <FileText size={64} className="text-blue-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-700">No Contest to Preview</h2>
          <p className="text-gray-500 mb-6 text-center">Please create a contest first to view the preview.</p>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
          >
            <Edit size={20} />
            Create Contest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-6 px-2 md:px-6 transition-all duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Update Alert */}
        {showUpdateAlert && (
          <div className="flex justify-center mb-4 animate-fade-in">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow transition-all duration-300">
              🔄 Preview updated after changes.
            </div>
          </div>
        )}

        {/* Header */}
        <header className="flex items-center gap-4 mb-6 animate-fade-in">
          <FileText className="text-blue-600" size={40} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Contest Preview</h1>
            <p className="text-gray-500 text-sm md:text-base">Review your contest before submission</p>
          </div>
        </header>

        {/* Contest Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 transition-all duration-300 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contest Information</h2>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <strong className="w-40 text-gray-600">Contest Name:</strong>
              <span className="text-gray-800">{contest.cName}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <strong className="w-40 text-gray-600">Description:</strong>
              <span className="text-gray-800">{contest.cDesc}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <Clock size={18} className="text-blue-500 mr-1" />
              <strong className="w-40 text-gray-600">Start Time:</strong>
              <span className="text-gray-800">{formatDateTime(contest.cStartTime)}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <Clock size={18} className="text-blue-500 mr-1" />
              <strong className="w-40 text-gray-600">End Time:</strong>
              <span className="text-gray-800">{formatDateTime(contest.cEndTime)}</span>
            </div>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-300 animate-fade-in-up">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Questions <span className="text-blue-600 font-bold">({contest.questions.length})</span>
          </h2>
          <div className="space-y-8">
            {contest.questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg bg-gray-50 p-4 md:p-6 shadow-sm transition-all duration-300 animate-fade-in-up"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-base shadow">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <Award size={16} />
                      {question.marks} marks
                    </span>
                    {question.negative_marks > 0 && (
                      <span className="flex items-center gap-1 text-red-500 font-semibold">
                        <Minus size={16} />
                        {question.negative_marks} negative
                      </span>
                    )}
                  </div>
                </div>
                {/* Question Text */}
                <div className="mb-3 text-gray-800 font-medium">{question.question_text}</div>
                {/* Options */}
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={option.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ${
                        option.is_correct
                          ? 'bg-green-50 border border-green-300'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <span className="bg-teal-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-base">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="flex-1 text-gray-700">{option.option_text}</span>
                      {option.is_correct && (
                        <span className="ml-2 text-green-600 font-semibold text-xs bg-green-100 px-2 py-1 rounded-full animate-pulse">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 animate-fade-in-up">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
          >
            <Edit size={20} />
            Edit Contest
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
          >
            <Send size={20} />
            Submit Contest
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <SubmissionSuccess onClose={() => setShowSuccessModal(false)} />
      )}

      {/* Animations */}
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
};

export default PreviewContest;
