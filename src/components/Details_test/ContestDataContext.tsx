import React, { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface ContestContextType {
  contestdata: any;
  questions: any[];
  loading: boolean;
}

const ContestContext = createContext<ContestContextType | undefined>(undefined);

export const ContestDataProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contestdata, setContestdata] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to group flat question-option data into proper question objects
  const groupQuestionData = (flatData: any[]) => {
    const questionMap = new Map();

    flatData.forEach((item) => {
      const questionId = item.question_id;
      
      if (!questionMap.has(questionId)) {
        // Create new question object
        questionMap.set(questionId, {
          question_id: questionId,
          question_text: item.question_text,
          marks: item.marks,
          options: []
        });
      }

      // Add option to the question
      const question = questionMap.get(questionId);
      question.options.push({
        option_id: item.option_id,
        option_text: item.option_text,
        is_correct: item.is_correct || false // Add this if your data has correct answer info
      });
    });

    return Array.from(questionMap.values());
  };

  // Fetch contest data
  useEffect(() => {
    Axios.get(`/api/contests/${id}`)
      .then((res) => {
        setContestdata(res.data.contestdata);

        // Handle redirection based on status
        const status = res.data.contestdata?.status;
        if (status === "upcoming") {
          navigate("/upcomingtest");
        } else if (status === "inactive") {
          navigate("/contest-over");
        }
      })
      .catch((err) => console.error("Error fetching contest:", err));
  }, [id, navigate]);

  // Fetch MCQ data
  useEffect(() => {
    setLoading(true);
    Axios.get(`/api/MCQdata/${id}`)
      .then((res) => {
        console.log("Raw MCQ data from API:", res.data.mcqdata);
        
        // Transform the flat data into grouped questions
        const groupedQuestions = groupQuestionData(res.data.mcqdata);
        console.log("Grouped questions:", groupedQuestions);
        
        setQuestions(groupedQuestions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching MCQ data:", err);
        setQuestions([]);
        setLoading(false);
      });
  }, [id]);

  return (
    <ContestContext.Provider value={{ contestdata, questions, loading }}>
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error("useContest must be used within a ContestDataProvider");
  }
  return context;
};