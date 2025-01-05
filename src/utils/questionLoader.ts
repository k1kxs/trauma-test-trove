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

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData> => {
  try {
    console.log(`Loading question from section: ${section}, questionId: ${questionId}`);
    const response = await fetch(`/tests/${section}/${questionId}/question.txt`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    console.log(`Question content for ${section}/${questionId}:`, content);
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 4) {
      throw new Error('Invalid question file format');
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
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    throw error;
  }
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  console.log('Loading questions for section:', section);
  
  if (section === null) {
    const allQuestions: QuestionData[] = [];
    
    for (const currentSection of sections) {
      try {
        // Try to load Q1 from each section
        const question = await parseQuestionFile(currentSection, 'Q1');
        if (question) {
          allQuestions.push(question);
        }
      } catch (error) {
        console.log(`No questions found in section ${currentSection}`);
        continue;
      }
    }
    
    return allQuestions;
  }
  
  const questions: QuestionData[] = [];
  let questionNumber = 1;
  let maxAttempts = 10; // Максимальное количество попыток загрузки
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const questionId = `Q${questionNumber}`;
      const question = await parseQuestionFile(section, questionId);
      questions.push(question);
      questionNumber++;
      attempts++;
    } catch (error) {
      // Если получаем ошибку 404, значит вопросов больше нет
      console.log(`No more questions found in section ${section} after Q${questionNumber - 1}`);
      break;
    }
  }
  
  if (questions.length === 0) {
    console.log(`No questions found in section ${section}`);
  } else {
    console.log(`Loaded ${questions.length} questions from section ${section}`);
  }
  
  return questions;
};