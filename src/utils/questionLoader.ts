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

// Функция для проверки существования файла
const fileExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Функция для получения списка всех папок с вопросами в разделе
const getQuestionFolders = async (section: string): Promise<string[]> => {
  const folders: string[] = [];
  let i = 1;
  
  while (true) {
    const folderPath = `/tests/${section}/Q${i}/question.txt`;
    const exists = await fileExists(folderPath);
    
    if (!exists) {
      break;
    }
    
    folders.push(`Q${i}`);
    i++;
  }
  
  return folders;
};

export const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  try {
    console.log(`Loading question from section: ${section}, questionId: ${questionId}`);
    
    // Проверяем наличие необходимых файлов
    const questionPath = `/tests/${section}/${questionId}/question.txt`;
    const imagePath = `/tests/${section}/${questionId}/image.png`;
    
    const [questionExists, imageExists] = await Promise.all([
      fileExists(questionPath),
      fileExists(imagePath)
    ]);
    
    if (!questionExists) {
      console.warn(`Question file not found for ${section}/${questionId}`);
      return null;
    }
    
    const response = await fetch(questionPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    console.log(`Question content for ${section}/${questionId}:`, content);
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 4) {
      console.warn(`Invalid question format in ${section}/${questionId}`);
      return null;
    }

    return {
      id: `${section}-${questionId}`,
      section,
      question: lines[0],
      options: lines.slice(1, 5),
      correctAnswer: lines[4],
      image: imageExists ? `/tests/${section}/${questionId}/image.png` : "/placeholder.svg"
    };
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    return null;
  }
};

const getRandomQuestionFromSection = async (section: string): Promise<QuestionData | null> => {
  const folders = await getQuestionFolders(section);
  if (folders.length === 0) {
    console.warn(`No valid questions found in section ${section}`);
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * folders.length);
  const questionId = folders[randomIndex];
  
  return await parseQuestionFile(section, questionId);
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  console.log('Loading questions for section:', section);
  
  // Если section равен null, значит это тест по всем разделам
  if (section === null) {
    const allQuestions: QuestionData[] = [];
    
    // Загружаем по одному случайному вопросу из каждого раздела
    for (const currentSection of sections) {
      const question = await getRandomQuestionFromSection(currentSection);
      if (question) {
        allQuestions.push(question);
      }
    }
    
    return allQuestions;
  }
  
  // Если выбран конкретный раздел, загружаем все доступные вопросы
  const questions: QuestionData[] = [];
  const folders = await getQuestionFolders(section);
  
  for (const questionId of folders) {
    const question = await parseQuestionFile(section, questionId);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
};