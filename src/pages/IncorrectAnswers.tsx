import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Question {
  id: number;
  image: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

const IncorrectAnswers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const incorrectQuestions = location.state?.incorrectQuestions || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 p-6"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>

        <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl">
          <CardHeader className="pb-4 pt-8">
            <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient bg-300%">
              Ошибки в тестировании
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {incorrectQuestions.map((q: Question, index: number) => (
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
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default IncorrectAnswers;