import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WarningModal from './WarningModal';
import type { FullscreenWrapperProps, ViolationData } from '../../types/dataTypes';

const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({ children, status }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [violationCount, setViolationCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxViolations = 2;

  const checkIfDesktop = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
      window.innerWidth < 1024;

    setIsDesktop(!isMobile);
  };

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        await (document.documentElement as any).mozRequestFullScreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await (document.documentElement as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  const reportViolation = async (violationType: string, description: string) => {
    try {
      const violationData: ViolationData = {
        contestId: id || '',
        userId: 'current-user-id',
        violationType,
        timestamp: new Date().toISOString(),
        description
      };
      await fetch('/api/report-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violationData),
      });
    } catch (error) {
      console.error('Failed to report violation:', error);
    }
  };

  const handleViolation = async (type: string, message: string) => {
    const newCount = violationCount + 1;
    setViolationCount(newCount);
    await reportViolation(type, message);

    if (newCount >= maxViolations) {
      navigate('/disqualified', {
        state: {
          reason: 'Multiple malpractice violations detected',
          contestId: id,
        },
      });
    } else {
      setWarningMessage(message);
      setShowWarning(true);
    }
  };

  const handleCloseWarning = async () => {
    setShowWarning(false);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (!isFullscreen) await enterFullscreen();
  };

  useEffect(() => {
    checkIfDesktop();
  }, []);

  useEffect(() => {
    if (status !== 'active' || !isDesktop) return;

    enterFullscreen();

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleFullscreenChange = () => {
      const isCurrentFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentFullscreen);

      if (!isCurrentFullscreen && !showWarning) {
        handleViolation('fullscreen_exit', 'Exiting fullscreen is not allowed during the quiz!');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !showWarning) {
        handleViolation('tab_switch', 'Switching tabs is not allowed!');
      }
    };

    const handleWindowBlur = () => {
      if (!showWarning) {
        handleViolation('window_blur', 'Losing focus on the quiz window is not allowed!');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ['F11', 'Escape', 'F12', 'F5'];
      if (e.ctrlKey && ['c', 'v', 'a', 's', 'r', 'u', 'i', 'j', 'k'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleViolation('keyboard_shortcut', `Ctrl+${e.key.toUpperCase()} is not allowed!`);
        return;
      }
      if (e.altKey && ['Tab', 'F4'].includes(e.key)) {
        e.preventDefault();
        handleViolation('keyboard_shortcut', `Alt+${e.key} is not allowed!`);
        return;
      }
      if (forbiddenKeys.includes(e.key)) {
        e.preventDefault();
        handleViolation('forbidden_key', `Key ${e.key} is not allowed!`);
        return;
      }
      if (e.key === 'Meta' || e.metaKey) {
        e.preventDefault();
        handleViolation('windows_key', 'Windows key is not allowed!');
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        handleViolation('screenshot', 'Screenshots are not allowed!');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [status, violationCount, showWarning, isFullscreen, id, navigate]);

  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);
  
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-strong p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unsupported Device</h2>
          <p className="text-gray-600 leading-relaxed">
            This test can only be taken on a desktop or laptop computer for security and optimal experience.
          </p>
        </div>
      </div>
    );
  }

  if (!isFullscreen && status === 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-strong p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a1 1 0 011-1h4m0 0V1m0 2h2m6 0h2m0 0V1m0 2h4a1 1 0 011 1v4M3 16l4 4m0 0l4-4m-4 4V8m14 8l-4 4m0 0l-4-4m4 4V8" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Enable Fullscreen Mode</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            To begin the quiz, fullscreen mode is required. This helps prevent cheating and ensures a focused experience.
          </p>
          <button 
            onClick={enterFullscreen}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-medium hover:shadow-strong"
          >
            Enter Fullscreen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-wrapper">
      {children}
      {status === 'active' && showWarning && (
        <WarningModal
          message={warningMessage}
          violationCount={violationCount}
          maxViolations={maxViolations}
          onClose={handleCloseWarning}
        />
      )}
    </div>
  );
};

export default FullscreenWrapper;