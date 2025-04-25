export interface EvaluationCategory {
  id: string
  name: string
  description?: string
  department?: string
  questions: EvaluationQuestion[]
  createdAt: Date
  updatedAt: Date
}

export interface EvaluationQuestion {
  id: string
  categoryId: string
  category: EvaluationCategory
  text: string
  answers: EvaluationAnswer[]
  createdAt: Date
  updatedAt: Date
}

export interface EvaluationAnswer {
  id: string
  evaluationId: string
  evaluation: Evaluation
  questionId: string
  question: EvaluationQuestion
  selfScore?: number
  managerScore?: number
  selfComment?: string
  managerComment?: string
  createdAt: Date
  updatedAt: Date
}

export interface EvaluationComment {
  id: string
  evaluationId: string
  evaluation: Evaluation
  selfStrengths?: string
  selfImprovements?: string
  selfGoals?: string
  managerStrengths?: string
  managerImprovements?: string
  managerGoals?: string
  createdAt: Date
  updatedAt: Date
}

export interface Evaluation {
  id: string
  employeeId: string
  employee: {
    id: string
    name: string
    email: string
  }
  type: string
  template: string
  deadline: Date
  status: string
  notes?: string
  answers: EvaluationAnswer[]
  comments?: EvaluationComment
  createdAt: Date
  updatedAt: Date
}

export interface EvaluationMetrics {
  selfAverage: number
  managerAverage: number
  scoreDifference: number
}

export type EvaluationStatus = 'Pendente' | 'Finalizado'
export type EvaluationType = 'Anual' | 'Semestral' | 'Mensal'