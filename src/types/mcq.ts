export interface MCQOption {
  option_id: number;
  option_text: string;
}

export interface MCQRaw {
  question_id: number;
  question_text: string;
  marks: number;
  option_id: number;
  option_text: string;
}

export interface MCQGrouped {
  question_id: number;
  question_text: string;
  marks: number;
  options: MCQOption[];
}
export interface QuestionCardProps {
  question: MCQGrouped;
  index: number;
  selectedAnswer: number | undefined;
  isMarkedForReview: boolean;
  onSelectOption: (questionId: number, optionId: number) => void;
  onToggleMarkForReview: (questionId: number) => void;
}

export interface QuizState {
  selectedAnswers: { [key: number]: number };
  markedForReview: number[];
  currentQuestionIndex: number;
}