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

// Функция для проверки существования файла
const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
};

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    
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

// Параллельная загрузка вопросов из секции
const loadAllQuestionsFromSection = async (section: string): Promise<QuestionData[]> => {
  const questions: QuestionData[] = [];
  const questionPromises: Promise<QuestionData | null>[] = [];
  
  // Сначала проверяем, какие вопросы существуют
  for (let i = 1; i <= 20; i++) {
    const questionId = `Q${i}`;
    const fileUrl = `/tests/${section}/${questionId}/question.txt`;
    
    // Если файл существует, добавляем его в список для загрузки
    if (await checkFileExists(fileUrl)) {
      questionPromises.push(parseQuestionFile(section, questionId));
    }
  }
  
  // Загружаем все существующие вопросы параллельно
  const results = await Promise.all(questionPromises);
  
  // Фильтруем успешно загруженные вопросы
  return results.filter((q): q is QuestionData => q !== null);
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  console.log('Loading questions for section:', section);
  
  if (section === null) {
    // Параллельная загрузка вопросов из всех секций
    const sectionPromises = sections.map(loadAllQuestionsFromSection);
    const sectionResults = await Promise.all(sectionPromises);
    
    // Объединяем все вопросы в один массив
    const allQuestions = sectionResults.flat();
    
    return shuffleArray(allQuestions);
  }
  
  // Загрузка вопросов из конкретной секции
  const questions = await loadAllQuestionsFromSection(section);
  return shuffleArray(questions);
};