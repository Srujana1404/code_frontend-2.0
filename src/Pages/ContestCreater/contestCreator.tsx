import React, { useRef, useState } from 'react';
import { Plus, Trash2, Eye, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { Question, Option } from '../../types/dataTypes';
import { useNavigate } from 'react-router-dom';
import { useContest } from '../../components/common/contestContext';

const ContestCreator: React.FC = () => {
    const navigate = useNavigate();
    const { contest, setContest } = useContest();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Refs for contest info fields
    const cNameRef = useRef<HTMLInputElement>(null);
    const cDescRef = useRef<HTMLTextAreaElement>(null);
    const cStartTimeRef = useRef<HTMLInputElement>(null);
    const cEndTimeRef = useRef<HTMLInputElement>(null);

    // Refs for dynamic question fields
    const questionRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
    const marksRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const negativeMarksRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const correctRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const optionRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q_${Date.now()}`,
            question_text: '',
            marks: 1,
            negative_marks: 0,
            options: [
                { id: `opt_${Date.now()}_1`, option_text: '', is_correct: false },
                { id: `opt_${Date.now()}_2`, option_text: '', is_correct: false }
            ],
            optionCount: 2
        };

        setContest(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const removeQuestion = (questionId: string) => {
        // Clean up refs when removing question
        delete questionRefs.current[questionId];
        delete marksRefs.current[questionId];
        delete negativeMarksRefs.current[questionId];
        delete correctRefs.current[questionId];

        setContest(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
        }));
    };

    const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
        setContest(prev => ({
            ...prev,
            questions: prev.questions.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
            )
        }));
    };

    const updateOptionCount = (questionId: string, count: number) => {
        const question = contest.questions.find(q => q.id === questionId);
        if (!question) return;

        let newOptions = [...question.options];

        if (count > newOptions.length) {
            for (let i = newOptions.length; i < count; i++) {
                newOptions.push({
                    id: `opt_${Date.now()}_${i + 1}`,
                    option_text: '',
                    is_correct: false
                });
            }
        } else {
            newOptions = newOptions.slice(0, count);
            // Clean up refs for removed options
            question.options.slice(count).forEach(option => {
                delete optionRefs.current[option.id];
            });
        }

        updateQuestion(questionId, 'options', newOptions);
        updateQuestion(questionId, 'optionCount', count);
    };

    const updateOption = (questionId: string, optionId: string, field: keyof Option, value: any) => {
        setContest(prev => ({
            ...prev,
            questions: prev.questions.map(q =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map(opt =>
                            opt.id === optionId ? { ...opt, [field]: value } : opt
                        )
                    }
                    : q
            )
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!contest.cName.trim()) newErrors.cName = 'Contest name is required';
        if (!contest.cDesc.trim()) newErrors.cDesc = 'Contest description is required';
        if (!contest.cStartTime) newErrors.cStartTime = 'Start time is required';
        if (!contest.cEndTime) newErrors.cEndTime = 'End time is required';

        if (contest.cStartTime && contest.cEndTime && contest.cStartTime >= contest.cEndTime) {
            newErrors.cEndTime = 'End time must be after start time';
        }

        if (contest.questions.length === 0) {
            newErrors.questions = 'At least one question is required';
        }

        contest.questions.forEach((question) => {
            if (!question.question_text.trim()) {
                newErrors[`question_${question.id}`] = 'Question text is required';
            }

            if (question.marks <= 0) {
                newErrors[`marks_${question.id}`] = 'Marks must be greater than 0';
            }

            if (question.negative_marks < 0) {
                newErrors[`negative_marks_${question.id}`] = 'Negative marks cannot be negative';
            }

            const hasCorrectAnswer = question.options.some(opt => opt.is_correct);
            if (!hasCorrectAnswer) {
                newErrors[`correct_${question.id}`] = 'At least one option must be marked as correct';
            }

            question.options.forEach((option) => {
                if (!option.option_text.trim()) {
                    newErrors[`option_${option.id}`] = 'Option text is required';
                }
            });
        });

        // Scroll to first error field
        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => {
                if (newErrors.cName && cNameRef.current) {
                    cNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    cNameRef.current.focus();
                } else if (newErrors.cDesc && cDescRef.current) {
                    cDescRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    cDescRef.current.focus();
                } else if (newErrors.cStartTime && cStartTimeRef.current) {
                    cStartTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    cStartTimeRef.current.focus();
                } else if (newErrors.cEndTime && cEndTimeRef.current) {
                    cEndTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    cEndTimeRef.current.focus();
                } else if (newErrors.questions) {
                    // Scroll to questions section
                    const el = document.getElementById('questions-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // For dynamic question/option errors
                    for (const key of Object.keys(newErrors)) {
                        if (key.startsWith('question_') && questionRefs.current[key.replace('question_', '')]) {
                            questionRefs.current[key.replace('question_', '')]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            questionRefs.current[key.replace('question_', '')]?.focus();
                            break;
                        }
                        if (key.startsWith('marks_') && marksRefs.current[key.replace('marks_', '')]) {
                            marksRefs.current[key.replace('marks_', '')]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            marksRefs.current[key.replace('marks_', '')]?.focus();
                            break;
                        }
                        if (key.startsWith('negative_marks_') && negativeMarksRefs.current[key.replace('negative_marks_', '')]) {
                            negativeMarksRefs.current[key.replace('negative_marks_', '')]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            negativeMarksRefs.current[key.replace('negative_marks_', '')]?.focus();
                            break;
                        }
                        if (key.startsWith('correct_') && correctRefs.current[key.replace('correct_', '')]) {
                            correctRefs.current[key.replace('correct_', '')]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            break;
                        }
                        if (key.startsWith('option_') && optionRefs.current[key.replace('option_', '')]) {
                            optionRefs.current[key.replace('option_', '')]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            optionRefs.current[key.replace('option_', '')]?.focus();
                            break;
                        }
                    }
                }
            }, 100);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePreview = () => {
        if (!validateForm()) {
            return;
        }
        navigate('/admin/preview')
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-6 px-4 transition-all duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8 animate-fade-in">
                    <div className="bg-white p-3 rounded-full shadow-lg">
                        <FileText className="text-blue-600" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Create Quiz Contest</h1>
                        <p className="text-gray-600 text-base md:text-lg">Build engaging quizzes with multiple choice questions</p>
                    </div>
                </header>

                {/* Contest Info Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 transition-all duration-300 animate-slide-in-up hover:shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Contest Information</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-2">
                            <label htmlFor="cName" className="block font-semibold text-gray-700 mb-2">
                                Contest Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                ref={cNameRef}
                                id="cName"
                                type="text"
                                value={contest.cName}
                                onChange={(e) => setContest(prev => ({ ...prev, cName: e.target.value }))}
                                placeholder="Enter an engaging contest name"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 ${errors.cName ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.cName && (
                                <div className="flex items-center gap-2 mt-2">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <span className="text-red-500 text-sm">{errors.cName}</span>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <label htmlFor="cDesc" className="block font-semibold text-gray-700 mb-2">
                                Contest Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                ref={cDescRef}
                                id="cDesc"
                                rows={3}
                                value={contest.cDesc}
                                onChange={(e) => setContest(prev => ({ ...prev, cDesc: e.target.value }))}
                                placeholder="Describe your contest and its objectives"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 resize-none ${errors.cDesc ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.cDesc && (
                                <div className="flex items-center gap-2 mt-2">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <span className="text-red-500 text-sm">{errors.cDesc}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="cStartTime" className="block font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-blue-600" />
                                    Start Time <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                ref={cStartTimeRef}
                                id="cStartTime"
                                type="datetime-local"
                                value={contest.cStartTime}
                                onChange={(e) => setContest(prev => ({ ...prev, cStartTime: e.target.value }))}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 ${errors.cStartTime ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.cStartTime && (
                                <div className="flex items-center gap-2 mt-2">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <span className="text-red-500 text-sm">{errors.cStartTime}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="cEndTime" className="block font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-red-600" />
                                    End Time <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                ref={cEndTimeRef}
                                id="cEndTime"
                                type="datetime-local"
                                value={contest.cEndTime}
                                onChange={(e) => setContest(prev => ({ ...prev, cEndTime: e.target.value }))}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 ${errors.cEndTime ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.cEndTime && (
                                <div className="flex items-center gap-2 mt-2">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <span className="text-red-500 text-sm">{errors.cEndTime}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add First Question Button - Initially below contest card */}
                {contest.questions.length === 0 && (
                    <div className="flex justify-center mb-8 animate-bounce-gentle">
                        <button
                            onClick={addQuestion}
                            className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-lg">Add Your First Question</span>
                        </button>
                    </div>
                )}

                {/* Questions Section */}
                {contest.questions.length > 0 && (
                    <div id="questions-section" className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <FileText className="text-purple-600" size={24} />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                Questions ({contest.questions.length})
                            </h2>
                        </div>

                        {errors.questions && (
                            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle size={18} className="text-red-500" />
                                <span className="text-red-500 text-sm">{errors.questions}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            {contest.questions.map((question, index) => (
                                <React.Fragment key={question.id}>
                                    {/* Question Card */}
                                    <div
                                        className="bg-white border-2 border-gray-100 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 p-6 shadow-sm transition-all duration-300 animate-slide-in-up hover:shadow-lg hover:border-blue-200"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Question Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-lg">
                                                    {index + 1}
                                                </span>
                                                <span className="text-lg font-semibold text-gray-700">Question {index + 1}</span>
                                            </div>
                                            <button
                                                onClick={() => removeQuestion(question.id)}
                                                className="group text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                                                aria-label="Remove question"
                                            >
                                                <Trash2 size={20} className="group-hover:scale-110 transition-transform duration-200" />
                                            </button>
                                        </div>

                                        {/* Question Text */}
                                        <div className="mb-6">
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                Question Text <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                ref={el => { questionRefs.current[question.id] = el; }}
                                                rows={3}
                                                value={question.question_text}
                                                onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                                                placeholder="Enter your question here..."
                                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 resize-none ${errors[`question_${question.id}`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                            {errors[`question_${question.id}`] && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <AlertCircle size={16} className="text-red-500" />
                                                    <span className="text-red-500 text-sm">{errors[`question_${question.id}`]}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Question Config */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div>
                                                <label className="block font-semibold text-gray-700 mb-2">
                                                    Marks <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    ref={el => { marksRefs.current[question.id] = el; }}
                                                    type="number"
                                                    min={1}
                                                    value={question.marks}
                                                    onChange={(e) => updateQuestion(question.id, 'marks', parseInt(e.target.value) || 1)}
                                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 ${errors[`marks_${question.id}`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                                                />
                                                {errors[`marks_${question.id}`] && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <AlertCircle size={14} className="text-red-500" />
                                                        <span className="text-red-500 text-xs">{errors[`marks_${question.id}`]}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block font-semibold text-gray-700 mb-2">
                                                    Negative Marks
                                                </label>
                                                <input
                                                    ref={el => { negativeMarksRefs.current[question.id] = el; }}
                                                    type="number"
                                                    min={0}
                                                    step={0.1}
                                                    value={question.negative_marks}
                                                    onChange={(e) => updateQuestion(question.id, 'negative_marks', parseFloat(e.target.value) || 0)}
                                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 ${errors[`negative_marks_${question.id}`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                                                />
                                                {errors[`negative_marks_${question.id}`] && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <AlertCircle size={14} className="text-red-500" />
                                                        <span className="text-red-500 text-xs">{errors[`negative_marks_${question.id}`]}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block font-semibold text-gray-700 mb-2">
                                                    Number of Options
                                                </label>
                                                <select
                                                    value={question.optionCount}
                                                    onChange={(e) => updateOptionCount(question.id, parseInt(e.target.value))}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                                                >
                                                    {[2, 3, 4, 5, 6].map((num) => (
                                                        <option key={num} value={num}>
                                                            {num} options
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Options Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-700">Options</h4>
                                                {errors[`correct_${question.id}`] && (
                                                    <div ref={el => { correctRefs.current[question.id] = el; }} className="flex items-center gap-2">
                                                        <AlertCircle size={16} className="text-red-500" />
                                                        <span className="text-red-500 text-sm">{errors[`correct_${question.id}`]}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                {question.options.map((option, optIndex) => (
                                                    <div
                                                        key={option.id}
                                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                                                    >
                                                        <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shadow-md">
                                                            {String.fromCharCode(65 + optIndex)}
                                                        </span>
                                                        <input
                                                            ref={el => { optionRefs.current[option.id] = el; }}
                                                            type="text"
                                                            value={option.option_text}
                                                            onChange={(e) => updateOption(question.id, option.id, 'option_text', e.target.value)}
                                                            placeholder={`Enter option ${String.fromCharCode(65 + optIndex)}`}
                                                            className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 ${errors[`option_${option.id}`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                                                        />
                                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={option.is_correct}
                                                                onChange={(e) => updateOption(question.id, option.id, 'is_correct', e.target.checked)}
                                                                className="accent-green-600 w-4 h-4"
                                                            />
                                                            <CheckCircle size={16} className={option.is_correct ? 'text-green-600' : 'text-gray-400'} />
                                                            <span>Correct</span>
                                                        </label>
                                                        {errors[`option_${option.id}`] && (
                                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                                <AlertCircle size={14} className="text-red-500" />
                                                                <span className="text-red-500 text-xs">{errors[`option_${option.id}`]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                            {/* Add Question Button after each question card */}
                            <div className="flex justify-center animate-fade-in-up">
                                <button
                                    onClick={addQuestion}
                                    className="group flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                >
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                    <span>Add Another Question</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Button */}
                <div className="flex justify-center pb-8 animate-fade-in-up">
                    <button
                        className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-lg"
                        onClick={handlePreview}
                    >
                        <Eye size={24} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>Preview Contest</span>
                    </button>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateX(-20px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        @keyframes bounceGentle {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-in {
          animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
        </div>
    );
};

export default ContestCreator;