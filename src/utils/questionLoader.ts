import { QuestionData } from "@/types/questions.types";

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    console.log(`Attempting to load question: /tests/${section}/${questionId}/question.txt`);
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    
    if (!response.ok) {
      console.error(`Failed to load question ${questionId} from section ${section}. Status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    console.log(`Content loaded for ${section}/${questionId}:`, content);
    
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 5) {
      console.error('Invalid question file format:', lines);
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
  console.log(`Starting to load questions for section: ${section}`);
  const questions: QuestionData[] = [];
  let questionNumber = 1;
  let hasMoreQuestions = true;
  
  while (hasMoreQuestions && questionNumber <= 3) { // Добавим ограничение на количество попыток
    try {
      const questionId = `Q${questionNumber}`;
      console.log(`Attempting to load question ${questionId} from section ${section}`);
      const question = await parseQuestionFile(section, questionId);
      questions.push(question);
      questionNumber++;
    } catch (error) {
      console.log(`No more questions found for section ${section} after Q${questionNumber - 1}`);
      hasMoreQuestions = false;
    }
  }

  console.log(`Loaded ${questions.length} questions for section ${section}`);
  return questions;
};