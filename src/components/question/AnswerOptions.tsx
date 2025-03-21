import { Button } from "@/components/ui/button";

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  onAnswerSelect: (answer: string) => void;
}

const AnswerOptions = ({ 
  options, 
  selectedAnswer, 
  correctAnswer, 
  onAnswerSelect 
}: AnswerOptionsProps) => {
  const answerLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid gap-3">
      {options.map((option, index) => {
        const currentLetter = answerLetters[index];
        const isSelected = selectedAnswer === currentLetter;
        const isCorrect = currentLetter === correctAnswer;
        
        return (
          <Button
            key={index}
            onClick={() => onAnswerSelect(currentLetter)}
            variant={isSelected ? 
              (isCorrect ? "default" : "destructive") 
              : "outline"
            }
            className={`w-full min-h-[3rem] h-auto whitespace-normal font-medium px-4 py-2 rounded-lg transition-all duration-300
              ${selectedAnswer === null ? 
                'hover:bg-purple-50/50 hover:text-purple-700 hover:border-purple-300 hover:shadow-md' : 
                ''
              }
              ${selectedAnswer !== null ? 
                (isCorrect ? 
                  'bg-green-500 hover:bg-green-600 text-white border-none' : 
                  isSelected ?
                    'bg-red-500 hover:bg-red-600 text-white border-none' :
                    'bg-gray-50/50 text-gray-700 border-gray-200'
                ) : 
                'bg-gray-50/50 text-gray-700 border-gray-200'
              }
            `}
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
};

export default AnswerOptions;