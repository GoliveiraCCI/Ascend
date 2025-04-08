-- Verificar se existe um usuário admin
SELECT 'Usuários existentes' as tabela;
SELECT id, name, email, role FROM User;

-- Criar usuário admin se não existir
INSERT INTO User (id, name, email, role, createdAt, updatedAt)
SELECT 
  'admin1',
  'Administrador',
  'admin@cci.com.br',
  'ADMIN',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM User WHERE role = 'ADMIN'); 