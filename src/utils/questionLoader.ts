import { QuestionData } from "@/types/questions.types";

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 5) {
      throw new Error('Invalid question file format');
    }

    // File structure:
    // Line 1-4: Options
    // Line 5: Correct answer (A, B, C, or D)
    
    return {
      id: `${section}-${questionId}`,
      section,
      question: "", // Empty string since we don't need question text
      options: lines.slice(0, 4),
      correctAnswer: lines[4].trim(),
      image: `/tests/${section}/${questionId}/image.png` // Use actual image path from the question folder
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
  }
};

export const loadQuestions = async (section: string): Promise<QuestionData[]> => {
  const questions: QuestionData[] = [];
  
  // We know there are exactly 3 questions per section
  for (let i = 1; i <= 3; i++) {
    try {
      const questionId = `Q${i}`;
      const question = await parseQuestionFile(section, questionId);
      questions.push(question);
    } catch (error) {
      console.error(`Failed to load Q${i} from section ${section}`);
      break;
    }
  }

  return questions;
};