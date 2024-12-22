import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TestInterfaceProps {
  section: string | null;
  onComplete: () => void;
}

// Моковые данные для демонстрации
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
  // Добавьте больше вопросов здесь
];

const TestInterface = ({ section, onComplete }: TestInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
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

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Результаты тестирования
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-lg">
              Правильных ответов: {correctAnswers} из {mockQuestions.length}
            </p>
            <Button onClick={onComplete} className="w-full">
              Завершить
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            {section ? `Раздел: ${section}` : "Общее тестирование"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 text-center">
              Вопрос {currentQuestion + 1} из {mockQuestions.length}
            </p>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={mockQuestions[currentQuestion].image}
              alt="Тестовое изображение"
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-center font-medium">
            {mockQuestions[currentQuestion].question}
          </p>

          <div className="space-y-2">
            {mockQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                variant={selectedAnswer === index ? 
                  (index === mockQuestions[currentQuestion].correctAnswer ? "default" : "destructive") 
                  : "outline"
                }
                className="w-full"
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>

          <Button 
            onClick={onComplete} 
            variant="outline" 
            className="w-full"
          >
            Завершить тестирование
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestInterface;