import { QuestionData } from "@/types/questions.types";

export const parseQuestionFile = (content: string): Partial<QuestionData> => {
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length < 6) {
    throw new Error('Invalid question file format');
  }

  const question = lines[0].split(' - ')[0];
  const options = lines.slice(1, 5).map(line => line.split(' - ')[0]);
  const correctAnswer = lines[5].split(' - ')[0];

  return {
    question,
    options,
    correctAnswer
  };
};

// This is a mock implementation since we can't actually read files in the browser
// In a real implementation, this would be an API call or similar
export const loadQuestions = async (section: string): Promise<QuestionData[]> => {
  // For demonstration, we'll return mock data in the new format
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