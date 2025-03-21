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
    { id: "humerus", name: "Плечо" },
    { id: "forearm", name: "Предплечье" },
    { id: "brush", name: "Кисть" },
    { id: "ribs", name: "Рёбра" },
    { id: "spine", name: "Позвоночник" },
    { id: "pelvis", name: "Таз" },
    { id: "hip", name: "Бедро" },
    { id: "shin", name: "Голень" },
    { id: "foot", name: "Стопа" }
  ];

  const handleAllSectionsClick = () => {
    onSectionSelect(null);
  };

  const handleSelectBySectionsClick = () => {
    setShowSections(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto"
    >
      <Card className="mt-8 overflow-hidden backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl">
        <CardHeader className="pb-4 pt-8">
          <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient bg-300% pb-2">
            Выберите тип тестирования
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {!showSections ? (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <motion.div variants={item}>
                <Button 
                  onClick={handleAllSectionsClick} 
                  className="w-full min-h-[4.5rem] h-auto whitespace-normal bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 hover:from-purple-700 hover:via-blue-600 hover:to-purple-700 text-white font-medium text-lg px-4 py-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border-none"
                >
                  По всем разделам
                </Button>
              </motion.div>
              <motion.div variants={item}>
                <Button 
                  onClick={handleSelectBySectionsClick}
                  variant="outline"
                  className="w-full min-h-[4.5rem] h-auto whitespace-normal bg-gray-50/50 hover:bg-gray-100/50 text-gray-700 font-medium text-lg px-4 py-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200"
                >
                  По отдельным разделам
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {sections.map((section) => (
                <motion.div key={section.id} variants={item}>
                  <Button
                    onClick={() => onSectionSelect(section.id)}
                    variant="outline"
                    className="w-full min-h-[3rem] h-auto whitespace-normal bg-gray-50/50 hover:bg-purple-50/50 text-gray-700 hover:text-purple-700 font-medium px-3 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-purple-300 text-sm"
                  >
                    {section.name}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestSelection;