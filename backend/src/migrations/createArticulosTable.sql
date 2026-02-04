-- Tabla de artículos/productos del menú
CREATE TABLE IF NOT EXISTS articulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    articulo VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) DEFAULT 0,
    costo DECIMAL(10, 2) DEFAULT 0,
    pct_ganancia_pretendida DECIMAL(7, 2) DEFAULT NULL,
    precio_sugerido DECIMAL(10, 2) DEFAULT NULL,
    ganancia_final DECIMAL(10, 2) DEFAULT NULL,
    pct_ganancia_final DECIMAL(7, 2) DEFAULT NULL,
    disponibilidad ENUM('HABILITADO', 'DESHABILITADO') DEFAULT 'HABILITADO',
    fecha_alta_producto DATETIME DEFAULT NULL,
    fecha_actualizacion_costo DATETIME DEFAULT NULL,
    fecha_actualizacion_producto DATETIME DEFAULT NULL,
    tipo_carta VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_disponibilidad (disponibilidad),
    INDEX idx_articulo (articulo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
