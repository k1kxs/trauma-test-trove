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

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    
    if (!response.ok) {
      console.log(`Question file not found: /tests/${section}/${questionId}/question.txt`);
      return null;
    }
    
    const content = await response.text();
    
    // Проверяем, что контент не является HTML-документом
    if (content.includes('<!DOCTYPE html>')) {
      console.log(`Invalid question file format for: /tests/${section}/${questionId}/question.txt`);
      return null;
    }
    
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 4) {
      console.log(`Invalid question file format (not enough lines) for: /tests/${section}/${questionId}/question.txt`);
      return null;
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
    console.log(`Error loading question ${questionId} from section ${section}:`, error);
    return null;
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
  // Определяем максимальное количество вопросов для каждой секции
  const sectionLimits: { [key: string]: number } = {
    arms: 2,      // Только Q1 и Q2 существуют
    brush: 1,     // Только Q1 существует
    forearm: 3,   // Q1, Q2, Q3 существуют
    hip: 1,       // Только Q1 существует
    humerus: 1,   // Только Q1 существует
    lungs: 2,     // Q1 и Q2 существуют
    pelvis: 3,    // Q1, Q2, Q3 существуют
    ribs: 3,      // Q1, Q2, Q3 существуют
    shin: 3,      // Q1, Q2, Q3 существуют
    spine: 3,     // Q1, Q2, Q3 существуют
    foot: 3       // Q1, Q2, Q3 существуют
  };

  const maxQuestions = sectionLimits[section] || 1;
  let count = 0;

  for (let i = 1; i <= maxQuestions; i++) {
    const exists = await checkQuestionExists(section, i);
    if (exists) {
      count++;
    } else {
      break; // Прекращаем поиск, если не нашли следующий вопрос
    }
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
          if (question) {
            allQuestions.push(question);
          }
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
    console.log(`No questions found in section ${section}`);
    return [];
  }
  
  const questions: QuestionData[] = [];
  const questionNumbers = Array.from({ length: questionCount }, (_, i) => i + 1);
  const shuffledNumbers = shuffleArray(questionNumbers);
  
  for (const number of shuffledNumbers) {
    try {
      const question = await parseQuestionFile(section, `Q${number}`);
      if (question) {
        questions.push(question);
      }
    } catch (error) {
      console.error(`Failed to load question Q${number} from section ${section}`);
      continue;
    }
  }
  
  console.log(`Successfully loaded ${questions.length} questions from section ${section}`);
  return questions;
};