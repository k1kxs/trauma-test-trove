import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TestResults from "./TestResults";
import QuestionDisplay from "./QuestionDisplay";

interface TestInterfaceProps {
  section: string | null;
  onComplete: () => void;
}

const mockQuestions = [
  {
    id: 1,
    image: "/placeholder.svg",
    question: "Какой тип перелома изображен на рентгенограмме?",
    options: [
      "Поперечный перелом",
      "Косой перелом",
      "Спиральный перелом",
      "Оскольчатый перелом"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    image: "/placeholder.svg",
    question: "Определите тип вывиха на представленном снимке:",
    options: [
      "Передний вывих",
      "Задний вывих",
      "Нижний вывих",
      "Верхний вывих"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    image: "/placeholder.svg",
    question: "Какой сустав изображен на рентгенограмме?",
    options: [
      "Плечевой сустав",
      "Локтевой сустав",
      "Лучезапястный сустав",
      "Коленный сустав"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    image: "/placeholder.svg",
    question: "Определите патологию на снимке:",
    options: [
      "Артроз",
      "Остеопороз",
      "Остеомиелит",
      "Костная киста"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    image: "/placeholder.svg",
    question: "Какой вид проекции представлен на снимке?",
    options: [
      "Прямая проекция",
      "Боковая проекция",
      "Аксиальная проекция",
      "Косая проекция"
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    image: "/placeholder.svg",
    question: "Определите локализацию перелома:",
    options: [
      "Диафиз",
      "Метафиз",
      "Эпифиз",
      "Апофиз"
    ],
    correctAnswer: 2
  },
  {
    id: 7,
    image: "/placeholder.svg",
    question: "Какой тип костной мозоли формируется на снимке?",
    options: [
      "Периостальная",
      "Эндостальная",
      "Интермедиарная",
      "Параоссальная"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    image: "/placeholder.svg",
    question: "Определите степень смещения отломков:",
    options: [
      "Без смещения",
      "Смещение по ширине",
      "Смещение под углом",
      "Ротационное смещение"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    image: "/placeholder.svg",
    question: "Какая стадия консолидации перелома представлена на снимке?",
    options: [
      "Первая стадия",
      "Вторая стадия",
      "Третья стадия",
      "Четвертая стадия"
    ],
    correctAnswer: 2
  },
  {
    id: 10,
    image: "/placeholder.svg",
    question: "Определите характер перелома по линии излома:",
    options: [
      "Зубчатый",
      "Косой",
      "Винтообразный",
      "Многооскольчатый"
    ],
    correctAnswer: 3
  }
];

const TestInterface = ({ section, onComplete }: TestInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(mockQuestions.length).fill(false));

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
    // Calculate remaining correct answers based on current state
    let totalCorrect = correctAnswers;
    
    // Count only previously recorded correct answers
    // Unanswered questions are automatically marked as incorrect
    setShowResult(true);
  };

  if (showResult) {
    return (
      <TestResults
        correctAnswers={correctAnswers}
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