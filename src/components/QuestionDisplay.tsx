import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  image: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuestionDisplayProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
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
  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      <div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner">
        <div className="absolute top-3 right-3 bg-black/40 text-white px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-[2px]">
          {currentQuestion + 1}/{totalQuestions}
        </div>
        <img
          src={question.image}
          alt="Тестовое изображение"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswerSelect(index)}
            variant={selectedAnswer === index ? 
              (index === question.correctAnswer ? "default" : "destructive") 
              : "outline"
            }
            className={`w-full min-h-[3rem] h-auto whitespace-normal font-medium px-4 py-2 rounded-lg transition-all duration-300
              ${selectedAnswer === null ? 
                'hover:bg-purple-50/50 hover:text-purple-700 hover:border-purple-300 hover:shadow-md' : 
                ''
              }
              ${selectedAnswer === index ? 
                (index === question.correctAnswer ? 
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