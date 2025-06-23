import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SubmissionSuccessProps {
  onClose: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="success-content">
          <CheckCircle className="success-icon" size={64} />
          <h2>🎉 Contest Successfully Submitted!</h2>
          <p>Your quiz contest has been created and is ready to use.</p>
          
          <button onClick={onClose} className="success-btn">
            Great!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
