import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface TestSelectionProps {
  onSectionSelect: (section: string) => void;
}

const TestSelection = ({ onSectionSelect }: TestSelectionProps) => {
  const sections = [
    { id: 'forearm', name: 'Предплечье' },
    { id: 'hip', name: 'Бедро' },
    { id: 'humerus', name: 'Плечевая кость' },
    { id: 'lungs', name: 'Лёгкие' },
    { id: 'pelvis', name: 'Таз' },
    { id: 'arms', name: 'Руки' },
    { id: 'brush', name: 'Кисть' },
    { id: 'foot', name: 'Стопа' },
    { id: 'ribs', name: 'Рёбра' },
    { id: 'shin', name: 'Голень' },
    { id: 'spine', name: 'Позвоночник' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            onClick={() => onSectionSelect(section.id)}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800">{section.name}</h3>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TestSelection;