import { QuestionData } from "@/types/questions.types";

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
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
      image: lines[5] || '' // На случай, если URL изображения отсутствует
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
  }
};

export const loadQuestions = async (section: string): Promise<QuestionData[]> => {
  try {
    // Загружаем первый вопрос (Q1) для выбранной секции
    const question = await parseQuestionFile(section, 'Q1');
    return [question];
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
};