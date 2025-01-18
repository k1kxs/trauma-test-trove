import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TestResults from "./TestResults";
import QuestionDisplay from "./QuestionDisplay";
import { TestInterfaceProps } from "@/types/test.types";
import { loadQuestions, preloadAllQuestions } from "@/utils/questionLoader";
import { useQuery } from "@tanstack/react-query";

const TestInterface = ({ section, onComplete }: TestInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [queryKey, setQueryKey] = useState([0]); // Добавляем ключ для принудительного обновления запроса

  useEffect(() => {
    preloadAllQuestions();
  }, []);

  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['questions', section, ...queryKey], // Добавляем queryKey в зависимости
    queryFn: () => loadQuestions(section),
    staleTime: 0, // Отключаем кэширование на уровне React Query
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Загрузка вопросов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Произошла ошибка при загрузке вопросов. Пожалуйста, попробуйте позже.
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center text-gray-600 p-4">
        Вопросы не найдены для данного раздела.
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: string) => {
    setSelectedAnswer(answerIndex);
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answerIndex
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

  const handleRestartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setShowResult(false);
    setUserAnswers({});
    setQueryKey(prev => [prev[0] + 1]); // Обновляем ключ для получения нового набора вопросов
  };

  if (showResult) {
    const questionsWithUserAnswers = questions.map(q => ({
      ...q,
      userAnswer: userAnswers[q.id]
    }));

    return (
      <TestResults
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        onComplete={onComplete}
        questions={questionsWithUserAnswers}
        onRestart={handleRestartTest} // Добавляем обработчик перезапуска
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
            question={questions[currentQuestion]}
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