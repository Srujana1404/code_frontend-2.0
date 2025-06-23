import type { MCQRaw, MCQGrouped } from '../types/mcq';

export const groupQuestions = (data: MCQRaw[]): MCQGrouped[] => {
  const map: { [key: number]: MCQGrouped } = {};
  
  data.forEach((item) => {
    if (!map[item.question_id]) {
      map[item.question_id] = {
        question_id: item.question_id,
        question_text: item.question_text,
        marks: item.marks,
        options: [],
      };
    }
    map[item.question_id].options.push({
      option_id: item.option_id,
      option_text: item.option_text,
    });
  });
  
  return Object.values(map);
};

export const isQuestionAnswered = (
  questionId: number,
  selectedAnswers: { [key: number]: number }
): boolean => {
  return selectedAnswers[questionId] !== undefined;
};

export const isQuestionMarked = (
  questionId: number,
  markedForReview: number[]
): boolean => {
  return markedForReview.includes(questionId);
};

export const getQuestionStatusClass = (
  questionId: number,
  selectedAnswers: { [key: number]: number },
  markedForReview: number[]
): string => {
  const isAnswered = isQuestionAnswered(questionId, selectedAnswers);
  const isMarked = isQuestionMarked(questionId, markedForReview);
  
  if (isMarked) return 'marked';
  if (isAnswered) return 'answered';
  return 'unanswered';
};