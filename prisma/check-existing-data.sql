-- Verificar usuários avaliadores
SELECT 'Avaliadores' as tabela;
SELECT id, name, email FROM User WHERE role = 'ADMIN' OR role = 'MANAGER';

-- Verificar funcionários
SELECT 'Funcionários' as tabela;
SELECT id, name, matricula FROM Employee WHERE active = true;

-- Verificar templates
SELECT 'Templates' as tabela;
SELECT id, name FROM EvaluationTemplate; 