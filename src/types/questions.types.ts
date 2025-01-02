export interface QuestionData {
  id: string;
  section: string;
  question: string;
  image: string;
  options: string[];
  correctAnswer: string;
}

export interface Section {
  id: string;
  name: string;
  questions: QuestionData[];
}