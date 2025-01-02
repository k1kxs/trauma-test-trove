import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import TestResults from "./TestResults";
import QuestionDisplay from "./QuestionDisplay";
import { TestInterfaceProps } from "@/types/test.types";
import { mockQuestions } from "@/data/mockQuestions";
import { Button } from "./ui/button";

const TestInterface = ({ section, onComplete }: TestInterfaceProps) => {
  const filteredQuestions = section 
    ? mockQuestions.filter(q => q.section === section)
    : mockQuestions;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
    
    if (answerIndex === filteredQuestions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < filteredQuestions.length - 1) {
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
    const questionsWithUserAnswers = filteredQuestions.map(q => ({
      ...q,
      userAnswer: userAnswers[filteredQuestions.indexOf(q)]
    }));

    return (
      <TestResults
        correctAnswers={correctAnswers}
        totalQuestions={filteredQuestions.length}
        onComplete={onComplete}
        questions={questionsWithUserAnswers}
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
        <CardContent className="px-8 py-8">
          <QuestionDisplay
            question={filteredQuestions[currentQuestion]}
            currentQuestion={currentQuestion}
            totalQuestions={filteredQuestions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onComplete={handleEarlyCompletion}
          />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-6"
          >
            <Button
              onClick={handleEarlyCompletion}
              className="w-full min-h-[4rem] h-auto whitespace-normal bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-600 hover:via-red-700 hover:to-red-600 text-white font-medium px-4 py-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border-none"
            >
              Завершить тестирование
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestInterface;