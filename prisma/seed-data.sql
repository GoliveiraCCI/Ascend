-- Inserir um template de avaliação se não existir
INSERT INTO EvaluationTemplate (id, name, description, createdAt, updatedAt)
SELECT 'template1', 'Avaliação de Desempenho 2024', 'Template padrão de avaliação de desempenho', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM EvaluationTemplate);

-- Inserir um funcionário se não existir
INSERT INTO Employee (id, matricula, name, email, cpf, birthDate, hireDate, departmentId, positionId, active, createdAt, updatedAt)
SELECT 
  'emp1', '123456', 'João Silva', 'joao.silva@empresa.com', '12345678900', 
  '1990-01-01', '2020-01-01', 
  (SELECT id FROM Department LIMIT 1),
  (SELECT id FROM Position LIMIT 1),
  true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM Employee WHERE matricula = '123456');

-- Inserir outro funcionário se não existir
INSERT INTO Employee (id, matricula, name, email, cpf, birthDate, hireDate, departmentId, positionId, active, createdAt, updatedAt)
SELECT 
  'emp2', '234567', 'Maria Santos', 'maria.santos@empresa.com', '98765432100', 
  '1992-05-15', '2021-03-01', 
  (SELECT id FROM Department LIMIT 1),
  (SELECT id FROM Position LIMIT 1),
  true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM Employee WHERE matricula = '234567');

-- Inserir mais um funcionário se não existir
INSERT INTO Employee (id, matricula, name, email, cpf, birthDate, hireDate, departmentId, positionId, active, createdAt, updatedAt)
SELECT 
  'emp3', '345678', 'Pedro Oliveira', 'pedro.oliveira@empresa.com', '45678912300', 
  '1988-11-30', '2019-07-15', 
  (SELECT id FROM Department LIMIT 1),
  (SELECT id FROM Position LIMIT 1),
  true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM Employee WHERE matricula = '345678'); 