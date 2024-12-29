export interface QuestionData {
  id: number;
  image: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

async function fetchQuestionDirs(section: string): Promise<string[]> {
  const response = await fetch(`tests/${section}`);
  const data = await response.text();
  const regex = /<a href="([^"]+)">/g;
  const dirs: string[] = [];
  let match;
  while ((match = regex.exec(data)) !== null) {
    if (match[1].startsWith('Q')) {
      dirs.push(match[1]);
    }
  }
  return dirs;
}

async function parseQuestionFile(section: string, dir: string): Promise<QuestionData> {
  const questionText = await fetch(`tests/${section}/${dir}/question.txt`).then(res => res.text());
  const lines = questionText.split("\n");
  
  const correctAnswerLetter = lines[5].trim();
  const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(correctAnswerLetter);

  return {
    id: parseInt(dir.replace('Q', '')),
    image: `tests/${section}/${dir}/image.png`,
    question: lines[0],
    options: [lines[1], lines[2], lines[3], lines[4]],
    correctAnswer: correctAnswerIndex
  };
}

export async function loadQuestionsForSection(section: string): Promise<QuestionData[]> {
  try {
    const dirs = await fetchQuestionDirs(section);
    const questions = await Promise.all(
      dirs.map(dir => parseQuestionFile(section, dir))
    );
    return questions;
  } catch (error) {
    console.error(`Error loading questions for section ${section}:`, error);
    throw error;
  }
}

export function getRandomQuestionFromEachSection(sections: string[]): Promise<QuestionData[]> {
  return Promise.all(
    sections.map(async (section) => {
      const questions = await loadQuestionsForSection(section);
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
    })
  );
}

export const availableSections = [
  "arms",
  "lungs",
  // Add other sections as they become available
];