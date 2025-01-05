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

// Кэш для хранения результатов проверки существования файлов
const fileExistsCache = new Map<string, boolean>();

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

// Кэш для хранения папок с вопросами
const questionFoldersCache = new Map<string, string[]>();

// Оптимизированная функция получения списка папок с вопросами
const getQuestionFolders = async (section: string): Promise<string[]> => {
  if (questionFoldersCache.has(section)) {
    return questionFoldersCache.get(section)!;
  }

  const folders: string[] = [];
  const maxQuestions = 10; // Ограничиваем количество проверок
  
  const checkPromises = Array.from({ length: maxQuestions }, (_, i) => {
    const folderPath = `/tests/${section}/Q${i + 1}/question.txt`;
    return fileExists(folderPath).then(exists => exists ? `Q${i + 1}` : null);
  });

  const results = await Promise.all(checkPromises);
  folders.push(...results.filter((folder): folder is string => folder !== null));
  
  questionFoldersCache.set(section, folders);
  return folders;
};

// Кэш для хранения загруженных вопросов
const questionCache = new Map<string, QuestionData>();

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
      return null;
    }
    
    const response = await fetch(questionPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 4) {
      return null;
    }

    const questionData: QuestionData = {
      id: cacheKey,
      section,
      question: lines[0],
      options: lines.slice(1, 5),
      correctAnswer: lines[4],
      image: imageExists ? `/tests/${section}/${questionId}/image.png` : "/placeholder.svg"
    };

    questionCache.set(cacheKey, questionData);
    return questionData;
  } catch (error) {
    console.error(`Error loading question ${questionId} from section ${section}:`, error);
    return null;
  }
};

const getRandomQuestionFromSection = async (section: string): Promise<QuestionData | null> => {
  const folders = await getQuestionFolders(section);
  if (folders.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * folders.length);
  const questionId = folders[randomIndex];
  
  return await parseQuestionFile(section, questionId);
};

export const loadQuestions = async (section: string | null): Promise<QuestionData[]> => {
  console.log('Loading questions for section:', section);
  
  if (section === null) {
    const allQuestions: QuestionData[] = [];
    const loadPromises = sections.map(currentSection => 
      getRandomQuestionFromSection(currentSection)
        .then(question => question && allQuestions.push(question))
    );
    
    await Promise.all(loadPromises);
    return allQuestions;
  }
  
  const folders = await getQuestionFolders(section);
  const loadPromises = folders.map(questionId => parseQuestionFile(section, questionId));
  const questions = await Promise.all(loadPromises);
  
  return questions.filter((q): q is QuestionData => q !== null);
};