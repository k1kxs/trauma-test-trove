import { QuestionData } from "@/types/questions.types";

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    if (!response.ok) {
      throw new Error(`Failed to load question ${questionId} from section ${section}`);
    }
    const content = await response.text();
    
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 5) {
      throw new Error('Invalid question file format');
    }

    return {
      id: `${section}-${questionId}`,
      section,
      question: `Вопрос ${questionId}`,
      options: lines.slice(0, 4),
      correctAnswer: lines[4],
      image: lines[5] || ''
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
  }
};

export const loadQuestions = async (section: string): Promise<QuestionData[]> => {
  const questions: QuestionData[] = [];
  let questionNumber = 1;
  let hasMoreQuestions = true;
  
  while (hasMoreQuestions) {
    try {
      const questionId = `Q${questionNumber}`;
      const question = await parseQuestionFile(section, questionId);
      questions.push(question);
      questionNumber++;
    } catch (error) {
      // Если получили 404 ошибку, значит вопросов больше нет
      hasMoreQuestions = false;
    }
  }

  // Если не найдено ни одного вопроса, возвращаем пустой массив
  return questions;
};