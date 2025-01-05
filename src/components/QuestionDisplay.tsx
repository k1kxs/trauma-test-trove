import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuestionData } from "@/types/questions.types";
import { useState } from "react";
import { ZoomIn, X } from "lucide-react";

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

  if (!question) {
    return <div>Loading question...</div>;
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answerLetters = ['A', 'B', 'C', 'D'];

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 3);
    setScale(newScale);
  };

  return (
    <div className="space-y-6">
      <div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner group cursor-zoom-in"
           onClick={() => setIsImageOpen(true)}>
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

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/95" onWheel={handleWheel}>
          <button 
            onClick={() => setIsImageOpen(false)}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group z-50"
          >
            <X className="w-5 h-5 text-white transition-transform duration-200 group-hover:rotate-90" />
          </button>
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <img
              src={question.image || "/placeholder.svg"}
              alt="Question image"
              className="max-w-full max-h-full object-contain transition-transform cursor-zoom-in"
              style={{ transform: `scale(${scale})` }}
            />
          </div>
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