import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { QuestionData } from "@/types/questions.types";
import { useState } from "react";
import { ZoomIn, X, ZoomOut, RotateCcw } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
}: QuestionDisplayProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const handleDialogClose = () => {
    setIsImageOpen(false);
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
          <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit={true}
            limitToBounds={false}
            wheel={{ wheelDisabled: false }}
            pinch={{ disabled: false }}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute right-4 top-4 z-50 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomIn()}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <ZoomIn className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomOut()}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <ZoomOut className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => resetTransform()}
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
                <TransformComponent
                  wrapperClass="w-full h-[90vh] cursor-grab active:cursor-grabbing"
                  contentClass="w-full h-full flex items-center justify-center"
                >
                  <motion.img
                    src={question.image || "/placeholder.svg"}
                    alt="Question image"
                    className="max-w-none select-none"
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
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