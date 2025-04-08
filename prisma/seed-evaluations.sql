-- Inserir avaliações em diferentes estados
-- 1. Avaliação Pendente (recém criada)
INSERT INTO Evaluation (
  id, employeeId, evaluatorId, templateId, date, 
  status, selfEvaluation, selfEvaluationStatus,
  managerEvaluation, managerEvaluationStatus,
  createdAt, updatedAt
)
SELECT 
  'eval1', e.id, u.id, t.id, NOW(),
  'Pendente', false, 'Pendente',
  false, 'Pendente',
  NOW(), NOW()
FROM Employee e, User u, EvaluationTemplate t
WHERE e.matricula = '123456' 
AND u.email = 'guilherme.oliveira@cci.com.br'
AND t.id = 'template1'
LIMIT 1;

-- 2. Avaliação com autoavaliação concluída
INSERT INTO Evaluation (
  id, employeeId, evaluatorId, templateId, date,
  status, selfEvaluation, selfEvaluationStatus,
  selfStrengths, selfImprovements, selfGoals, selfScore, selfEvaluationDate,
  managerEvaluation, managerEvaluationStatus,
  createdAt, updatedAt
)
SELECT 
  'eval2', e.id, u.id, t.id, NOW(),
  'Pendente', true, 'Finalizado',
  'Pontos fortes do funcionário', 'Pontos de melhoria', 'Metas estabelecidas', 8.5, NOW(),
  false, 'Pendente',
  NOW(), NOW()
FROM Employee e, User u, EvaluationTemplate t
WHERE e.matricula = '234567'
AND u.email = 'guilherme.oliveira@cci.com.br'
AND t.id = 'template1'
LIMIT 1;

-- 3. Avaliação Finalizada (com autoavaliação e avaliação do gestor)
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
  'eval3', e.id, u.id, t.id, NOW(),
  'Finalizado', true, 'Finalizado',
  'Pontos fortes identificados', 'Áreas para desenvolvimento', 'Objetivos definidos', 8.0, NOW(),
  true, 'Finalizado',
  'Pontos fortes observados', 'Oportunidades de melhoria', 'Plano de desenvolvimento', 7.5, NOW(),
  7.75,
  NOW(), NOW()
FROM Employee e, User u, EvaluationTemplate t
WHERE e.matricula = '345678'
AND u.email = 'guilherme.oliveira@cci.com.br'
AND t.id = 'template1'
LIMIT 1; 