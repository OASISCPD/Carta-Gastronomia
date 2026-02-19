use menu_gastronomia;

-- Tabla de artículos/productos del menú
CREATE TABLE IF NOT EXISTS articulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    articulo VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) DEFAULT 0,
    costo DECIMAL(10, 2) DEFAULT 0,
    pct_ganancia_pretendida DECIMAL(5, 2) DEFAULT NULL,
    precio_sugerido DECIMAL(10, 2) DEFAULT NULL,
    ganancia_final DECIMAL(10, 2) DEFAULT NULL,
    pct_ganancia_final DECIMAL(5, 2) DEFAULT NULL,
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

-- menu_gastronomia.productos definition

CREATE TABLE `productos` (
  `id` varchar(36) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `id_categoria` int NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `precio_venta` decimal(12,2) NOT NULL,
  `costo` decimal(12,2) NOT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Activo',
  `url_image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `permisos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `modulo` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recurso` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accion` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_permisos_codigo` (`codigo`),
  KEY `idx_permisos_modulo` (`modulo`),
  KEY `idx_permisos_recurso_accion` (`recurso`,`accion`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuarios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `celular` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` int NOT NULL,
  `permisos_id` bigint unsigned NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `legajo` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_permisos` (`permisos_id`),
  CONSTRAINT `fk_permisos` FOREIGN KEY (`permisos_id`) REFERENCES `permisos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- menu_gastronomia.categorias_productos definition

CREATE TABLE `categorias_productos` (
  `id` varchar(36) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `display_order` int DEFAULT '0',
  `estado` varchar(20) NOT NULL DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de imágenes de productos subidas a Google Drive
CREATE TABLE IF NOT EXISTS `imagenes_productos` (
  `id`               bigint unsigned   NOT NULL AUTO_INCREMENT,
  `producto_id`      varchar(36)       CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_id`          varchar(255)      NOT NULL,
  `file_name`        varchar(500)      DEFAULT NULL,
  `web_view_link`    varchar(1000)     DEFAULT NULL,
  `web_content_link` varchar(1000)     DEFAULT NULL,
  `direct_link`      varchar(1000)     DEFAULT NULL,
  `created_at`       timestamp         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_imagenes_producto_id` (`producto_id`),
  CONSTRAINT `fk_imagenes_producto`
    FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO permisos
(codigo, nombre, descripcion, modulo, recurso, accion, activo)
VALUES
(
  'OWNER_ALL',
  'Owner',
  'Puede visualizar menus activos e historial de todos los menus',
  'ALL',
  'ALL',
  'ALL',
  1
);

INSERT INTO permisos
(codigo, nombre, descripcion, modulo, recurso, accion, activo)
VALUES
(
  'OPERADOR_MENU_VER',
  'Operador – Ver Menus',
  'Puede visualizar menus activos e historial',
  'MENU',
  'MENU',
  'VER',
  1
);