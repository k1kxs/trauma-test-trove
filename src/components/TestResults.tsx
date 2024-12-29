import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TestResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onComplete: () => void;
}

const TestResults = ({ correctAnswers, totalQuestions, onComplete }: TestResultsProps) => {
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
              Правильных ответов: {correctAnswers} из {totalQuestions}
            </p>
            <p className="text-gray-600">
              {(correctAnswers / totalQuestions) * 100}% верных ответов
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestResults;