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

// Загрузка текстового файла с кэшированием
const textCache = new Map<string, string>();

const loadTextFile = async (url: string): Promise<string | null> => {
  if (textCache.has(url)) {
    return textCache.get(url)!;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const text = await response.text();
    if (text.includes('<!DOCTYPE html>')) return null;
    textCache.set(url, text);
    return text;
  } catch {
    return null;
  }
};

const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  try {
    const questionPath = `/tests/${section}/${questionId}`;
    const textFileUrl = `${questionPath}/question.txt`;
    const imageFileUrl = `${questionPath}/image.png`;
    
    // Проверяем существование файлов (используя кэш)
    const [textExists, imageExists] = await Promise.all([
      checkFileExists(textFileUrl),
      checkFileExists(imageFileUrl)
    ]);
    
    if (!textExists || !imageExists) {
      return null;
    }
    
    const content = await loadTextFile(textFileUrl);
    if (!content) return null;
    
    const lines = content.trim().split('\n').filter(line => line.trim());
    if (lines.length < 4) return null;

    return {
      id: `${section}-${questionId}`,
      section,
      question: "",
      options: lines.slice(0, 4),
      correctAnswer: lines[4].trim(),
      image: imageFileUrl
    };
  } catch {
    return null;
  }
};

// Загрузка вопросов из секции с параллельной обработкой
const loadAllQuestionsFromSection = async (section: string): Promise<QuestionData[]> => {
  if (questionsCache.has(section)) {
    return questionsCache.get(section)!;
  }

  const questions: QuestionData[] = [];
  const promises: Promise<QuestionData | null>[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const questionId = `Q${i}`;
    promises.push(parseQuestionFile(section, questionId));
  }
  
  const results = await Promise.all(promises);
  questions.push(...results.filter((q): q is QuestionData => q !== null));
  
  questionsCache.set(section, questions);
  return questions;
};

// Предварительная загрузка всех вопросов
let preloadPromise: Promise<void> | null = null;

const preloadAllQuestions = () => {
  if (!preloadPromise) {
    preloadPromise = (async () => {
      const promises = sections.map(section => 
        loadAllQuestionsFromSection(section).catch(() => [])
      );
      await Promise.all(promises);
    })();
  }
  return preloadPromise;
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  await preloadAllQuestions();
  
  if (section === null) {
    const allQuestions = Array.from(questionsCache.values()).flat();
    return shuffleArray(allQuestions);
  }
  
  const questions = questionsCache.get(section) || await loadAllQuestionsFromSection(section);
  return shuffleArray(questions);
};

export { preloadAllQuestions };