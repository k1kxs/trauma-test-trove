import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
        className="max-w-3xl mx-auto w-full"
      >
        <Card className="mt-8 overflow-hidden backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl">
          <CardHeader className="pb-4 pt-8">
            <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient bg-300%">
              Результаты тестирования
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-2xl font-semibold text-gray-800">
                Правильных ответов: {correctAnswers} из {mockQuestions.length}
              </p>
              <p className="text-gray-600">
                {(correctAnswers / mockQuestions.length) * 100}% верных ответов
              </p>
            </div>
            <Button 
              onClick={onComplete} 
              className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 hover:from-purple-700 hover:via-blue-600 hover:to-purple-700 text-white font-medium px-4 py-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border-none"
            >
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
      className="max-w-3xl mx-auto w-full space-y-6"
    >
      <Card className="mt-8 overflow-hidden backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl">
        <CardHeader className="pb-4 pt-8">
          <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient bg-300%">
            {section ? `Раздел: ${section}` : "Общее тестирование"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Прогресс</span>
              <span>Вопрос {currentQuestion + 1} из {mockQuestions.length}</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-100" />
          </div>

          <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner">
            <img
              src={mockQuestions[currentQuestion].image}
              alt="Тестовое изображение"
              className="w-full h-full object-contain p-4"
            />
          </div>

          <div className="space-y-6">
            <p className="text-xl font-medium text-gray-800 text-center">
              {mockQuestions[currentQuestion].question}
            </p>

            <div className="grid gap-3">
              {mockQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  variant={selectedAnswer === index ? 
                    (index === mockQuestions[currentQuestion].correctAnswer ? "default" : "destructive") 
                    : "outline"
                  }
                  className={`w-full min-h-[4rem] h-auto whitespace-normal font-medium px-4 py-4 rounded-lg transition-all duration-300
                    ${selectedAnswer === null ? 
                      'hover:bg-purple-50/50 hover:text-purple-700 hover:border-purple-300 hover:shadow-md' : 
                      ''
                    }
                    ${selectedAnswer === index ? 
                      (index === mockQuestions[currentQuestion].correctAnswer ? 
                        'bg-green-500 hover:bg-green-600 text-white border-none' : 
                        'bg-red-500 hover:bg-red-600 text-white border-none'
                      ) : 
                      'bg-gray-50/50 text-gray-700 border-gray-200'
                    }
                  `}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={onComplete} 
            variant="outline"
            className="w-full min-h-[4rem] h-auto whitespace-normal bg-gray-50/50 hover:bg-red-50/50 text-gray-700 hover:text-red-700 font-medium px-4 py-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-red-300"
          >
            Завершить тестирование
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestInterface;