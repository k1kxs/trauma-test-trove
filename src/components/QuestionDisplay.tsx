import { useState } from "react";
import { QuestionData } from "@/types/questions.types";
import ProgressBar from "./question/ProgressBar";
import QuestionImage from "./question/QuestionImage";
import AnswerOptions from "./question/AnswerOptions";

interface QuestionDisplayProps {
  question: QuestionData;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onComplete: () => void;
}

const QuestionDisplay = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionDisplayProps) => {
  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="space-y-6">
      <ProgressBar 
        currentQuestion={currentQuestion} 
        totalQuestions={totalQuestions} 
      />

      <QuestionImage 
        image={question.image}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />

      <AnswerOptions 
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={question.correctAnswer}
        onAnswerSelect={onAnswerSelect}
      />
    </div>
  );
};

export default QuestionDisplay;