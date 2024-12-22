import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TestSelectionProps {
  onSectionSelect: (section: string | null) => void;
}

const TestSelection = ({ onSectionSelect }: TestSelectionProps) => {
  const [showSections, setShowSections] = useState(false);
  
  const sections = [
    "Верхняя конечность",
    "Нижняя конечность",
    "Позвоночник",
    "Таз",
    "Грудная клетка"
  ];

  const handleAllSectionsClick = () => {
    onSectionSelect(null);
  };

  const handleSelectBySectionsClick = () => {
    setShowSections(true);
  };

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
          {!showSections ? (
            <div className="space-y-4">
              <Button 
                onClick={handleAllSectionsClick} 
                className="w-full"
              >
                Пройти тестирование по всем разделам
              </Button>
              <Button 
                onClick={handleSelectBySectionsClick}
                variant="outline" 
                className="w-full"
              >
                Пройти тестирование по отдельным разделам
              </Button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
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
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestSelection;