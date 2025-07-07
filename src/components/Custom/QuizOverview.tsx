import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Circle, AlertCircle, Clock, Send, ArrowLeft, Trophy, Target, AlertTriangle } from 'lucide-react';
import type { QuizOverviewProps, SubmitQuizResponse } from '../../types/dataTypes';
import Axios from 'axios';

const QuizOverview: React.FC<QuizOverviewProps> = ({
  questions,
  quizState,
  onCancel,
  autoSubmit,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [submitTimer, setSubmitTimer] = useState(autoSubmit ? 10 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitComplete, setSubmitComplete] = useState(false);

  const { selectedAnswers, markedForReview } = quizState;
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = questions.length - answeredCount;
  const markedCount = markedForReview.length;
  const submittedRef = React.useRef(false);

  useEffect(() => {
    if (autoSubmit && submitTimer > 0) {
      const timer = setInterval(() => {
        setSubmitTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [submitTimer, autoSubmit]);

  const handleSubmit = async () => {
    if (submittedRef.current || isSubmitting) return;

    submittedRef.current = true;
    setIsSubmitting(true);

    Axios.post<SubmitQuizResponse, { status: number }>('/api/submit',
      quizState,
    ).then((response: SubmitQuizResponse) => {
      if (response.status === 200) {
        setSubmitComplete(true);
        localStorage.removeItem(`mcq-quiz-${id}`); // Clear local storage
        setTimeout(() => {
          navigate(`/`);
        }, 3000); // Redirect after 3 seconds
      }
    }).catch((error: unknown) => {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      submittedRef.current = false; // Allow retry
      alert('Failed to submit quiz. Please try again.');
    });

  };

  if (submitComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-strong p-8 text-center animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Quiz Submitted Successfully!
            </h1>

            <p className="text-gray-600 mb-8 text-lg">
              Your answers have been recorded. Redirecting you to the Home page...
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{answeredCount}</div>
                <div className="text-blue-700 font-medium">Questions Answered</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{questions.length}</div>
                <div className="text-purple-700 font-medium">Total Questions</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-strong overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              {autoSubmit ? 'Time Expired - Quiz Overview' : 'Quiz Overview'}
            </h1>
            <p className="text-blue-100">Review your answers before final submission</p>
          </div>

          {/* Auto-submit Warning */}
          {autoSubmit && (
            <div className="bg-gradient-to-r from-red-400 to-red-500 px-8 py-4 text-white">
              <div className="flex items-center space-x-4">
                <Clock className="w-6 h-6 animate-pulse" />
                <div>
                  <h3 className="font-bold text-lg">Time has expired!</h3>
                  <p>Your quiz will be automatically submitted in {submitTimer} seconds.</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Ring */}
          <div className="flex justify-center m-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(answeredCount / questions.length) * 201.06} 201.06`}
                  className="drop-shadow-sm transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {Math.round((answeredCount / questions.length) * 100)}%
                </span>
              </div>
            </div>
          </div>


          <div className="p-5">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-700">{answeredCount}</div>
                    <div className="text-green-600 font-medium">Answered</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                    <Circle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-700">{unansweredCount}</div>
                    <div className="text-gray-600 font-medium">Unanswered</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-700">{markedCount}</div>
                    <div className="text-yellow-600 font-medium">Marked for Review</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning for Unanswered Questions */}
            {unansweredCount > 0 && !autoSubmit && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2">Incomplete Quiz</h3>
                    <p className="text-yellow-700">
                      You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}.
                      Are you sure you want to submit?
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Question Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span>Question Summary</span>
              </h3>

              <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-2 mb-6">
                {questions.map((question, index) => {
                  const isAnswered = selectedAnswers[question.question_id] !== undefined;
                  const isMarked = markedForReview.includes(question.question_id);

                  let statusClass = 'bg-gray-200 text-gray-600';
                  if (isAnswered && isMarked) statusClass = 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white';
                  else if (isAnswered) statusClass = 'bg-gradient-to-br from-green-500 to-emerald-600 text-white';
                  else if (isMarked) statusClass = 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white';

                  return (
                    <div
                      key={question.question_id}
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-105 shadow-soft
                        ${statusClass}
                      `}
                      title={`Question ${index + 1}: ${isAnswered && isMarked ? 'Answered & Marked' :
                        isAnswered ? 'Answered' :
                          isMarked ? 'Marked' : 'Unanswered'
                        }`}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded" />
                  <span className="text-sm text-gray-600">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded" />
                  <span className="text-sm text-gray-600">Marked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded" />
                  <span className="text-sm text-gray-600">Answered & Marked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <span className="text-sm text-gray-600">Unanswered</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {!autoSubmit && onCancel && (
                <button
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Quiz</span>
                </button>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (autoSubmit && submitTimer > 0)}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 shadow-medium hover:shadow-strong"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : autoSubmit ? (
                  <>
                    <Clock className="w-5 h-5" />
                    <span>Auto-submitting in {submitTimer}s</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Quiz</span>
                  </>
                )}
              </button>
            </div>

            {/* Final Reminder */}
            {!autoSubmit && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Trophy className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Important Reminder</h4>
                    <p className="text-blue-700">
                      Once you submit, you cannot make any changes to your answers.
                      Please review your responses carefully before submitting.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizOverview;