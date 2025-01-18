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

// Глобальный кэш для всех данных
const questionsCache = new Map<string, QuestionData[]>();
const fileExistsCache = new Map<string, boolean>();
const textCache = new Map<string, string>();

// Оптимизированная проверка существования файла
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

// Оптимизированная загрузка текста
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

// Функция для перемешивания массива
const shuffleArray = <T>(array: T[]): T[] => {
  if (array.length <= 1) return array;
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Загрузка одного вопроса с агрессивным кэшированием
const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  const cacheKey = `${section}-${questionId}`;
  const questionPath = `/tests/${section}/${questionId}`;
  const textFileUrl = `${questionPath}/question.txt`;
  const imageFileUrl = `${questionPath}/image.png`;

  try {
    // Параллельная проверка файлов
    const [textExists, imageExists] = await Promise.all([
      checkFileExists(textFileUrl),
      checkFileExists(imageFileUrl)
    ]);

    if (!textExists || !imageExists) return null;

    const content = await loadTextFile(textFileUrl);
    if (!content) return null;

    const lines = content.trim().split('\n').filter(line => line.trim());
    if (lines.length < 4) return null;

    return {
      id: cacheKey,
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

// Предварительная загрузка с единым Promise
let preloadPromise: Promise<void> | null = null;

const preloadAllQuestions = () => {
  if (!preloadPromise) {
    preloadPromise = (async () => {
      const promises = sections.map(section => {
        const sectionPromises = Array.from({ length: 20 }, (_, i) => 
          parseQuestionFile(section, `Q${i + 1}`)
        );
        return Promise.all(sectionPromises)
          .then(results => {
            const validQuestions = results.filter((q): q is QuestionData => q !== null);
            if (validQuestions.length > 0) {
              questionsCache.set(section, validQuestions);
            }
          })
          .catch(() => {});
      });
      await Promise.all(promises);
    })();
  }
  return preloadPromise;
};

// Основная функция загрузки с мгновенным возвратом из кэша
export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  await preloadPromise;

  if (section === null) {
    const allQuestions = Array.from(questionsCache.values()).flat();
    return shuffleArray(allQuestions);
  }

  const cachedQuestions = questionsCache.get(section);
  if (cachedQuestions) {
    return shuffleArray(cachedQuestions);
  }

  const questions: QuestionData[] = [];
  const promises = Array.from({ length: 20 }, (_, i) => 
    parseQuestionFile(section, `Q${i + 1}`)
  );

  const results = await Promise.all(promises);
  questions.push(...results.filter((q): q is QuestionData => q !== null));
  questionsCache.set(section, questions);

  return shuffleArray(questions);
};

export { preloadAllQuestions };