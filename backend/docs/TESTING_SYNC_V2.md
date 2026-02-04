# Testing Sync V2 - Ejemplos de uso

## 🧪 Test con cURL

### Test 1: Crear nuevo artículo
```bash
curl -X POST http://localhost:3000/api/v1/articulos/sync/row \
  -H "Content-Type: application/json" \
  -d '{
    "sheet": "ARTICULOS",
    "row": 10,
    "data": {
      "CATEGORIA": "BEBIDAS",
      "ARTICULO": "Sprite 500ml",
      "PRECIO": 1400,
      "COSTO": 750,
      "PCT_GANANCIA_PRETENDIDA": 86.67,
      "PRECIO_SUGERIDO": 1400,
      "GANANCIA_FINAL": 650,
      "PCT_GANANCIA_FINAL": 86.67,
      "DISPONIBILIDAD": "HABILITADO",
      "FECHA_ALTA_PRODUCTO": "2024-02-04T10:00:00Z",
      "TIPO_CARTA": "CARTA_PRINCIPAL"
    },
    "uniqueKey": {
      "categoria": "BEBIDAS",
      "articulo": "Sprite 500ml"
    },
    "editedAt": "2024-02-04T10:30:00Z"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "action": "inserted",
  "message": "Artículo creado: BEBIDAS - Sprite 500ml",
  "data": {
    "action": "inserted",
    "id": 45,
    "affectedRows": 1
  }
}
```

### Test 2: Actualizar artículo existente
```bash
curl -X POST http://localhost:3000/api/v1/articulos/sync/row \
  -H "Content-Type: application/json" \
  -d '{
    "sheet": "ARTICULOS",
    "row": 10,
    "data": {
      "CATEGORIA": "BEBIDAS",
      "ARTICULO": "Sprite 500ml",
      "PRECIO": 1600,
      "COSTO": 800,
      "PCT_GANANCIA_PRETENDIDA": 100,
      "PRECIO_SUGERIDO": 1600,
      "GANANCIA_FINAL": 800,
      "PCT_GANANCIA_FINAL": 100,
      "DISPONIBILIDAD": "HABILITADO",
      "FECHA_ACTUALIZACION_PRODUCTO": "2024-02-04T11:00:00Z"
    },
    "uniqueKey": {
      "categoria": "BEBIDAS",
      "articulo": "Sprite 500ml"
    },
    "editedAt": "2024-02-04T11:00:00Z"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "action": "updated",
  "message": "Artículo actualizado: BEBIDAS - Sprite 500ml",
  "data": {
    "action": "updated",
    "id": 45,
    "affectedRows": 1
  }
}
```

### Test 3: Con token de seguridad
```bash
curl -X POST http://localhost:3000/api/v1/articulos/sync/row \
  -H "Content-Type: application/json" \
  -H "x-sync-token: tu-token-secreto" \
  -d '{
    "sheet": "ARTICULOS",
    "row": 10,
    "data": {
      "CATEGORIA": "POSTRES",
      "ARTICULO": "Tiramisu",
      "PRECIO": 2500,
      "COSTO": 1200,
      "DISPONIBILIDAD": "HABILITADO"
    },
    "uniqueKey": {
      "categoria": "POSTRES",
      "articulo": "Tiramisu"
    },
    "editedAt": "2024-02-04T10:30:00Z"
  }'
```

## 🧪 Test con PowerShell

### Test básico
```powershell
$body = @{
    sheet = "ARTICULOS"
    row = 10
    data = @{
        CATEGORIA = "BEBIDAS"
        ARTICULO = "Fanta 500ml"
        PRECIO = 1400
        COSTO = 750
        DISPONIBILIDAD = "HABILITADO"
    }
    uniqueKey = @{
        categoria = "BEBIDAS"
        articulo = "Fanta 500ml"
    }
    editedAt = (Get-Date).ToUniversalTime().ToString("o")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Uri "http://localhost:3000/api/v1/articulos/sync/row" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Con token
```powershell
$headers = @{
    "x-sync-token" = "tu-token-secreto"
}

Invoke-RestMethod `
    -Uri "http://localhost:3000/api/v1/articulos/sync/row" `
    -Method Post `
    -ContentType "application/json" `
    -Headers $headers `
    -Body $body
```

## 🧪 Test desde Postman

### Crear Request
1. **Method:** POST
2. **URL:** `http://localhost:3000/api/v1/articulos/sync/row`
3. **Headers:**
   - `Content-Type: application/json`
   - `x-sync-token: tu-token-secreto` (opcional)

4. **Body (raw JSON):**
```json
{
  "sheet": "ARTICULOS",
  "row": 5,
  "data": {
    "CATEGORIA": "ENTRADAS",
    "ARTICULO": "Empanadas de Carne x3",
    "PRECIO": 1200,
    "COSTO": 600,
    "PCT_GANANCIA_PRETENDIDA": 100,
    "PRECIO_SUGERIDO": 1200,
    "GANANCIA_FINAL": 600,
    "PCT_GANANCIA_FINAL": 100,
    "DISPONIBILIDAD": "HABILITADO",
    "FECHA_ALTA_PRODUCTO": "2024-01-15T10:00:00Z",
    "TIPO_CARTA": "CARTA_PRINCIPAL"
  },
  "uniqueKey": {
    "categoria": "ENTRADAS",
    "articulo": "Empanadas de Carne x3"
  },
  "editedAt": "2024-02-04T10:30:00Z"
}
```

## 🔍 Verificación en Base de Datos

### Verificar que no haya duplicados
```sql
-- Ver si un artículo está duplicado
SELECT * FROM articulos 
WHERE categoria = 'BEBIDAS' 
  AND articulo = 'Sprite 500ml';

-- Contar duplicados
SELECT categoria, articulo, COUNT(*) as count 
FROM articulos 
GROUP BY categoria, articulo 
HAVING count > 1;
```

### Ver últimas actualizaciones
```sql
SELECT 
    id,
    categoria,
    articulo,
    precio,
    fecha_actualizacion_producto
FROM articulos 
ORDER BY fecha_actualizacion_producto DESC 
LIMIT 20;
```

### Comparar UPDATE vs INSERT
```sql
-- Ver artículos recién creados (última hora)
SELECT * FROM articulos 
WHERE fecha_alta_producto >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY fecha_alta_producto DESC;

-- Ver artículos actualizados (última hora)
SELECT * FROM articulos 
WHERE fecha_actualizacion_producto >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
  AND fecha_alta_producto < fecha_actualizacion_producto
ORDER BY fecha_actualizacion_producto DESC;
```

## 🎯 Casos de prueba completos

### Caso 1: Flujo completo (CREATE → UPDATE)
```bash
# 1. Crear artículo nuevo
curl -X POST http://localhost:3000/api/v1/articulos/sync/row \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "CATEGORIA": "TEST",
      "ARTICULO": "Producto Test",
      "PRECIO": 1000,
      "COSTO": 500,
      "DISPONIBILIDAD": "HABILITADO"
    },
    "uniqueKey": {
      "categoria": "TEST",
      "articulo": "Producto Test"
    }
  }'

# Esperar 2 segundos
sleep 2

# 2. Actualizar el mismo artículo
curl -X POST http://localhost:3000/api/v1/articulos/sync/row \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "CATEGORIA": "TEST",
      "ARTICULO": "Producto Test",
      "PRECIO": 1500,
      "COSTO": 600,
      "DISPONIBILIDAD": "HABILITADO"
    },
    "uniqueKey": {
      "categoria": "TEST",
      "articulo": "Producto Test"
    }
  }'

# 3. Verificar en BD (debe haber UN solo registro)
# SELECT * FROM articulos WHERE categoria = 'TEST';
```

### Caso 2: Datos mínimos
```bash
curl -X POST http://localhost:3000/api/v1/articulos/sync/row \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "CATEGORIA": "SIMPLE",
      "ARTICULO": "Artículo Simple"
    },
    "uniqueKey": {
      "categoria": "SIMPLE",
      "articulo": "Artículo Simple"
    }
  }'
```

### Caso 3: Error - Falta uniqueKey
```bash
curl -X POST http://localhost:3000/api/v1/articulos/sync/row \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "CATEGORIA": "TEST",
      "ARTICULO": "Test"
    }
  }'

# Respuesta esperada: 400 Bad Request
```

## 📊 Scripts de análisis

### Ver estadísticas de sync
```sql
-- Artículos creados hoy
SELECT COUNT(*) as nuevos_hoy
FROM articulos 
WHERE DATE(fecha_alta_producto) = CURDATE();

-- Artículos actualizados hoy
SELECT COUNT(*) as actualizados_hoy
FROM articulos 
WHERE DATE(fecha_actualizacion_producto) = CURDATE()
  AND fecha_alta_producto < fecha_actualizacion_producto;

-- Top 10 artículos más actualizados (necesitas agregar un contador)
SELECT categoria, articulo, fecha_actualizacion_producto
FROM articulos 
WHERE fecha_actualizacion_producto IS NOT NULL
ORDER BY fecha_actualizacion_producto DESC
LIMIT 10;
```

## 🐛 Debugging

### Ver logs del backend
```bash
# Si usas PM2
pm2 logs backend --lines 50

# Si usas npm run dev
# Los logs aparecen en la consola directamente
```

### Buscar logs específicos
```bash
# Filtrar logs de SYNC ROW
pm2 logs backend | grep "SYNC ROW"

# Ver solo errores
pm2 logs backend --err
```

### Simular Apps Script localmente
Puedes crear un script Node.js para simular lo que hace Apps Script:

```javascript
// test-sync.js
const https = require('https');

const data = {
  sheet: 'ARTICULOS',
  row: 5,
  data: {
    CATEGORIA: 'TEST_LOCAL',
    ARTICULO: 'Test desde Node',
    PRECIO: 999,
    COSTO: 500,
    DISPONIBILIDAD: 'HABILITADO'
  },
  uniqueKey: {
    categoria: 'TEST_LOCAL',
    articulo: 'Test desde Node'
  },
  editedAt: new Date().toISOString()
};

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/articulos/sync/row',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(data))
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(JSON.stringify(data));
req.end();
```

Ejecutar:
```bash
node test-sync.js
```

## 🔄 Migración del trigger viejo al nuevo

1. **No borres el trigger viejo todavía**
2. Crea el trigger nuevo con el código v2
3. Prueba por 24-48 horas
4. Si todo funciona bien, desactiva el trigger viejo
5. Después de 1 semana, borra el trigger viejo

Para desactivar un trigger en Apps Script:
1. Ir a **Triggers** (⏰)
2. Click en los 3 puntos del trigger viejo
3. **Delete**
