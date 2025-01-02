import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { QuestionData } from "@/types/questions.types";

interface TestResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onComplete: () => void;
  questions: Array<QuestionData & { userAnswer?: string }>;
}

const TestResults = ({ 
  correctAnswers,
  totalQuestions, 
  onComplete,
  questions = []
}: TestResultsProps) => {
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

          <Button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
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