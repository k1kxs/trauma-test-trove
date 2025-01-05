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

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    
    // Проверяем, что контент не является HTML-документом
    if (content.includes('<!DOCTYPE html>')) {
      throw new Error('Invalid question file format');
    }
    
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

// Функция для проверки существования вопроса
const checkQuestionExists = async (section: string, questionNumber: number): Promise<boolean> => {
  try {
    const response = await fetch(`/tests/${section}/Q${questionNumber}/question.txt`);
    const content = await response.text();
    return response.ok && !content.includes('<!DOCTYPE html>');
  } catch {
    return false;
  }
};

// Функция для подсчета количества вопросов в секции
const countQuestionsInSection = async (section: string): Promise<number> => {
  let count = 0;
  const FOLDER_SEARCH_LIMIT = 100; // Максимальное количество папок для поиска

  for (let i = 1; i <= FOLDER_SEARCH_LIMIT; i++) {
    const exists = await checkQuestionExists(section, i);
    if (!exists) break;
    count++;
  }

  console.log(`Found ${count} questions in section ${section}`);
  return count;
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  console.log('Loading questions for section:', section);
  
  if (section === null) {
    // Загружаем по одному случайному вопросу из каждой секции
    const allQuestions: QuestionData[] = [];
    
    for (const currentSection of sections) {
      try {
        const questionCount = await countQuestionsInSection(currentSection);
        if (questionCount > 0) {
          // Выбираем случайный номер вопроса из доступных
          const randomQuestionNumber = Math.floor(Math.random() * questionCount) + 1;
          const question = await parseQuestionFile(currentSection, `Q${randomQuestionNumber}`);
          allQuestions.push(question);
        }
      } catch (error) {
        console.log(`No questions found in section ${currentSection}`);
        continue;
      }
    }
    
    return shuffleArray(allQuestions);
  }
  
  // Загружаем все вопросы из конкретной секции
  const questionCount = await countQuestionsInSection(section);
  if (questionCount === 0) {
    return [];
  }
  
  const questions: QuestionData[] = [];
  
  // Создаем массив номеров вопросов
  const questionNumbers = Array.from({ length: questionCount }, (_, i) => i + 1);
  // Перемешиваем номера вопросов
  const shuffledNumbers = shuffleArray(questionNumbers);
  
  // Загружаем вопросы в случайном порядке
  for (const number of shuffledNumbers) {
    try {
      const question = await parseQuestionFile(section, `Q${number}`);
      questions.push(question);
    } catch (error) {
      console.error(`Failed to load question Q${number} from section ${section}`);
    }
  }
  
  console.log(`Successfully loaded ${questions.length} questions from section ${section}`);
  return questions;
};