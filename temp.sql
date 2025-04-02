-- Limpar categorias existentes
DELETE FROM MedicalLeave;
DELETE FROM MedicalLeaveCategory;

-- Inserir novas categorias
INSERT INTO MedicalLeaveCategory (id, name, description, createdAt, updatedAt)
VALUES 
(UUID(), 'Gripe', 'Afastamento por gripe ou resfriado', NOW(), NOW()),
(UUID(), 'Mal-estar', 'Afastamento por indisposição geral', NOW(), NOW()),
(UUID(), 'Fraturas', 'Afastamento por fraturas ou lesões ósseas', NOW(), NOW()),
(UUID(), 'Cirurgias', 'Afastamento para procedimentos cirúrgicos', NOW(), NOW()),
(UUID(), 'COVID-19', 'Afastamento por COVID-19', NOW(), NOW()); 