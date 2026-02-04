# Sincronización V2 - Google Sheets ↔️ Backend

## 📋 Problema Original

Tu Excel no tiene columna `ID`, por lo que:
- ✅ Agregar nueva fila → funciona
- ❌ Editar celda existente → duplica registro en lugar de actualizar

## 💡 Solución V2

Usamos **clave compuesta única**: `(CATEGORIA + ARTICULO)`

- Si existe ese par → **UPDATE**
- Si no existe → **INSERT**

## 🚀 Implementación

### 1️⃣ Backend (YA IMPLEMENTADO)

#### Nuevo Endpoint
```
POST /api/v1/articulos/sync/row
```

**Payload:**
```json
{
  "sheet": "ARTICULOS",
  "row": 5,
  "data": {
    "CATEGORIA": "BEBIDAS",
    "ARTICULO": "Coca Cola 500ml",
    "PRECIO": 1500,
    "COSTO": 800,
    ...
  },
  "uniqueKey": {
    "categoria": "BEBIDAS",
    "articulo": "Coca Cola 500ml"
  },
  "editedAt": "2024-02-04T10:30:00Z"
}
```

**Respuesta:**
```json
{
  "success": true,
  "action": "updated",  // o "inserted"
  "message": "Artículo actualizado: BEBIDAS - Coca Cola 500ml",
  "data": {
    "action": "updated",
    "id": 42,
    "affectedRows": 1
  }
}
```

#### Nuevo Servicio
- `upsertArticuloByKeyService(categoria, articulo, data)`
  - Busca por `categoria` + `articulo`
  - Si existe → UPDATE con los nuevos datos
  - Si no existe → INSERT nuevo registro

### 2️⃣ Apps Script V2

**Archivo:** `AppScript_v2.js`

**Características:**
- ✅ Detecta ediciones en tiempo real
- ✅ Envía clave compuesta `(categoria + articulo)`
- ✅ El backend decide UPDATE vs INSERT
- ✅ Manejo de errores mejorado
- ✅ Logging detallado

**Diferencias vs V1:**

| Característica | V1 | V2 |
|----------------|----|----|
| Identificación | Solo envía fila | Envía clave compuesta |
| Backend | Siempre INSERT | Upsert inteligente |
| Duplicados | ❌ Sí | ✅ No |
| Estructura | Arrays separados | Objeto mapeado |

## 📝 Setup - Apps Script

### Paso 1: Copiar código
1. Abre tu Google Sheet
2. **Extensions** > **Apps Script**
3. Crea nuevo archivo: `Sync_v2.gs`
4. Copia el contenido de `AppScript_v2.js`

### Paso 2: Configurar propiedades

Ejecuta la función `setupPropertiesV2()` desde el editor:

```javascript
function setupPropertiesV2() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  scriptProperties.setProperties({
    'SYNC_ENDPOINT': 'https://tu-backend.com/api/v1/articulos/sync/row',
    'SYNC_TOKEN': 'tu-token-opcional'  // Dejar vacío si no usas
  });
}
```

### Paso 3: Crear trigger
1. En Apps Script, click en **⏰ (Triggers/Activadores)**
2. Click **+ Add Trigger**
3. Configurar:
   - Function: `onEditTriggerV2`
   - Event source: `From spreadsheet`
   - Event type: `On edit`
4. Guardar

### Paso 4: Probar

Ejecuta `testSyncV2()` para simular una edición:
```javascript
function testSyncV2() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ARTICULOS');
  const mockEvent = {
    range: sheet.getRange(2, 1, 1, 1) // Fila 2
  };
  onEditTriggerV2(mockEvent);
}
```

Revisa los logs: **View** > **Logs** (Ctrl+Enter)

## 🧪 Testing

### Test 1: Nuevo artículo
1. Agrega nueva fila en Excel:
   ```
   CATEGORIA: POSTRES
   ARTICULO: Flan Casero
   PRECIO: 800
   ```
2. ✅ Esperado: INSERT nuevo registro

### Test 2: Editar artículo existente
1. Cambia el precio de "Flan Casero" de 800 a 900
2. ✅ Esperado: UPDATE del registro existente (NO duplicar)

### Test 3: Cambiar nombre de artículo
1. Cambia "Flan Casero" → "Flan con Dulce de Leche"
2. ⚠️ Esperado: INSERT nuevo registro (porque cambió la clave única)
3. 💡 Solución: Borrar el registro anterior manualmente si fue un error

## 🔍 Verificación en BD

```sql
-- Ver si hay duplicados por artículo
SELECT articulo, COUNT(*) as count 
FROM articulos 
GROUP BY articulo 
HAVING count > 1;

-- Ver artículos de una categoría
SELECT * FROM articulos 
WHERE categoria = 'BEBIDAS' 
ORDER BY articulo;

-- Ver última actualización
SELECT * FROM articulos 
ORDER BY fecha_actualizacion_producto DESC 
LIMIT 10;
```

## 🚨 Casos Edge

### ¿Qué pasa si cambio CATEGORIA o ARTICULO?
- Se considera un artículo diferente
- Se creará un nuevo registro
- El anterior queda sin cambios
- **Solución:** Borrar el registro viejo manualmente

### ¿Qué pasa si borro una fila en Excel?
- El registro en BD **NO se borra** automáticamente
- Apps Script no detecta eliminaciones (solo ediciones)
- **Solución:** Cambiar `DISPONIBILIDAD` a `DESHABILITADO` o usar sync completo

### ¿Cómo hago sync completo?
- Usa el endpoint original: `POST /api/v1/articulos/sync`
- Descarga toda la hoja y hace bulk upsert
- Útil para resetear todo

## 📊 Comparativa

### Endpoint `/sync` (completo)
- ✅ Sincroniza toda la hoja
- ✅ Útil para resetear
- ❌ Más lento
- ❌ Solo manual o cron

### Endpoint `/sync/row` (tiempo real)
- ✅ Sincroniza fila individual
- ✅ Tiempo real (on edit)
- ✅ Rápido
- ✅ UPDATE inteligente
- ❌ Solo para ediciones

## 🔐 Seguridad (Opcional)

Si quieres proteger el endpoint:

1. Genera un token:
```bash
openssl rand -hex 32
```

2. Configúralo en Apps Script:
```javascript
'SYNC_TOKEN': 'tu-token-generado'
```

3. Agregar middleware en backend:
```typescript
// middleware/sync.middleware.ts
export function validateSyncToken(req, res, next) {
  const token = req.headers['x-sync-token'];
  if (token !== process.env.SYNC_TOKEN) {
    return res.status(401).json({ error: 'Invalid sync token' });
  }
  next();
}

// routes/articulos.routes.ts
router.post('/sync/row', validateSyncToken, syncArticuloRow);
```

## 🐛 Debugging

### Ver logs en Apps Script
1. **View** > **Logs** (Ctrl+Enter)
2. Buscar `[V2]` para ver logs de la versión 2

### Ver logs en backend
```bash
# Producción
pm2 logs

# Desarrollo
npm run dev
```

### Payload de ejemplo para Postman
```json
{
  "sheet": "ARTICULOS",
  "row": 3,
  "data": {
    "CATEGORIA": "BEBIDAS",
    "ARTICULO": "Coca Cola 500ml",
    "PRECIO": 1500,
    "COSTO": 800,
    "PCT_GANANCIA_PRETENDIDA": 87.5,
    "PRECIO_SUGERIDO": 1500,
    "GANANCIA_FINAL": 700,
    "PCT_GANANCIA_FINAL": 87.5,
    "DISPONIBILIDAD": "HABILITADO",
    "FECHA_ALTA_PRODUCTO": "2024-01-15T10:00:00Z",
    "FECHA_ACTUALIZACION_COSTO": "2024-02-01T15:30:00Z",
    "FECHA_ACTUALIZACION_PRODUCTO": "2024-02-04T10:30:00Z",
    "TIPO_CARTA": "CARTA_PRINCIPAL"
  },
  "uniqueKey": {
    "categoria": "BEBIDAS",
    "articulo": "Coca Cola 500ml"
  },
  "editedAt": "2024-02-04T10:30:00Z"
}
```

## ✅ Checklist de migración

- [ ] Backup de la base de datos actual
- [ ] Verificar que no hay duplicados actuales
- [ ] Copiar `AppScript_v2.js` a Google Sheets
- [ ] Ejecutar `setupPropertiesV2()` con tus URLs
- [ ] Crear trigger `onEditTriggerV2` → On edit
- [ ] Probar con `testSyncV2()`
- [ ] Editar una celda manualmente y verificar logs
- [ ] Verificar en BD que no se duplicó
- [ ] Desactivar trigger viejo (v1) si existe
- [ ] Monitorear por 24h

## 📞 Soporte

Si algo falla:
1. Revisar logs de Apps Script
2. Revisar logs del backend
3. Verificar que el endpoint está correcto
4. Verificar que la estructura de la hoja coincide con los headers esperados

---

**Nota:** Esta es una solución incremental. Puedes mantener ambas versiones (v1 y v2) y migrar gradualmente.
