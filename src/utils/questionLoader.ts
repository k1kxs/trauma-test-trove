import { QuestionData } from "@/types/questions.types";

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    const content = await response.text();
    
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 5) {
      throw new Error('Invalid question file format');
    }

    return {
      id: `${section}-${questionId}`,
      section,
      question: `Question ${questionId}`, // Temporary placeholder
      image: `/tests/${section}/${questionId}/image.png`,
      options: lines.slice(0, 4),
      correctAnswer: lines[4]
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
  }
};

export const loadQuestions = async (section: string): Promise<QuestionData[]> => {
  // Временно возвращаем моковые данные для демонстрации
  const mockQuestions: QuestionData[] = [
    {
      id: "arms-Q1",
      section: "arms",
      question: "Question 1",
      image: "/placeholder.svg", // Using placeholder image
      options: ["Humerus", "Femur", "Tibia", "Radius"],
      correctAnswer: "A"
    },
    {
      id: "arms-Q2",
      section: "arms",
      question: "Question 2",
      image: "/placeholder.svg", // Using placeholder image
      options: ["Biceps", "Triceps", "Deltoid", "Trapezius"],
      correctAnswer: "A"
    }
  ];

  return mockQuestions.filter(q => q.section === section);
};