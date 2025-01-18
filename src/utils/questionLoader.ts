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

// Кэш для хранения загруженных вопросов
const questionsCache = new Map<string, QuestionData[]>();

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

const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  try {
    const questionPath = `/tests/${section}/${questionId}`;
    const textFileUrl = `${questionPath}/question.txt`;
    const imageFileUrl = `${questionPath}/image.png`;
    
    // Проверяем существование обоих файлов
    const [textExists, imageExists] = await Promise.all([
      checkFileExists(textFileUrl),
      checkFileExists(imageFileUrl)
    ]);
    
    // Если хотя бы один файл отсутствует, пропускаем этот вопрос
    if (!textExists || !imageExists) {
      console.log(`Пропущен вопрос ${questionId} в секции ${section}: отсутствуют необходимые файлы`);
      return null;
    }
    
    const response = await fetch(textFileUrl);
    
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
      image: imageFileUrl
    };
  } catch (error) {
    console.error(`Ошибка при загрузке вопроса ${questionId} в секции ${section}:`, error);
    return null;
  }
};

// Загрузка вопросов из секции с параллельной обработкой
const loadAllQuestionsFromSection = async (section: string): Promise<QuestionData[]> => {
  // Проверяем кэш
  if (questionsCache.has(section)) {
    return questionsCache.get(section)!;
  }

  const questions: QuestionData[] = [];
  const promises: Promise<QuestionData | null>[] = [];
  
  // Создаем все промисы сразу
  for (let i = 1; i <= 20; i++) {
    const questionId = `Q${i}`;
    promises.push(parseQuestionFile(section, questionId));
  }
  
  // Ждем выполнения всех промисов
  const results = await Promise.all(promises);
  questions.push(...results.filter((q): q is QuestionData => q !== null));
  
  // Сохраняем в кэш
  questionsCache.set(section, questions);
  
  return questions;
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  if (section === null) {
    // Если секция не выбрана, загружаем все секции параллельно
    const promises = sections.map(loadAllQuestionsFromSection);
    const sectionResults = await Promise.all(promises);
    const allQuestions = sectionResults.flat();
    return shuffleArray(allQuestions);
  }
  
  const questions = await loadAllQuestionsFromSection(section);
  return shuffleArray(questions);
};

// Предварительная загрузка всех вопросов
export const preloadAllQuestions = () => {
  sections.forEach(section => {
    loadAllQuestionsFromSection(section).catch(console.error);
  });
};