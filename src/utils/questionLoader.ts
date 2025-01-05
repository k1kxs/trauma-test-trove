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

const fileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
};

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    console.log(`Loading question from section: ${section}, questionId: ${questionId}`);
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    console.log(`Question content for ${section}/${questionId}:`, content);
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 4) {
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

// Функция для подсчета количества вопросов в разделе
const countQuestionsInSection = async (section: string): Promise<number> => {
  let count = 1;
  while (true) {
    try {
      const response = await fetch(`/tests/${section}/Q${count}/question.txt`);
      if (!response.ok) {
        break;
      }
      count++;
    } catch {
      break;
    }
  }
  
  // Вычитаем 1, так как последняя проверка была неуспешной
  const finalCount = count - 1;
  console.log(`Found ${finalCount} questions in section ${section}`);
  return finalCount;
};

// Функция для получения случайного массива индексов
const getRandomIndices = (max: number): number[] => {
  const indices = Array.from({ length: max }, (_, i) => i + 1);
  return indices.sort(() => Math.random() - 0.5);
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  console.log('Loading questions for section:', section);
  
  if (section === null) {
    const allQuestions: QuestionData[] = [];
    
    for (const currentSection of sections) {
      try {
        // Загружаем только Q1 из каждого раздела для общего теста
        const question = await parseQuestionFile(currentSection, 'Q1');
        if (question) {
          allQuestions.push(question);
        }
      } catch (error) {
        console.error(`Failed to load question from section ${currentSection}`);
        continue;
      }
    }
    
    return allQuestions;
  }
  
  // Подсчитываем количество доступных вопросов в разделе
  const questionCount = await countQuestionsInSection(section);
  if (questionCount === 0) {
    console.error(`No questions found in section ${section}`);
    return [];
  }

  // Получаем случайный порядок индексов вопросов
  const randomIndices = getRandomIndices(questionCount);
  const questions: QuestionData[] = [];

  // Загружаем вопросы в случайном порядке
  for (const index of randomIndices) {
    try {
      const questionId = `Q${index}`;
      const question = await parseQuestionFile(section, questionId);
      questions.push(question);
    } catch (error) {
      console.error(`Failed to load ${section}/${index}`);
      continue;
    }
  }
  
  return questions;
};