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

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      console.log(`Question file not found: /tests/${section}/${questionId}/question.txt`);
      return null;
    }

    const content = await response.text();

    // Проверяем, что контент не является HTML-документом
    if (content.includes('<!DOCTYPE html>')) {
      throw new Error('Invalid question file format');
      console.log(`Invalid question file format for: /tests/${section}/${questionId}/question.txt`);
      return null;
    }

    const lines = content.trim().split('\n').filter(line => line.trim());

    if (lines.length < 4) {
      throw new Error('Invalid question file format');
      console.log(`Invalid question file format (not enough lines) for: /tests/${section}/${questionId}/question.txt`);
      return null;
    }

    return {
@@ -54,8 +57,8 @@
      image: `/tests/${section}/${questionId}/image.png`
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
    console.log(`Error loading question ${questionId} from section ${section}:`, error);
    return null;
  }
};

@@ -102,7 +105,9 @@
          // Выбираем случайный номер вопроса из доступных
          const randomQuestionNumber = Math.floor(Math.random() * questionCount) + 1;
          const question = await parseQuestionFile(currentSection, `Q${randomQuestionNumber}`);
          allQuestions.push(question);
          if (question) {
            allQuestions.push(question);
          }
        }
      } catch (error) {
        console.log(`No questions found in section ${currentSection}`);
@@ -127,12 +132,14 @@
  for (const number of shuffledNumbers) {
    try {
      const question = await parseQuestionFile(section, `Q${number}`);
      questions.push(question);
      if (question) {
        questions.push(question);
      }
    } catch (error) {
      console.error(`Failed to load question Q${number} from section ${section}`);
      continue; // Пропускаем вопрос, если его не удалось загрузить
      continue;
    }
  }

  console.log(`Successfully loaded ${questions.length} questions from section ${section}`);
  return questions;