import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuestionData } from "@/types/questions.types";
import { useState, useRef, useEffect } from "react";
import { ZoomIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionDisplayProps {
  question: QuestionData;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onComplete: () => void;
}

const QuestionDisplay = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onComplete
}: QuestionDisplayProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleImageClick = () => {
    setIsImageOpen(true);
    setTransform({ scale: 1, x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, transform.scale + delta), 4);
    
    if (imageRef.current && containerRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to image
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate new position to zoom towards mouse
      const scaleChange = newScale - transform.scale;
      const newX = transform.x - (mouseX * scaleChange);
      const newY = transform.y - (mouseY * scaleChange);
      
      setTransform({ scale: newScale, x: newX, y: newY });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isDragging.current) return;

    const dx = e.clientX - lastPointerPosition.current.x;
    const dy = e.clientY - lastPointerPosition.current.y;

    setTransform(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleDialogClose = () => {
    setIsImageOpen(false);
    setTransform({ scale: 1, x: 0, y: 0 });
  };

  if (!question) {
    return <div>Loading question...</div>;
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answerLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      <div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

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
        <img
          src={question.image || "/placeholder.svg"}
          alt="Question image"
          className="w-full h-full object-contain transition-transform group-hover:scale-105"
        />
      </div>

      <Dialog open={isImageOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95">
          <button 
            onClick={handleDialogClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group z-50"
          >
            <X className="w-5 h-5 text-white transition-transform duration-200 group-hover:rotate-90" />
          </button>
          <motion.div 
            ref={containerRef}
            className="relative w-full h-[90vh] flex items-center justify-center cursor-grab"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            initial={false}
          >
            <motion.img
              ref={imageRef}
              src={question.image || "/placeholder.svg"}
              alt="Question image"
              className="w-full h-full select-none"
              style={{ 
                objectFit: transform.scale <= 1 ? 'contain' : 'none',
                transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
                transition: isDragging.current ? 'none' : 'transform 0.2s ease-out'
              }}
              draggable={false}
            />
          </motion.div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswerSelect(answerLetters[index])}
            variant={selectedAnswer === answerLetters[index] ? 
              (answerLetters[index] === question.correctAnswer ? "default" : "destructive") 
              : "outline"
            }
            className={`w-full min-h-[3rem] h-auto whitespace-normal font-medium px-4 py-2 rounded-lg transition-all duration-300
              ${selectedAnswer === null ? 
                'hover:bg-purple-50/50 hover:text-purple-700 hover:border-purple-300 hover:shadow-md' : 
                ''
              }
              ${selectedAnswer === answerLetters[index] ? 
                (answerLetters[index] === question.correctAnswer ? 
                  'bg-green-500 hover:bg-green-600 text-white border-none' : 
                  'bg-red-500 hover:bg-red-600 text-white border-none'
                ) : 
                'bg-gray-50/50 text-gray-700 border-gray-200'
              }
            `}
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;