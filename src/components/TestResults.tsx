import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { QuestionData } from "@/types/questions.types";
import { saveTestResult } from "@/utils/storage";
import { getUserData } from "@/utils/storage";
import { toast } from "@/components/ui/use-toast";

interface TestResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onComplete: () => void;
  onRestart: () => void;
  questions: Array<QuestionData & { userAnswer?: string }>;
}

const TestResults = ({ 
  correctAnswers,
  totalQuestions, 
  onComplete,
  onRestart,
  questions = []
}: TestResultsProps) => {
  const handleSaveResults = () => {
    const userData = getUserData();
    if (userData) {
      const result = {
        fullName: userData.fullName,
        groupNumber: userData.groupNumber,
        section: questions[0]?.section || "Неизвестный раздел",
        correctAnswers,
        totalQuestions,
        date: new Date().toISOString()
      };
      saveTestResult(result);
      toast({
        title: "Результаты сохранены",
        description: `Правильных ответов: ${correctAnswers} из ${totalQuestions}`,
      });
    }
  };

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
              Правильных ответов:
              <br />
              {correctAnswers} из {totalQuestions}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={() => {
                handleSaveResults();
                onComplete();
              }}
              size="lg"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-14 text-base"
            >
              <ArrowLeft className="w-5 h-5" />
              Вернуться к выбору раздела
            </Button>

            <Button
              onClick={onRestart}
              size="lg"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white h-14 text-base"
            >
              <RotateCcw className="w-5 h-5" />
              Пройти тест заново
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestResults;