import React, { useState } from 'react';
import { Plus, Trash2, Eye, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContest } from './contestContext';
import { CustTextField } from '../Custom/CustTextField';
import type { Question, Option } from '../../types/dataTypes';

const ContestCreator: React.FC = () => {
    const navigate = useNavigate();
    const { contest, setContest, setShowUpdateAlert } = useContest();
    const [errors, setErrors] = useState<Record<string, string>>({});

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
            // Add new options
            for (let i = newOptions.length; i < count; i++) {
                newOptions.push({
                    id: `opt_${Date.now()}_${i + 1}`,
                    option_text: '',
                    is_correct: false
                });
            }
        } else {
            // Remove options
            newOptions = newOptions.slice(0, count);
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

        contest.questions.forEach((question, _qIndex) => {
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

            question.options.forEach((option, _oIndex) => {
                if (!option.option_text.trim()) {
                    newErrors[`option_${option.id}`] = 'Option text is required';
                }
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePreview = () => {
        if (!validateForm()) {
            console.log('Validation failed');
            return;
        }
        setShowUpdateAlert(true);
        navigate('/preview');
    };

    return (
        <div className="contest-creator">
            <div className="contest-container">
                <header className="contest-header">
                    <div className="header-content">
                        <FileText className="header-icon" size={32} />
                        <div>
                            <h1>Create Quiz Contest</h1>
                            <p>Build engaging quizzes with multiple choice questions</p>
                        </div>
                    </div>
                </header>

                {/* Contest Info Section */}
                {/* <div className="contest-info-card">
                    <h2>Contest Information</h2>

                    <div style={{ gap: '2rem'}}>
                        <label htmlFor="cName">Contest Name *</label>
                        <CustTextField
                            id="cName"
                            type="text"
                            value={contest.cName}
                            onChange={(e) => setContest(prev => ({ ...prev, cName: e.target.value }))}
                            placeholder="Enter contest name"
                            className={errors.cName ? 'error' : ''}
                        />
                        {errors.cName && <span className="error-message">{errors.cName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="cDesc">Contest Description *</label>
                        <CustTextField
                            id="cDesc"
                            value={contest.cDesc}
                            onChange={(e) => setContest(prev => ({ ...prev, cDesc: e.target.value }))}
                            placeholder="Enter contest description"
                            rows={3}
                            className={errors.cDesc ? 'error' : ''}
                        />
                        {errors.cDesc && <span className="error-message">{errors.cDesc}</span>}
                    </div>

                    <div className="time-inputs">
                        <div className="form-group">
                            <label htmlFor="cStartTime">
                                <Clock size={16} />
                                Start Time *
                            </label>
                            <CustTextField
                                id="cStartTime"
                                type="datetime-local"
                                value={contest.cStartTime}
                                onChange={(e) => setContest(prev => ({ ...prev, cStartTime: e.target.value }))}
                                className={errors.cStartTime ? 'error' : ''}
                            />
                            {errors.cStartTime && <span className="error-message">{errors.cStartTime}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cEndTime">
                                <Clock size={16} />
                                End Time *
                            </label>
                            <CustTextField
                                id="cEndTime"
                                type="datetime-local"
                                value={contest.cEndTime}
                                onChange={(e) => setContest(prev => ({ ...prev, cEndTime: e.target.value }))}
                                className={errors.cEndTime ? 'error' : ''}
                            />
                            {errors.cEndTime && <span className="error-message">{errors.cEndTime}</span>}
                        </div>
                    </div>
                </div> */}

                <div
                    style={{
                        padding: '2rem',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        fontFamily: 'Arial, sans-serif',
                    }}
                >
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#333' }}>
                        Contest Information
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <label htmlFor="cName" style={{ fontWeight: 600 }}>Contest Name *</label>
                        <CustTextField
                            id="cName"
                            type="text"
                            value={contest.cName}
                            onChange={(e: { target: { value: any; }; }) => setContest(prev => ({ ...prev, cName: e.target.value }))}
                            placeholder="Enter contest name"
                            className={errors.cName ? 'error' : ''}
                        />
                        {errors.cName && (
                            <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.cName}</span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <label htmlFor="cDesc" style={{ fontWeight: 600 }}>Contest Description *</label>
                        <CustTextField
                            id="cDesc"
                            value={contest.cDesc}
                            onChange={(e: { target: { value: any; }; }) => setContest(prev => ({ ...prev, cDesc: e.target.value }))}
                            placeholder="Enter contest description"
                            rows={3}
                            className={errors.cDesc ? 'error' : ''}
                        />
                        {errors.cDesc && (
                            <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.cDesc}</span>
                        )}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '2rem',
                            marginBottom: '1rem',
                        }}
                    >
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="cStartTime" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> Start Time *
                            </label>
                            <CustTextField
                                id="cStartTime"
                                type="datetime-local"
                                value={contest.cStartTime}
                                onChange={(e: { target: { value: any; }; }) => setContest(prev => ({ ...prev, cStartTime: e.target.value }))}
                                className={errors.cStartTime ? 'error' : ''}
                            />
                            {errors.cStartTime && (
                                <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.cStartTime}</span>
                            )}
                        </div>

                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="cEndTime" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> End Time *
                            </label>
                            <CustTextField
                                id="cEndTime"
                                type="datetime-local"
                                value={contest.cEndTime}
                                onChange={(e: { target: { value: any; }; }) => setContest(prev => ({ ...prev, cEndTime: e.target.value }))}
                                className={errors.cEndTime ? 'error' : ''}
                            />
                            {errors.cEndTime && (
                                <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.cEndTime}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                {/* <div className="questions-section">
                    <div className="section-header">
                        <h2>Questions</h2>
                        <button
                            className="add-question-btn"
                            onClick={addQuestion}
                        >
                            <Plus size={20} />
                            Add Question
                        </button>
                    </div>

                    {errors.questions && <span className="error-message">{errors.questions}</span>}

                    {contest.questions.map((question, index) => (
                        <div key={question.id} className="question-card">
                            <div className="question-header">
                                <span className="question-number">{index + 1}</span>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeQuestion(question.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Question Text *</label>
                                <textarea
                                    value={question.question_text}
                                    onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                                    placeholder="Enter your question"
                                    rows={2}
                                    className={errors[`question_${question.id}`] ? 'error' : ''}
                                />
                                {errors[`question_${question.id}`] && (
                                    <span className="error-message">{errors[`question_${question.id}`]}</span>
                                )}
                            </div>

                            <div className="question-config">
                                <div className="form-group">
                                    <label>Marks *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={question.marks}
                                        onChange={(e) => updateQuestion(question.id, 'marks', parseInt(e.target.value) || 1)}
                                        className={errors[`marks_${question.id}`] ? 'error' : ''}
                                    />
                                    {errors[`marks_${question.id}`] && (
                                        <span className="error-message">{errors[`marks_${question.id}`]}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Negative Marks</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={question.negative_marks}
                                        onChange={(e) => updateQuestion(question.id, 'negative_marks', parseFloat(e.target.value) || 0)}
                                        className={errors[`negative_marks_${question.id}`] ? 'error' : ''}
                                    />
                                    {errors[`negative_marks_${question.id}`] && (
                                        <span className="error-message">{errors[`negative_marks_${question.id}`]}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Number of Options</label>
                                    <select
                                        value={question.optionCount}
                                        onChange={(e) => updateOptionCount(question.id, parseInt(e.target.value))}
                                    >
                                        {[2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num} options</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="options-section">
                                <h4>Options</h4>
                                {errors[`correct_${question.id}`] && (
                                    <span className="error-message">{errors[`correct_${question.id}`]}</span>
                                )}

                                {question.options.map((option, optIndex) => (
                                    <div key={option.id} className="option-input">
                                        <div className="option-content">
                                            <span
                                                style={{
                                                    backgroundColor: '#38ada9',
                                                    color: 'white',
                                                    padding: '0.5rem',
                                                    borderRadius: '50%',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '2rem',
                                                    height: '2rem',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {String.fromCharCode(65 + optIndex)}
                                            </span>
                                            <CustTextField
                                                type="text"
                                                value={option.option_text}
                                                onChange={(e) => updateOption(question.id, option.id, 'option_text', e.target.value)}
                                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                                className={errors[`option_${option.id}`] ? 'error' : ''}
                                            />
                                            <label className="correct-toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={option.is_correct}
                                                    onChange={(e) => updateOption(question.id, option.id, 'is_correct', e.target.checked)}
                                                />
                                                <span className="checkmark"></span>
                                                Correct
                                            </label>
                                        </div>
                                        {errors[`option_${option.id}`] && (
                                            <span className="error-message">{errors[`option_${option.id}`]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div> */}

                <div
                    style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Questions</h2>
                        <button
                            onClick={addQuestion}
                            style={{
                                backgroundColor: '#4b7bec',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            <Plus size={20} />
                            Add Question
                        </button>
                    </div>

                    {errors.questions && (
                        <span style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem', display: 'block' }}>
                            {errors.questions}
                        </span>
                    )}

                    {contest.questions.map((question, index) => (
                        <div
                            key={question.id}
                            style={{
                                border: '1px solid #eee',
                                padding: '1rem',
                                borderRadius: '10px',
                                marginBottom: '1.5rem',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            {/* Question Header */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                }}
                            >
                                <span
                                    style={{
                                        backgroundColor: '#4b7bec',
                                        color: 'white',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '2rem',
                                        height: '2rem',
                                    }}
                                >
                                    {index + 1}
                                </span>
                                <button
                                    onClick={() => removeQuestion(question.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#dc3545',
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Question Text */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Question Text *
                                </label>
                                <CustTextField
                                    multiline
                                    rows={2}
                                    value={question.question_text}
                                    onChange={(e: { target: { value: any; }; }) =>
                                        updateQuestion(question.id, 'question_text', e.target.value)
                                    }
                                    placeholder="Enter your question"
                                    style={{ width: '100%' }}
                                />
                                {errors[`question_${question.id}`] && (
                                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
                                        {errors[`question_${question.id}`]}
                                    </span>
                                )}
                            </div>

                            {/* Question Config */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginBottom: '1rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div style={{ flex: '1 1 150px' }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        Marks *
                                    </label>
                                    <CustTextField
                                        type="number"
                                        value={question.marks}
                                        onChange={(e: { target: { value: string; }; }) => updateQuestion(question.id, 'marks', parseInt(e.target.value) || 1)}
                                        inputProps={{ min: 1 }}
                                        style={{ width: '100%' }}
                                    />

                                    {errors[`marks_${question.id}`] && (
                                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                                            {errors[`marks_${question.id}`]}
                                        </span>
                                    )}
                                </div>

                                <div style={{ flex: '1 1 150px' }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        Negative Marks
                                    </label>
                                    <CustTextField
                                        type="number"
                                        value={question.negative_marks}
                                        onChange={(e: { target: { value: string; }; }) =>
                                            updateQuestion(question.id, 'negative_marks', parseFloat(e.target.value) || 0)
                                        }
                                        inputProps={{ min: 0, step: 0.1 }}
                                        style={{ width: '100%' }}
                                    />

                                    {errors[`negative_marks_${question.id}`] && (
                                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                                            {errors[`negative_marks_${question.id}`]}
                                        </span>
                                    )}
                                </div>

                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        Number of Options
                                    </label>
                                    <select
                                        value={question.optionCount}
                                        onChange={(e) => updateOptionCount(question.id, parseInt(e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '6px',
                                            border: '1px solid #ccc',
                                            fontSize: '1rem',
                                        }}
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
                                <h4 style={{ marginBottom: '0.5rem' }}>Options</h4>
                                {errors[`correct_${question.id}`] && (
                                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
                                        {errors[`correct_${question.id}`]}
                                    </span>
                                )}

                                {question.options.map((option, optIndex) => (
                                    <div
                                        key={option.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            marginBottom: '1rem',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <span
                                            style={{
                                                backgroundColor: '#38ada9',
                                                color: 'white',
                                                padding: '0.5rem',
                                                borderRadius: '50%',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '2rem',
                                                height: '2rem',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {String.fromCharCode(65 + optIndex)}
                                        </span>

                                        <CustTextField
                                            type="text"
                                            value={option.option_text}
                                            onChange={(e: { target: { value: any; }; }) =>
                                                updateOption(question.id, option.id, 'option_text', e.target.value)
                                            }
                                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                            style={{ flex: '1' }}
                                        />

                                        <label
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={option.is_correct}
                                                onChange={(e) =>
                                                    updateOption(question.id, option.id, 'is_correct', e.target.checked)
                                                }
                                            />
                                            Correct
                                        </label>

                                        {errors[`option_${option.id}`] && (
                                            <span style={{ color: 'red', fontSize: '0.875rem', flexBasis: '100%' }}>
                                                {errors[`option_${option.id}`]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Preview Button */}
                <div className="preview-section">
                    <button
                        className="preview-btn"
                        onClick={handlePreview}
                    >
                        <Eye size={20} />
                        Preview Contest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContestCreator;