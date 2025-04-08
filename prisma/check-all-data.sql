-- Verificar templates
SELECT 'Templates' as tabela;
SELECT id, name, description FROM EvaluationTemplate;

-- Verificar funcionários
SELECT 'Funcionários' as tabela;
SELECT id, matricula, name, email, departmentId, positionId FROM Employee;

-- Verificar avaliações
SELECT 'Avaliações' as tabela;
SELECT 
  e.id,
  e.status,
  e.selfEvaluation,
  e.selfEvaluationStatus,
  e.managerEvaluation,
  e.managerEvaluationStatus,
  e.selfScore,
  e.managerScore,
  e.finalScore,
  emp.name as employee_name,
  emp.matricula,
  u.name as evaluator_name
FROM Evaluation e
LEFT JOIN Employee emp ON e.employeeId = emp.id
LEFT JOIN User u ON e.evaluatorId = u.id; 