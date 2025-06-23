
import React from 'react';
import {
  CheckCircle,
  Circle,
  Bookmark,
  AlertCircle,
  Target,
} from 'lucide-react';
import type { QuestionNavigationProps } from '../../types/dataTypes';
import { getQuestionStatusClass } from '../../types/mcqHelpers';

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  selectedAnswers,
  markedForReview,
  currentQuestionIndex,
  onSelectQuestion,
}) => {

  const getStatusStyles = (statusClass: string, isActive: boolean) => {
    const baseStyles = "relative flex items-center justify-center w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg border-2 transform hover:scale-110 overflow-hidden";
    
    if (isActive) {
      return `${baseStyles} ring-4 ring-blue-300 ring-opacity-50 scale-110 z-10`;
    }

    switch (statusClass) {
      case 'answered':
        return `${baseStyles} bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-500 hover:from-green-600 hover:to-emerald-700 shadow-lg`;
      case 'marked':
        return `${baseStyles} bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-yellow-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg`;
      case 'answered-marked':
        return `${baseStyles} bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-500 hover:from-purple-600 hover:to-indigo-700 shadow-lg`;
      default:
        return `${baseStyles} bg-white/80 backdrop-blur-sm text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50`;
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500">
      {/* Enhanced Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
          <Target className="w-5 h-5 text-white relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
          Questions
        </h3>
        <div className="flex-1 text-right">
          <span className="text-sm font-semibold text-gray-500">
            {answeredCount}/{questions.length}
          </span>
        </div>
      </div>

      {/* Enhanced Question Grid */}
      <div className="grid grid-cols-5 gap-3 mb-10">
        {questions.map((_, index) => {
          const questionId = questions[index].question_id;
          const statusClass = getQuestionStatusClass(
            questionId,
            selectedAnswers,
            markedForReview
          );
          const isActive = index === currentQuestionIndex;

          return (
            <button
              key={questionId}
              onClick={() => onSelectQuestion(index)}
              className={getStatusStyles(statusClass, isActive)}
              aria-label={`Question ${index + 1}`}
              title={`Question ${index + 1} - ${statusClass.replace('-', ' ')}`}
            >
              <span className="relative z-10">{index + 1}</span>
              
              {/* Shimmer effect for answered questions */}
              {statusClass !== 'unanswered' && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
              )}
              
              {/* Active pulse effect */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-500 rounded-xl animate-pulse opacity-20" />
              )}
            </button>
          );
        })}
      </div>

      {/* Enhanced Legend */}
      <div className="space-y-3">        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-md transition-all duration-300">
            <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
              <Circle className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-600">Not answered</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Answered</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 hover:shadow-md transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <Bookmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Marked for review</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:shadow-md transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Answered & marked</span>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Summary */}
      {/* <div className="mt-8 pt-8 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
              {Object.keys(selectedAnswers).length}
            </div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">Answered</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1">
              {markedForReview.length}
            </div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Marked</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default QuestionNavigation;