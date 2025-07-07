import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Info, StepBack, Send, StepForward } from 'lucide-react';
import QuestionCard from '../../components/Custom/QuestionCard';
import QuestionNavigation from '../../components/Custom/QuestionNavigation';
import QuizOverview from '../../components/Custom/QuizOverview';
import FullscreenWrapper from '../../components/security/FullscreenWrapper';
import type { MCQGrouped, QuizState, MCQRaw } from '../../types/mcq';
import { groupQuestions } from '../../types/mcqHelpers';
import useLocalStorage from '../../types/useLocalStorage';
import type { contestdata } from '../../types/dataTypes';
import Timer from '../../components/common/Timer';

const MCQQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storageKey = `mcq-quiz-${id}`;

  const [questions, setQuestions] = useState<MCQGrouped[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [contestdata, setContestdata] = useState<contestdata | null>(null);
  const [quizState, setQuizState] = useLocalStorage<QuizState>(storageKey, {
    selectedAnswers: {},
    markedForReview: [],
    currentQuestionIndex: 0,
  });

  const { selectedAnswers, markedForReview, currentQuestionIndex } = quizState;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    Axios.get(`/api/contests/${id}`)
      .then((response: { data: { contestdata: contestdata; }; }) => setContestdata((response.data as { contestdata: contestdata }).contestdata))
      .catch((error: any) => console.error("Error fetching contest:", error));
  }, [id]);

  useEffect(() => {
    if (contestdata && contestdata.status === "upcoming") {
      navigate('/upcomingtest');
    }
  }, [contestdata]);
  console.log(contestdata?.status);

  useEffect(() => {
    if (contestdata && contestdata.status === "inactive") {
      navigate('/contest-over');
    }
  }, [contestdata]);

  useEffect(() => {
  Axios.get(`/api/MCQdata/${id}`)
    .then((res: { data: { mcqdata: MCQRaw[] } }) => {
      console.log("MCQ data received:", res.data.mcqdata);
      const raw = res.data.mcqdata;
      setQuestions(groupQuestions(raw));
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error loading MCQ data", err);
      setQuestions([]);
      setLoading(false);
    });
}, [id]);


  const handleOptionChange = (questionId: number, optionId: number) => {
    setQuizState({
      ...quizState,
      selectedAnswers: {
        ...selectedAnswers,
        [questionId]: optionId,
      },
    });
  };

  const handleToggleMarkForReview = (questionId: number) => {
    const isMarked = markedForReview.includes(questionId);
    const updatedMarkedForReview = isMarked
      ? markedForReview.filter((id: number) => id !== questionId)
      : [...markedForReview, questionId];

    setQuizState({
      ...quizState,
      markedForReview: updatedMarkedForReview,
    });
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: index,
      });
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowOverview(true);
  };

  const handleTimeComplete = () => {
    setTimeExpired(true);
    setShowOverview(true);
  };

  if (loading) {
    return (
      <FullscreenWrapper>
        <div className="min-h-screen bg-gradient-to-br from-violet-100 via-blue-50 to-cyan-100 flex items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center animate-fade-in border border-white/20 relative z-10">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mx-auto flex items-center justify-center animate-spin shadow-lg">
                <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-purple-600 opacity-30 animate-ping"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Loading Quiz...
            </h2>
            <p className="text-gray-600 text-lg">Please wait while we prepare your questions</p>
            <div className="mt-6 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </FullscreenWrapper>
    );
  }

  console.log(markedForReview, selectedAnswers, currentQuestionIndex);
  if (questions.length === 0) {
    return (
      <FullscreenWrapper>
        <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-amber-100 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-20 animate-float"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center animate-scale-in border border-white/20 relative z-10">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Info className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-30 animate-ping"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
              No Questions Found
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              There are no questions available for this quiz at the moment.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            >
              Go Home
            </button>
          </div>
        </div>
      </FullscreenWrapper>
    );
  }

  if (showOverview) {
    return (
      <FullscreenWrapper status={contestdata?.status}>
        <QuizOverview
          questions={questions}
          quizState={quizState}
          onCancel={timeExpired ? undefined : () => setShowOverview(false)}
          autoSubmit={timeExpired}
        />
      </FullscreenWrapper>
    );
  }

  return (
    <FullscreenWrapper status={contestdata?.status}>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Animated background elements */}
        {/* <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-10 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-green-300 to-blue-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        </div> */}

        <div className="max-w-5xl mx-auto p-4 relative z-10">
          {contestdata?.start_time && contestdata?.end_time && (
            <div className="animate-slide-down">
              <Timer
                startTime={contestdata.start_time}
                endTime={contestdata.end_time}
                status={contestdata.status}
                onTimeComplete={handleTimeComplete}
              />
            </div>
          )}

          {/* Enhanced Header */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title */}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                MCQ Quiz
              </h1>

              {/* Answered + Current Question Info */}
              <div className="flex flex-wrap items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">
                    <span className="text-blue-600 font-bold text-lg">
                      {Object.keys(selectedAnswers).length}
                    </span>
                    <span className="text-gray-500">/{questions.length}</span> questions answered
                  </span>
                </div>

                <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

                <span className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold">Progress</span>
                <span className="font-bold text-blue-600">
                  {Math.round((Object.keys(selectedAnswers).length / questions.length) * 100)}%
                </span>
              </div>

              <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>


        </div>
        <div className="max-w-full mx-auto p-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Question Card */}
            <div className="lg:col-span-3">
              {currentQuestion && (
                <div className="animate-slide-in-left">
                  <QuestionCard
                    question={currentQuestion}
                    index={currentQuestionIndex}
                    selectedAnswer={selectedAnswers[currentQuestion.question_id]}
                    isMarkedForReview={markedForReview.includes(currentQuestion.question_id)}
                    onSelectOption={handleOptionChange}
                    onToggleMarkForReview={handleToggleMarkForReview}
                  />

                  {/* Enhanced Navigation Buttons */}
                  <div className="mt-8 flex justify-between items-center">
                    <button
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`
                        group flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform
                        ${currentQuestionIndex === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg hover:-translate-y-1 hover:scale-105'
                        }
                      `}
                    >
                      <StepBack className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                      <span>Previous</span>
                    </button>

                    {isLastQuestion ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="group flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                        <span className="relative z-10">Review & Submit</span>
                      </button>
                    ) : (
                      <button
                        onClick={goToNextQuestion}
                        className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">Next</span>
                        <StepForward className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="animate-slide-in-right">
                <QuestionNavigation
                  questions={questions}
                  selectedAnswers={selectedAnswers}
                  markedForReview={markedForReview}
                  currentQuestionIndex={currentQuestionIndex}
                  onSelectQuestion={goToQuestion}
                />
              </div>

              {isLastQuestion && (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-bounce-in hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Send className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-600 opacity-30 animate-ping"></div>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                      Ready to submit?
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      You've reached the end of the quiz. Review your answers before final submission.
                    </p>
                    <button
                      onClick={handleSubmitQuiz}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Send className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Submit Quiz</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FullscreenWrapper>
  );
};

export default MCQQuiz;
