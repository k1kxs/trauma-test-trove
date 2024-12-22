import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TestSelectionProps {
  onSectionSelect: (section: string | null) => void;
}

const TestSelection = ({ onSectionSelect }: TestSelectionProps) => {
  const sections = [
    "Верхняя конечность",
    "Нижняя конечность",
    "Позвоночник",
    "Таз",
    "Грудная клетка"
  ];

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
            Выберите тип тестирования
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => onSectionSelect(null)} 
            className="w-full mb-4"
          >
            Пройти тестирование по всем разделам
          </Button>
          
          <div className="space-y-2">
            {sections.map((section) => (
              <Button
                key={section}
                onClick={() => onSectionSelect(section)}
                variant="outline"
                className="w-full"
              >
                {section}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestSelection;