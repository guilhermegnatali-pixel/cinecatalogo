-- Execute este arquivo no banco que você já criou.
-- Mantém as obras, usuários e avaliações existentes.
-- Permite que o MySQL gere o id das próximas obras.
USE catalogo_le5;

SET @checagem_anterior = @@SESSION.foreign_key_checks;
SET SESSION foreign_key_checks = 0;
ALTER TABLE obra MODIFY COLUMN id_obra INT NOT NULL AUTO_INCREMENT;
SET SESSION foreign_key_checks = @checagem_anterior;

SHOW COLUMNS FROM obra LIKE 'id_obra';
SELECT COUNT(*) AS quantidade_obras FROM obra;
