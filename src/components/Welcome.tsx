import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card className="mt-8 overflow-hidden bg-gradient-to-br from-white to-gray-50 border-none shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 text-3xl">
              Добро пожаловать!
            </p>
            <p className="text-center text-gray-700 text-2xl font-medium">
              {userName}
            </p>
          </div>
          <Button 
            onClick={onStartTest} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Пройти тестирование
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Welcome;