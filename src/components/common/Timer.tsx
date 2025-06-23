import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import type { TimerProps } from '../../types/dataTypes';

const Timer: React.FC<TimerProps> = ({ startTime, endTime, status, onTimeComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const calculateInitialTime = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        setTimeLeft(Math.floor((start - now) / 1000));
        setIsActive(false);
      } else if (now >= start && now < end) {
        setTimeLeft(Math.floor((end - now) / 1000));
        setIsActive(true);
      } else {
        setTimeLeft(0);
        setIsActive(false);
        onTimeComplete();
      }
    };

    calculateInitialTime();
    const timer = setInterval(calculateInitialTime, 1000);
    return () => clearInterval(timer);
  }, [startTime, endTime, status, onTimeComplete]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimerStatus = () => {
    if (!isActive) return 'inactive';
    if (timeLeft <= 300) return 'critical'; // Last 5 minutes
    if (timeLeft <= 900) return 'warning'; // Last 15 minutes
    return 'normal';
  };

  const timerStatus = getTimerStatus();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        relative p-4 rounded-2xl shadow-strong backdrop-blur-sm border-2 transition-all duration-300
        ${timerStatus === 'critical' 
          ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 animate-pulse' 
          : timerStatus === 'warning'
          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300'
          : isActive
          ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300'
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
        }
      `}>
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-full transition-colors duration-300
            ${timerStatus === 'critical' 
              ? 'bg-red-500 text-white' 
              : timerStatus === 'warning'
              ? 'bg-yellow-500 text-white'
              : isActive
              ? 'bg-blue-500 text-white'
              : 'bg-gray-500 text-white'
            }
          `}>
            {timerStatus === 'critical' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </div>
          
          <div className="text-center">
            <div className={`
              text-2xl font-bold font-mono tracking-wider transition-colors duration-300
              ${timerStatus === 'critical' 
                ? 'text-red-700' 
                : timerStatus === 'warning'
                ? 'text-yellow-700'
                : isActive
                ? 'text-blue-700'
                : 'text-gray-700'
              }
            `}>
              {formatTime(timeLeft)}
            </div>
            <div className={`
              text-xs font-medium uppercase tracking-wide transition-colors duration-300
              ${timerStatus === 'critical' 
                ? 'text-red-600' 
                : timerStatus === 'warning'
                ? 'text-yellow-600'
                : isActive
                ? 'text-blue-600'
                : 'text-gray-600'
              }
            `}>
              {!isActive ? 'Contest Inactive' : 
               timerStatus === 'critical' ? 'Time Critical!' :
               timerStatus === 'warning' ? 'Time Warning' : 'Time Remaining'}
            </div>
          </div>
        </div>

        {isActive && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`
                  h-1.5 rounded-full transition-all duration-1000 ease-linear
                  ${timerStatus === 'critical' 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : timerStatus === 'warning'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }
                `}
                style={{ 
                  width: `${Math.max(0, Math.min(100, (timeLeft / 7200) * 100))}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;