import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TestResults from "./TestResults";
import QuestionDisplay from "./QuestionDisplay";
import { TestInterfaceProps } from "@/types/test.types";
import { mockQuestions } from "@/data/mockQuestions";

const TestInterface = ({ section, onComplete }: TestInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(mockQuestions.length).fill(false)
  );

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);
    
    if (answerIndex === mockQuestions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const handleEarlyCompletion = () => {
    setShowResult(true);
  };

  if (showResult) {
    const incorrectAnswers = mockQuestions.length - correctAnswers;
    return (
      <TestResults
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        totalQuestions={mockQuestions.length}
        onComplete={onComplete}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto w-full"
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient bg-300%">
            {section}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <QuestionDisplay
            question={mockQuestions[currentQuestion]}
            currentQuestion={currentQuestion}
            totalQuestions={mockQuestions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onComplete={handleEarlyCompletion}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestInterface;