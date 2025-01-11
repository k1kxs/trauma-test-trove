import { QuestionData } from "@/types/questions.types";

const sections = [
  "brush",
  "forearm",
  "hip",
  "humerus",
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

// Кэш для хранения результатов проверки существования файлов
const fileExistsCache = new Map<string, boolean>();

const checkFileExists = async (url: string): Promise<boolean> => {
  if (fileExistsCache.has(url)) {
    return fileExistsCache.get(url)!;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const exists = response.ok;
    fileExistsCache.set(url, exists);
    return exists;
  } catch {
    fileExistsCache.set(url, false);
    return false;
  }
};

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  try {
    const fileUrl = `/tests/${section}/${questionId}/question.txt`;
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const content = await response.text();
    
    if (content.includes('<!DOCTYPE html>')) {
      return null;
    }
    
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 4) {
      return null;
    }

    return {
      id: `${section}-${questionId}`,
      section,
      question: "",
      options: lines.slice(0, 4),
      correctAnswer: lines[4].trim(),
      image: `/tests/${section}/${questionId}/image.png`
    };
  } catch {
    return null;
  }
};

// Загрузка вопросов из секции с ограничением параллельных запросов
const loadAllQuestionsFromSection = async (section: string): Promise<QuestionData[]> => {
  const questions: QuestionData[] = [];
  const batchSize = 5; // Загружаем по 5 вопросов одновременно
  
  for (let i = 1; i <= 20; i += batchSize) {
    const batch = [];
    
    // Формируем батч запросов
    for (let j = 0; j < batchSize && (i + j) <= 20; j++) {
      const questionId = `Q${i + j}`;
      const fileUrl = `/tests/${section}/${questionId}/question.txt`;
      
      if (await checkFileExists(fileUrl)) {
        batch.push(parseQuestionFile(section, questionId));
      }
    }
    
    // Загружаем батч параллельно
    const results = await Promise.all(batch);
    questions.push(...results.filter((q): q is QuestionData => q !== null));
  }
  
  return questions;
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  if (section === null) {
    // Загружаем вопросы из всех секций последовательно
    const allQuestions: QuestionData[] = [];
    
    for (const currentSection of sections) {
      const sectionQuestions = await loadAllQuestionsFromSection(currentSection);
      allQuestions.push(...sectionQuestions);
    }
    
    return shuffleArray(allQuestions);
  }
  
  const questions = await loadAllQuestionsFromSection(section);
  return shuffleArray(questions);
};