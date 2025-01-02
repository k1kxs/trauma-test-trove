export interface Question {
  id: number;
  image: string;
  question: string;
  options: string[];
  correctAnswer: number;
  section: string;
}

export interface TestInterfaceProps {
  section: string | null;
  onComplete: () => void;
}