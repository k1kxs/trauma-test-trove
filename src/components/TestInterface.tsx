import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import TestResults from "./TestResults";
import QuestionDisplay from "./QuestionDisplay";
import { TestInterfaceProps } from "@/types/test.types";
import { Button } from "./ui/button";
import { getRandomQuestionFromEachSection, availableSections, QuestionData } from "@/utils/testLoader";
import { useToast } from "./ui/use-toast";

const TestInterface = ({ section, onComplete }: TestInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const loadedQuestions = section ? 
          await getRandomQuestionFromEachSection([section]) :
          await getRandomQuestionFromEachSection(availableSections);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Ошибка загрузки вопросов",
          description: "Пожалуйста, проверьте подключение к интернету и попробуйте снова",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [section, toast]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!questions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (showResult) {
    const questionsWithUserAnswers = questions.map(q => ({
      ...q,
      userAnswer: userAnswers[questions.indexOf(q)]
    }));

    return (
      <TestResults
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        onComplete={onComplete}
        questions={questionsWithUserAnswers}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Нет доступных вопросов для этого раздела</p>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Ошибка загрузки вопроса</p>
      </div>
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
            question={currentQuestionData}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
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