export interface QuizSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate?: (data: QuizFormData) => Promise<string>  // ✅ now optional
  defaultValues?: QuizFormData
  fetchAllQuizzes: () => void  
  setGeneratedQuizCode?: (code: string) => void
  setIsQuizSuccessModalOpen?: (isOpen: boolean) => void,
   

}

 export interface QuizFormData {
  title: string
  duration: number
  numberOfQuestions: number
  scorePerQuestion: number
  description: string
  scheduleDate: string
  
  scheduleTime: string
  difficultyLevel: string
  categoryType: string
  groupName: string
}

export interface Quiz {
  _id: string
  code: string
  title: string
  description: string
  status: "open" | "closed"
  instructor: string
  group: string
  questions_number: number
  questions: string[]
  schadule: string
  duration: number
  score_per_question: number
  type: string
  difficulty: string
  updatedAt: string
  createdAt: string
  __v: number
  participants: number
}

export interface JoinQuiz {
  code:string
}


export interface UpdatedQuiz{
  title:string
}


export interface QuizSectionProps {
  showTitle?: boolean
  embedded?: boolean
}

export interface ParticipantData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface QuizResult {
  _id: string;
   quiz:Quiz
   participants: Array<{
    _id: string;
    participant: ParticipantData;
    score: number;
    started_at: string;
    finished_at: string;
  }>;
  score: number;
  started_at: string;
  finished_at: string;
}



