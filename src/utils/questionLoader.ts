import { QuestionData } from "@/types/questions.types";

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    const content = await response.text();
    
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 6) {
      throw new Error('Invalid question file format');
    }

    const question = lines[0].split(' - ')[0];
    const options = lines.slice(1, 5).map(line => line.split(' - ')[0]);
    const correctAnswer = lines[5].split(' - ')[0];

    return {
      id: `${section}-${questionId}`,
      section,
      question,
      image: `/tests/${section}/${questionId}/image.png`,
      options,
      correctAnswer
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
  }
};

export const loadQuestions = async (section: string): Promise<QuestionData[]> => {
  // Временно возвращаем моковые данные для демонстрации
  // В реальном приложении здесь будет логика чтения файлов из папки tests
  const mockQuestions: QuestionData[] = [
    {
      id: "arms-Q1",
      section: "arms",
      question: "What is the bone in your upper arm called?",
      image: "/placeholder.svg",
      options: ["Humerus", "Femur", "Tibia", "Radius"],
      correctAnswer: "A"
    },
    {
      id: "arms-Q2",
      section: "arms",
      question: "Which muscle flexes the elbow?",
      image: "/placeholder.svg",
      options: ["Biceps", "Triceps", "Deltoid", "Trapezius"],
      correctAnswer: "A"
    }
  ];

  return mockQuestions.filter(q => q.section === section);
};