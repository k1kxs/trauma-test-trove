import { QuestionData } from "@/types/questions.types";

const sections = [
  "arms",
  "brush",
  "forearm",
  "hip",
  "humerus",
  "lungs",
  "pelvis",
  "ribs",
  "shin",
  "spine",
  "foot"
];

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

const getRandomQuestionFromSection = async (section: string): Promise<QuestionData | null> => {
  // В каждом разделе по 3 вопроса (Q1, Q2, Q3)
  const questionIds = ['Q1', 'Q2', 'Q3'];
  const randomIndex = Math.floor(Math.random() * questionIds.length);
  const questionId = questionIds[randomIndex];
  
  try {
    return await parseQuestionFile(section, questionId);
  } catch (error) {
    console.error(`Failed to load question from section ${section}`);
    return null;
  }
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  // Если section равен null, значит это тест по всем разделам
  if (section === null) {
    const allQuestions: QuestionData[] = [];
    
    // Загружаем по одному случайному вопросу из каждого раздела
    for (const currentSection of sections) {
      const question = await getRandomQuestionFromSection(currentSection);
      if (question) {
        allQuestions.push(question);
      }
    }
    
    return allQuestions;
  }
  
  // Если выбран конкретный раздел, загружаем все вопросы из него
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