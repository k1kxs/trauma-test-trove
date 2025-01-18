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

// Используем Map для кэширования
const questionsCache = new Map<string, QuestionData[]>();
const fileExistsCache = new Map<string, boolean>();
const textCache = new Map<string, string>();

// Оптимизированная проверка существования файла с кэшированием
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

// Оптимизированная загрузка текстового файла с кэшированием
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

// Улучшенная функция перемешивания массива с использованием алгоритма Фишера-Йейтса
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Оптимизированный парсинг файла вопроса
const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  const cacheKey = `${section}-${questionId}`;
  const questionPath = `/tests/${section}/${questionId}`;
  const textFileUrl = `${questionPath}/question.txt`;
  const imageFileUrl = `${questionPath}/image.png`;

  try {
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

let preloadPromise: Promise<void> | null = null;

// Предзагрузка всех вопросов при старте приложения
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

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  await preloadPromise;

  if (section === null) {
    const allQuestions = Array.from(questionsCache.values()).flat();
    return shuffleArray(allQuestions);
  }

  const cachedQuestions = questionsCache.get(section);
  if (cachedQuestions) {
    // Всегда возвращаем новый перемешанный массив, даже если вопросы взяты из кэша
    return shuffleArray([...cachedQuestions]);
  }

  const questions: QuestionData[] = [];
  const promises = Array.from({ length: 20 }, (_, i) => 
    parseQuestionFile(section, `Q${i + 1}`)
  );

  const results = await Promise.all(promises);
  questions.push(...results.filter((q): q is QuestionData => q !== null));
  questionsCache.set(section, questions);

  // Возвращаем перемешанную копию массива
  return shuffleArray([...questions]);
};

export { preloadAllQuestions };