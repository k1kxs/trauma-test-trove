import { QuestionData } from "@/types/questions.types";

// Кэш для хранения результатов проверки существования файлов
const fileExistsCache = new Map<string, boolean>();

// Кэш для хранения загруженных вопросов
const questionCache = new Map<string, QuestionData>();

// Кэш для хранения папок с вопросами
const questionFoldersCache = new Map<string, string[]>();

// Оптимизированная функция проверки существования файла с кэшированием
const fileExists = async (path: string): Promise<boolean> => {
  if (fileExistsCache.has(path)) {
    return fileExistsCache.get(path)!;
  }

  try {
    const response = await fetch(path, { method: 'HEAD' });
    const exists = response.ok;
    fileExistsCache.set(path, exists);
    return exists;
  } catch {
    fileExistsCache.set(path, false);
    return false;
  }
};

// Оптимизированная функция получения списка папок с вопросами
const getQuestionFolders = async (section: string): Promise<string[]> => {
  if (questionFoldersCache.has(section)) {
    return questionFoldersCache.get(section)!;
  }

  const folders: string[] = [];
  let questionNumber = 1;
  
  while (true) {
    const questionPath = `/tests/${section}/Q${questionNumber}/question.txt`;
    const imagePath = `/tests/${section}/Q${questionNumber}/image.png`;
    
    const [questionExists, imageExists] = await Promise.all([
      fileExists(questionPath),
      fileExists(imagePath)
    ]);
    
    if (!questionExists && !imageExists) {
      break;
    }
    
    folders.push(`Q${questionNumber}`);
    questionNumber++;
  }
  
  questionFoldersCache.set(section, folders);
  console.log(`Found ${folders.length} questions in section ${section}:`, folders);
  return folders;
};

// Оптимизированная функция парсинга файла вопроса с кэшированием
const parseQuestionFile = async (section: string, questionId: string): Promise<QuestionData | null> => {
  const cacheKey = `${section}-${questionId}`;
  
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }

  try {
    const questionPath = `/tests/${section}/${questionId}/question.txt`;
    const imagePath = `/tests/${section}/${questionId}/image.png`;
    
    const [questionExists, imageExists] = await Promise.all([
      fileExists(questionPath),
      fileExists(imagePath)
    ]);
    
    if (!questionExists) {
      console.log(`Question file not found: ${questionPath}`);
      return null;
    }
    
    const response = await fetch(questionPath);
    if (!response.ok) {
      console.log(`Failed to fetch question: ${questionPath}`);
      return null;
    }
    
    const content = await response.text();
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.log(`Invalid question format in ${questionPath}`);
      return null;
    }

    const questionData: QuestionData = {
      id: cacheKey,
      section,
      question: lines[0],
      options: lines.slice(1, -1),
      correctAnswer: lines[lines.length - 1],
      image: imageExists ? imagePath : "/placeholder.svg"
    };

    questionCache.set(cacheKey, questionData);
    return questionData;
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    return null;
  }
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  console.log('Loading questions for section:', section);
  
  if (!section) {
    const sections = [
      "arms", "brush", "forearm", "hip", "humerus", "lungs", 
      "pelvis", "ribs", "shin", "spine", "foot"
    ];
    
    const allQuestions: QuestionData[] = [];
    const loadPromises = sections.map(async currentSection => {
      const folders = await getQuestionFolders(currentSection);
      if (folders.length > 0) {
        const randomIndex = Math.floor(Math.random() * folders.length);
        const question = await parseQuestionFile(currentSection, folders[randomIndex]);
        if (question) allQuestions.push(question);
      }
    });
    
    await Promise.all(loadPromises);
    return allQuestions;
  }
  
  const folders = await getQuestionFolders(section);
  console.log(`Loading ${folders.length} questions from section ${section}`);
  
  const loadPromises = folders.map(questionId => parseQuestionFile(section, questionId));
  const questions = await Promise.all(loadPromises);
  
  return questions.filter((q): q is QuestionData => q !== null);
};