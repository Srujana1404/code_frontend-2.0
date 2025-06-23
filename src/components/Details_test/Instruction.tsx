import React from 'react';
import { BookOpen, AlertTriangle, Shield, Monitor, Focus, Smartphone, RefreshCw, Code, Clock, Upload } from 'lucide-react';

const Instructions: React.FC = () => {
  const instructions = [
    {
      icon: <Monitor className="w-5 h-5" />,
      text: 'You need a Desktop / Laptop and a stable internet to appear for this contest. Make sure your Desktop / Laptop is plugged in or is sufficiently charged.',
      category: 'Hardware'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: 'You must write the contest in fullscreen mode. Ensure your cursor remains within the contest window during the entire contest.',
      category: 'Security'
    },
    {
      icon: <Upload className="w-5 h-5" />,
      text: 'Once you successfully submit the code for any particular problem, revisiting or reattempting that specific problem will not be possible.',
      category: 'Submission'
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      text: 'In case of any technical problems during the contest, you can refresh the page or try to logout / login.',
      category: 'Technical'
    },
    {
      icon: <Focus className="w-5 h-5" />,
      text: 'Stay focussed and try not to take any breaks during the entire contest.',
      category: 'Focus'
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      text: 'Refrain from using your mobile phone during the entire contest.',
      category: 'Focus'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: 'If you are logged out during the contest, please login again.',
      category: 'Security'
    },
    {
      icon: <Code className="w-5 h-5" />,
      text: 'If after running / submitting the code you encounter issues such as Compile Time Error / Run Time Error / Time Limit Exceeded / Wrong Answer, please note that the issue lies within your code. Kindly revisit and review your code for errors.',
      category: 'Technical'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: 'Please be aware that the timer will change to red colour / blink during the final few minutes.',
      category: 'Timer'
    },
    {
      icon: <Upload className="w-5 h-5" />,
      text: 'Make sure you submit all your codes before ending the contest.',
      category: 'Submission'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hardware': return 'from-blue-500 to-indigo-600';
      case 'Security': return 'from-red-500 to-red-600';
      case 'Submission': return 'from-green-500 to-emerald-600';
      case 'Technical': return 'from-purple-500 to-indigo-600';
      case 'Focus': return 'from-yellow-500 to-orange-500';
      case 'Timer': return 'from-pink-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'Hardware': return 'from-blue-50 to-indigo-50';
      case 'Security': return 'from-red-50 to-red-100';
      case 'Submission': return 'from-green-50 to-emerald-50';
      case 'Technical': return 'from-purple-50 to-indigo-50';
      case 'Focus': return 'from-yellow-50 to-orange-50';
      case 'Timer': return 'from-pink-50 to-rose-50';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-strong border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Contest Instructions</h2>
          </div>
          <p className="text-indigo-100 mt-2">Please read all instructions carefully before starting the contest</p>
        </div>

        {/* Instructions List */}
        <div className="p-8">
          <div className="space-y-4">
            {instructions.map((instruction, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${getCategoryBg(instruction.category)} rounded-2xl p-6 border border-opacity-20 hover:shadow-medium transition-all duration-200`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(instruction.category)} rounded-xl flex items-center justify-center text-white shadow-medium`}>
                      {instruction.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                        {instruction.category}
                      </span>
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {instruction.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-red-800 mb-2">Important Notice</h3>
                <p className="text-red-700">
                  Violation of any of these instructions may result in disqualification from the contest. 
                  Please ensure you understand and agree to all terms before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;