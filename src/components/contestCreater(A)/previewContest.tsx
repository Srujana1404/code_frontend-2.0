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
    navigate('/');
  };

  const handleSubmit = () => {
    console.log('Contest submitted:', contest);
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
      <div className="preview-container">
        <div className="empty-state">
          <FileText size={64} className="empty-icon" />
          <h2>No Contest to Preview</h2>
          <p>Please create a contest first to view the preview.</p>
          <button onClick={handleEdit} className="edit-btn">
            <Edit size={20} />
            Create Contest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="preview-content">
        {showUpdateAlert && (
          <div className="update-alert">
            🔄 Preview updated after changes.
          </div>
        )}
        
        <header className="preview-header">
          <div className="header-content">
            <FileText className="header-icon" size={32} />
            <div>
              <h1>Contest Preview</h1>
              <p>Review your contest before submission</p>
            </div>
          </div>
        </header>

        <div className="contest-details-card">
          <h2>Contest Information</h2>
          <div className="detail-item">
            <strong>Contest Name:</strong>
            <span>{contest.cName}</span>
          </div>
          <div className="detail-item">
            <strong>Description:</strong>
            <span>{contest.cDesc}</span>
          </div>
          <div className="time-details">
            <div className="time-item">
              <Clock size={16} />
              <strong>Start Time:</strong>
              <span>{formatDateTime(contest.cStartTime)}</span>
            </div>
            <div className="time-item">
              <Clock size={16} />
              <strong>End Time:</strong>
              <span>{formatDateTime(contest.cEndTime)}</span>
            </div>
          </div>
        </div>

        <div className="questions-preview">
          <h2>Questions ({contest.questions.length})</h2>
          {contest.questions.map((question, index) => (
            <div key={question.id} className="question-preview-card">
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <div className="marks-info">
                  <span className="marks">
                    <Award size={16} />
                    {question.marks} marks
                  </span>
                  {question.negative_marks > 0 && (
                    <span className="negative-marks">
                      <Minus size={16} />
                      {question.negative_marks} negative
                    </span>
                  )}
                </div>
              </div>
              
              <div className="question-text">
                {question.question_text}
              </div>
              
              <div className="options-list">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={option.id} 
                    className={`option-item ${option.is_correct ? 'correct-option' : ''}`}
                  >
                    <span className="option-label">
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className="option-text">{option.option_text}</span>
                    {option.is_correct && (
                      <span className="correct-badge">✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button onClick={handleEdit} className="edit-btn">
            <Edit size={20} />
            Edit Contest
          </button>
          <button onClick={handleSubmit} className="submit-btn">
            <Send size={20} />
            Submit Contest
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <SubmissionSuccess onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default PreviewContest;
