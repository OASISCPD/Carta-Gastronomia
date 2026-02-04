-- Modificar columnas de porcentajes para soportar valores mayores a 999%
-- DECIMAL(7,2) soporta hasta 99999.99

ALTER TABLE articulos 
  MODIFY COLUMN pct_ganancia_pretendida DECIMAL(7, 2) DEFAULT NULL,
  MODIFY COLUMN pct_ganancia_final DECIMAL(7, 2) DEFAULT NULL;
