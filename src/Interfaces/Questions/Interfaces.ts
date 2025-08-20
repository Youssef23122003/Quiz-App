export interface UpdatedQuestion {
  answer: "A" | "B" | "C" | "D";
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  difficulty: string;
  hasActions: boolean;
  answer: string;
  points: number;
}
export interface QuestionViewModalProps {
  isOpen: boolean
  onClose: () => void
  question: QuestionData | null 
}

export interface QuestionData {
  title: string
  description: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  answer: "A" | "B" | "C" | "D"
  difficulty: "easy" | "medium" | "hard"
  type: "FE" | "BE" | "DO"
  points:number
}

export interface QuestionSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: QuestionFormData) => Promise<void> | void
}

export interface QuestionFormData {
  title: string
  description: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  answer: "A" | "B" | "C" | "D"
  difficulty: "easy" | "medium" | "hard"
  type: "FE" | "BE" | "DO"
}