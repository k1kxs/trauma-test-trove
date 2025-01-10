import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuestionData } from "@/types/questions.types";
import { useState, useRef, useEffect } from "react";
import { ZoomIn, X, ZoomOut, RotateCcw } from "lucide-react";
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
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const handleImageClick = () => {
    setIsImageOpen(true);
    resetZoom();
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate mouse position relative to image center
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Calculate new scale
    const delta = e.deltaY * -0.002;
    const newScale = Math.min(Math.max(0.5, scale + delta), 4);
    
    // Calculate new position to zoom towards mouse
    const scaleFactor = newScale / scale;
    const newPosition = {
      x: position.x + mouseX * (1 - scaleFactor),
      y: position.y + mouseY * (1 - scaleFactor)
    };

    setScale(newScale);
    setPosition(newPosition);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    containerRef.current.style.cursor = 'grabbing';
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastPositionRef.current = position;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    setPosition({
      x: lastPositionRef.current.x + dx,
      y: lastPositionRef.current.y + dy
    });
  };

  const handlePointerUp = () => {
    if (!containerRef.current) return;
    
    setIsDragging(false);
    containerRef.current.style.cursor = 'grab';
  };

  const handleDialogClose = () => {
    setIsImageOpen(false);
    resetZoom();
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
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
          <div className="absolute right-4 top-4 z-50 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <ZoomIn className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <ZoomOut className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetZoom}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <RotateCcw className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDialogClose}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
          
          <motion.div 
            ref={containerRef}
            className="relative w-full h-[90vh] flex items-center justify-center cursor-grab touch-none"
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
              className="select-none"
              style={{
                width: '100%',
                height: '100%',
                objectFit: scale <= 1 ? 'contain' : 'none',
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
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