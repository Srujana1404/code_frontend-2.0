import React from 'react';
import { Bookmark as BookmarkCheck, Award } from 'lucide-react';
import type { QuestionCardProps } from '../../types/mcq';

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  selectedAnswer,
  isMarkedForReview,
  onSelectOption,
  onToggleMarkForReview,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 via-blue-50 to-cyan-50 px-6 py-4 border-b border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-lg relative overflow-hidden">
                <span className="relative z-10">{index + 1}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
              </div>
              <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 opacity-30 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 leading-relaxed">{question.question_text}</h3>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {question.marks} {question.marks > 1 ? 'marks' : 'mark'}
            </span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="p-6 space-y-4">
        {question.options.map((option, optionIndex: number) => {
          const optionId = option.option_id;
          const isSelected = selectedAnswer === optionId;
          const optionLetter = String.fromCharCode(65 + optionIndex);

          return (
            <label
              key={optionId}
              className={`group relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden
                ${isSelected
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg scale-[1.01]'
                  : 'border-gray-200 bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              {/* Hover Background */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 transition-opacity duration-300
                ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}
              `}></div>

              <div className="flex items-center space-x-5 w-full relative z-10">
                {/* Radio Circle */}
                <div className="relative">
                  <input
                    type="radio"
                    name={`question-${question.question_id}`}
                    value={optionId}
                    checked={isSelected}
                    onChange={() => onSelectOption(question.question_id, optionId)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isSelected
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white group-hover:border-blue-400'}
                  `}>
                    {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                </div>

                {/* Option Label */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-xl font-bold text-sm
                  ${isSelected
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'}
                `}>
                  {optionLetter}
                </div>

                {/* Option Text */}
                <span className={`flex-1 text-base font-medium
                  ${isSelected ? 'text-blue-900' : 'text-gray-700 group-hover:text-blue-800'}
                `}>
                  {option.option_text}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce shadow-lg" />
              )}
            </label>
          );
        })}
      </div>

      {/* Mark for Review */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onToggleMarkForReview(question.question_id)}
          className={`group flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden
            ${isMarkedForReview
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
              : 'bg-white/80 backdrop-blur-sm text-gray-600 border-2 border-gray-200 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300'}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <BookmarkCheck className={`w-5 h-5 relative z-10 ${isMarkedForReview ? 'text-white animate-pulse' : 'text-gray-500 group-hover:text-yellow-600'}`} />
          <span className="relative z-10">
            {isMarkedForReview ? 'Marked for review' : 'Mark for review'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
