export interface contestdata {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  collegeName: string;
  rollNumber: string;
  department: string;
  qrImage: File | null;
  paymentScreenshot: File | null;
}

export interface QuizOverviewProps {
  questions: MCQGrouped[];
  quizState: QuizState;
  onCancel?: () => void;
  autoSubmit: boolean;
}

export interface Question {
  id: string;
  question_text: string;
  marks: number;
  negative_marks: number;
  options: Option[];
  optionCount: number;
}

export interface Contest {
  cName: string;
  cDesc: string;
  cStartTime: string;
  cEndTime: string;
  questions: Question[];
}

export interface ContestContextType {
  contest: Contest;
  setContest: React.Dispatch<React.SetStateAction<Contest>>;
  showUpdateAlert: boolean;
  setShowUpdateAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TimerProps {
  startTime: string;
  endTime: string;
  status: string;
  onTimeComplete: () => void;
}


export interface QuestionNavigationProps {
  questions: MCQGrouped[];
  selectedAnswers: { [key: number]: number };
  markedForReview: number[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
}

export interface ContestCardProps {
  title: string;
  description: string;
  status: string;
  onStart: () => void;
}

export interface InfoTableProps {
  totalQuestions: number;
  totalScore: number;
  contestDuration: string;
  startTime: string;
  endTime: string;
}

export interface FullscreenWrapperProps {
  children: React.ReactNode;
  status?: string;
}

export interface ViolationData {
  contestId: string;
  userId: string;
  violationType: string;
  timestamp: string;
  description: string;
}

export interface WarningModalProps {
  message: string;
  violationCount: number;
  maxViolations: number;
  onClose: () => void;
}

export type FormErrors = {
  [K in keyof FormData]?: string;
};