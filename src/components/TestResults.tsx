import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

interface TestResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onComplete: () => void;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    userAnswer?: number;
    image: string;
  }>;
}

const TestResults = ({ 
  correctAnswers,
  totalQuestions, 
  onComplete,
  questions = []
}: TestResultsProps) => {
  const [showErrors, setShowErrors] = useState(false);
  
  const incorrectQuestions = questions.filter(
    (q) => q.userAnswer !== undefined && q.userAnswer !== q.correctAnswer
  );

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
          <div className="text-center space-y-4">
            <p className="text-2xl font-semibold text-gray-800">
              Правильных ответов: {correctAnswers} из {totalQuestions}
            </p>
          </div>

          {showErrors ? (
            <div className="space-y-6">
              {incorrectQuestions.map((q, index) => (
                <div key={q.id} className="p-4 bg-white/50 rounded-lg space-y-4">
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner">
                    <img
                      src={q.image}
                      alt="Тестовое изображение"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-medium text-gray-800">{q.question}</p>
                  <div className="space-y-2">
                    <p className="text-red-600">
                      Ваш ответ: {q.options[q.userAnswer || 0]}
                    </p>
                    <p className="text-green-600">
                      Правильный ответ: {q.options[q.correctAnswer]}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                onClick={() => setShowErrors(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Eye className="w-4 h-4" />
                Скрыть ошибки
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowErrors(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Eye className="w-4 h-4" />
              Посмотреть ошибки
            </Button>
          )}

          <Button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к выбору раздела
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestResults;