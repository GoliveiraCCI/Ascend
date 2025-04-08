-- Primeiro, criar um template se não existir
INSERT INTO EvaluationTemplate (id, name, description, createdAt, updatedAt)
SELECT 'template1', 'Avaliação de Desempenho 2024', 'Template padrão de avaliação de desempenho', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM EvaluationTemplate);

-- Inserir avaliações usando os dados existentes
INSERT INTO Evaluation (
  id, employeeId, evaluatorId, templateId, date, 
  status, selfEvaluation, selfEvaluationStatus,
  managerEvaluation, managerEvaluationStatus,
  createdAt, updatedAt
)
SELECT 
  'eval1', 
  (SELECT id FROM Employee WHERE active = true LIMIT 1),
  (SELECT id FROM User WHERE role IN ('ADMIN', 'MANAGER') LIMIT 1),
  (SELECT id FROM EvaluationTemplate LIMIT 1),
  NOW(),
  'Pendente', false, 'Pendente',
  false, 'Pendente',
  NOW(), NOW();

-- Inserir segunda avaliação
INSERT INTO Evaluation (
  id, employeeId, evaluatorId, templateId, date,
  status, selfEvaluation, selfEvaluationStatus,
  selfStrengths, selfImprovements, selfGoals, selfScore, selfEvaluationDate,
  managerEvaluation, managerEvaluationStatus,
  createdAt, updatedAt
)
SELECT 
  'eval2',
  (SELECT id FROM Employee WHERE active = true LIMIT 1 OFFSET 1),
  (SELECT id FROM User WHERE role IN ('ADMIN', 'MANAGER') LIMIT 1),
  (SELECT id FROM EvaluationTemplate LIMIT 1),
  NOW(),
  'Pendente', true, 'Finalizado',
  'Pontos fortes do funcionário', 'Pontos de melhoria', 'Metas estabelecidas', 8.5, NOW(),
  false, 'Pendente',
  NOW(), NOW();

-- Inserir terceira avaliação
INSERT INTO Evaluation (
  id, employeeId, evaluatorId, templateId, date,
  status, selfEvaluation, selfEvaluationStatus,
  selfStrengths, selfImprovements, selfGoals, selfScore, selfEvaluationDate,
  managerEvaluation, managerEvaluationStatus,
  managerStrengths, managerImprovements, managerGoals, managerScore, managerEvaluationDate,
  finalScore,
  createdAt, updatedAt
)
SELECT 
  'eval3',
  (SELECT id FROM Employee WHERE active = true LIMIT 1 OFFSET 2),
  (SELECT id FROM User WHERE role IN ('ADMIN', 'MANAGER') LIMIT 1),
  (SELECT id FROM EvaluationTemplate LIMIT 1),
  NOW(),
  'Finalizado', true, 'Finalizado',
  'Pontos fortes identificados', 'Áreas para desenvolvimento', 'Objetivos definidos', 8.0, NOW(),
  true, 'Finalizado',
  'Pontos fortes observados', 'Oportunidades de melhoria', 'Plano de desenvolvimento', 7.5, NOW(),
  7.75,
  NOW(), NOW(); 