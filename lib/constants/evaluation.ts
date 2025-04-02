export const EVALUATION_CATEGORIES = [
  {
    id: 'technical',
    name: 'Habilidades Técnicas',
    description: 'Avaliação das competências técnicas específicas da função'
  },
  {
    id: 'communication',
    name: 'Comunicação',
    description: 'Capacidade de comunicação escrita e verbal'
  },
  {
    id: 'teamwork',
    name: 'Trabalho em Equipe',
    description: 'Colaboração e trabalho eficaz com colegas'
  },
  {
    id: 'leadership',
    name: 'Liderança',
    description: 'Capacidade de liderar e influenciar positivamente'
  },
  {
    id: 'problem_solving',
    name: 'Resolução de Problemas',
    description: 'Capacidade de identificar e resolver problemas'
  },
  {
    id: 'adaptability',
    name: 'Adaptabilidade',
    description: 'Capacidade de se adaptar a mudanças e novos desafios'
  }
]

export const EVALUATION_QUESTIONS = {
  technical: [
    {
      id: 'q1',
      text: 'Demonstra domínio das tecnologias necessárias para sua função',
      category: 'technical'
    },
    {
      id: 'q2',
      text: 'Produz código de qualidade e bem documentado',
      category: 'technical'
    },
    {
      id: 'q3',
      text: 'Resolve problemas técnicos de forma eficiente',
      category: 'technical'
    }
  ],
  communication: [
    {
      id: 'q4',
      text: 'Comunica-se de forma clara e eficaz com a equipe',
      category: 'communication'
    },
    {
      id: 'q5',
      text: 'Apresenta ideias e informações de maneira organizada',
      category: 'communication'
    },
    {
      id: 'q6',
      text: 'Escuta ativamente e responde apropriadamente',
      category: 'communication'
    }
  ],
  teamwork: [
    {
      id: 'q7',
      text: 'Contribui ativamente para o sucesso da equipe',
      category: 'teamwork'
    },
    {
      id: 'q8',
      text: 'Compartilha conhecimento e experiências com colegas',
      category: 'teamwork'
    },
    {
      id: 'q9',
      text: 'Respeita e valoriza as opiniões dos outros',
      category: 'teamwork'
    }
  ],
  leadership: [
    {
      id: 'q10',
      text: 'Assume responsabilidade por suas ações e decisões',
      category: 'leadership'
    },
    {
      id: 'q11',
      text: 'Influencia positivamente o ambiente de trabalho',
      category: 'leadership'
    },
    {
      id: 'q12',
      text: 'Mentora e apoia o desenvolvimento de outros',
      category: 'leadership'
    }
  ],
  problem_solving: [
    {
      id: 'q13',
      text: 'Identifica problemas antes que se tornem críticos',
      category: 'problem_solving'
    },
    {
      id: 'q14',
      text: 'Propõe soluções criativas e efetivas',
      category: 'problem_solving'
    },
    {
      id: 'q15',
      text: 'Analisa situações complexas de forma estruturada',
      category: 'problem_solving'
    }
  ],
  adaptability: [
    {
      id: 'q16',
      text: 'Adapta-se rapidamente a mudanças e novos desafios',
      category: 'adaptability'
    },
    {
      id: 'q17',
      text: 'Mantém-se atualizado com novas tecnologias e tendências',
      category: 'adaptability'
    },
    {
      id: 'q18',
      text: 'Demonstra flexibilidade em diferentes situações',
      category: 'adaptability'
    }
  ]
}

export const SCORE_LABELS = {
  9: { label: 'Excelente', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  8: { label: 'Muito Bom', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
  7: { label: 'Bom', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
  6: { label: 'Satisfatório', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' },
  5: { label: 'Precisa Melhorar', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' }
}

export const getScoreLabel = (score: number | null) => {
  if (score === null) return { label: 'Pendente', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' }
  if (score >= 9) return SCORE_LABELS[9]
  if (score >= 8) return SCORE_LABELS[8]
  if (score >= 7) return SCORE_LABELS[7]
  if (score >= 6) return SCORE_LABELS[6]
  return SCORE_LABELS[5]
} 