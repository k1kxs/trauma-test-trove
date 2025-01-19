import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageDialog from "./ImageDialog";

interface QuestionImageProps {
  image: string;
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionImage = ({ image, currentQuestion, totalQuestions }: QuestionImageProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleImageClick = () => setIsImageOpen(true);
  const handleDialogClose = () => setIsImageOpen(false);

  return (
    <>
      <div 
        className="relative aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner group cursor-zoom-in"
        onClick={handleImageClick}
      >
        <div className="absolute top-3 right-3 bg-black/40 text-white px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-[2px]">
          {currentQuestion + 1}/{totalQuestions}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity">
          <ZoomIn className="w-8 h-8 text-gray-700" />
        </div>
        <AnimatePresence mode="wait">
          <motion.img
            key={image}
            src={image}
            alt="Question image"
            className="w-full h-full object-contain transition-transform group-hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.15,
              ease: "easeInOut"
            }}
          />
        </AnimatePresence>
      </div>

      <ImageDialog 
        isOpen={isImageOpen}
        onClose={handleDialogClose}
        image={image}
      />
    </>
  );
};

export default QuestionImage;