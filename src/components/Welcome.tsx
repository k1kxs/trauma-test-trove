import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WelcomeProps {
  userName: string;
  onStartTest: () => void;
}

const Welcome = ({ userName, onStartTest }: WelcomeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Кафедра травматологии ОРГМУ приветствует вас
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-center text-gray-600 text-2xl">
            Добро пожаловать!
          </p>
          <p className="text-center text-gray-600 text-2xl">
            {userName}
          </p>
          <Button 
            onClick={onStartTest} 
            className="w-full"
          >
            Пройти тестирование
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Welcome;