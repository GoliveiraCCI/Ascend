-- Verificar funcionários
SELECT id, matricula, name FROM Employee;

-- Verificar usuários
SELECT id, email FROM User;

-- Verificar templates
SELECT id, name FROM EvaluationTemplate;

-- Verificar departamentos
SELECT id, name, code FROM department;

-- Verificar cargos
SELECT p.id, p.title, d.name as department_name 
FROM position p
JOIN department d ON p.departmentId = d.id;

-- Verificar níveis de cargo
SELECT pl.id, pl.name, p.title as position_title, d.name as department_name
FROM positionlevel pl
JOIN position p ON pl.positionId = p.id
JOIN department d ON p.departmentId = d.id;

-- Verificar turnos
SELECT id, name FROM shift; 