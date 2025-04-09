export interface Question {
  id: string
  text: string
  category: {
    id: string
    name: string
  }
}

export interface Evaluation {
  id: string
  employee: {
    id: string
    name: string
    department: {
      id: string
      name: string
    }
  }
  selfScore: number | null
  managerScore: number | null
  finalScore: number | null
  answers: {
    id: string
    question: Question
    selfScore: number | null
    managerScore: number | null
    selfComment: string | null
    managerComment: string | null
  }[]
}

export interface Template {
  id: string
  name: string
  description: string | null
  questions: Question[]
  evaluations: Evaluation[]
  _count: {
    evaluations: number
  }
  updatedAt: string
} 