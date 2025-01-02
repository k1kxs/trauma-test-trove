import { QuestionData } from "@/types/questions.types";

const SECTIONS = [
  'forearm',
  'hip',
  'humerus',
  'lungs',
  'pelvis',
  'arms',
  'brush',
  'foot',
  'ribs',
  'shin',
  'spine'
];

const getRandomQuestionNumber = () => {
  // Each section has up to 3 questions (Q1, Q2, Q3)
  return `Q${Math.floor(Math.random() * 3) + 1}`;
};

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

    return {
      id: `${section}-${questionId}`,
      section,
      question: "", // Empty string since we don't need question text
      options: lines.slice(0, 4),
      correctAnswer: lines[4].trim(),
      image: `/tests/${section}/${questionId}/image.png`
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
  }
};

export const loadQuestions = async (section: string): Promise<QuestionData[]> => {
  if (section === 'comprehensive') {
    // For comprehensive test, get one random question from each section
    const questions: QuestionData[] = [];
    
    for (const currentSection of SECTIONS) {
      try {
        const questionId = getRandomQuestionNumber();
        const question = await parseQuestionFile(currentSection, questionId);
        questions.push(question);
      } catch (error) {
        console.error(`Failed to load question from section ${currentSection}`);
        // Continue with other sections even if one fails
        continue;
      }
    }
    
    return questions;
  }
  
  // Regular section-specific test loading (keeping existing functionality)
  const questions: QuestionData[] = [];
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
