# 🚨 SOLUCIÓN: Trigger no se ejecuta automáticamente

## ❌ Problema
Editaste una celda en Excel y:
- ❌ NO se actualizó la base de datos
- ❌ El endpoint `/sync/row` nunca fue llamado
- ⚠️ Después ejecutaste `/sync` y duplicó el registro

## ✅ Causa
**El trigger `onEditTriggerV2` NO está instalado en Google Sheets**

## 🔧 Solución en 3 Pasos

### Paso 1️⃣: Copiar el código actualizado

1. Abre tu Google Sheet
2. **Extensions** → **Apps Script**
3. Copia TODO el contenido de `AppScript_v2.js` (actualizado)
4. Pega en el editor de Apps Script
5. **Guardar** (Ctrl+S)

### Paso 2️⃣: Ejecutar setup completo

En el editor de Apps Script:

```javascript
// 1. Selecciona la función en el dropdown:
setupCompleteV2

// 2. Click en "Run" (▶️)

// 3. La primera vez te pedirá permisos:
//    - "Review Permissions"
//    - Selecciona tu cuenta de Google
//    - "Advanced" → "Go to [nombre del proyecto] (unsafe)"
//    - "Allow"
```

**Esto hará:**
- ✅ Configurar el SYNC_ENDPOINT (debes editarlo antes)
- ✅ Crear el trigger automáticamente
- ✅ Verificar que todo esté bien

### Paso 3️⃣: Verificar instalación

Ejecuta la función de diagnóstico:

```javascript
// Selecciona en el dropdown:
diagnosticV2

// Click en "Run" (▶️)
```

**Ver logs:**
- Click en **View** → **Logs** (o Ctrl+Enter)
- Deberías ver: `✅ TODO CONFIGURADO CORRECTAMENTE`

---

## 📝 Configuración Manual (antes del Paso 2)

**IMPORTANTE:** Antes de ejecutar `setupCompleteV2()`, edita la URL en el código:

```javascript
function setupPropertiesV2() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // ⚠️ CAMBIAR ESTA URL POR LA REAL
  const ENDPOINT = 'https://tu-backend.com/api/v1/articulos/sync/row';
  //                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                 REEMPLAZAR CON TU URL REAL
  
  scriptProperties.setProperties({
    'SYNC_ENDPOINT': ENDPOINT,
    'SYNC_TOKEN': ''
  });
  
  // ... resto del código
}
```

**Ejemplo con tu dominio:**
```javascript
const ENDPOINT = 'https://mi-servidor.com/api/v1/articulos/sync/row';
// O si estás en localhost para pruebas:
const ENDPOINT = 'http://tu-ip:3000/api/v1/articulos/sync/row';
```

---

## 🧪 Probar que funciona

### 1. Verificar que el trigger está instalado

```javascript
// Ejecutar en Apps Script:
checkTriggerV2()

// Deberías ver en los logs:
// ✅ Trigger instalado correctamente
```

### 2. Editar una celda

1. Ve a tu hoja **ARTICULOS**
2. Edita cualquier celda (precio, costo, etc.)
3. Espera 2-3 segundos

### 3. Ver los logs

**Opción A: Logs en tiempo real**
- En Apps Script: **View** → **Executions**
- Deberías ver una nueva ejecución de `onEditTriggerV2`
- Click para ver los detalles

**Opción B: Logs simples**
- **View** → **Logs** (Ctrl+Enter)
- Busca `[V2] 🔄 onEditTriggerV2 EJECUTADO`

### 4. Verificar en backend

Revisar logs del backend:
```bash
pm2 logs backend | grep "SYNC ROW"
```

Deberías ver:
```
[SYNC ROW] Procesando fila X de hoja ARTICULOS
[SYNC ROW] Resultado: { action: 'updated', ... }
```

### 5. Verificar en BD

```sql
SELECT * FROM articulos 
WHERE categoria = 'TU_CATEGORIA' 
  AND articulo = 'TU_ARTICULO';

-- Debe haber UN SOLO registro con los datos actualizados
```

---

## 🔍 Diagnóstico de Problemas

### ❌ Problema: No se ejecuta el trigger

**Ver executions:**
1. Apps Script → **View** → **Executions**
2. Si NO aparece nada cuando editas → el trigger NO está instalado

**Solución:**
```javascript
// Ejecutar en Apps Script:
createTriggerV2()
```

---

### ❌ Problema: Trigger instalado pero no hace nada

**Ver logs del trigger:**
1. Edita una celda
2. Apps Script → **View** → **Executions**
3. Click en la última ejecución
4. Lee los logs para ver dónde se detiene

**Posibles causas:**

#### Causa 1: Hoja incorrecta
```
[V2] 📄 Hoja editada: MiHoja
[V2] ⏭️ Cambio en otra hoja (MiHoja), ignorando
```

**Solución:** Tu hoja debe llamarse exactamente `ARTICULOS` (en mayúsculas)

#### Causa 2: Sin SYNC_ENDPOINT
```
[V2] ❌ Falta SYNC_ENDPOINT
```

**Solución:**
```javascript
setupPropertiesV2() // Después de editar la URL
```

#### Causa 3: Headers incorrectos
```
[V2] ⚠️ Fila sin CATEGORIA o ARTICULO
```

**Solución:** La primera fila de tu Excel debe tener columnas llamadas:
- `CATEGORIA` (exacto, mayúsculas)
- `ARTICULO` (exacto, mayúsculas)

---

### ❌ Problema: Se ejecuta pero falla el request

**Ver logs:**
```
[V2] 📡 RESPONSE STATUS: 500
[V2] ❌ Error en sync
```

**Posibles causas:**

1. **Backend no está corriendo**
   ```bash
   pm2 status
   # o
   npm run dev
   ```

2. **URL incorrecta**
   - Verificar que la URL sea accesible
   - Si usas localhost, debe ser la IP real, no `localhost`

3. **Error en el backend**
   - Ver logs: `pm2 logs backend`
   - Buscar el error específico

---

## 📋 Checklist Completo

### En Apps Script:
- [ ] Código de `AppScript_v2.js` copiado
- [ ] URL del SYNC_ENDPOINT editada (no `tu-dominio.com`)
- [ ] Función `setupCompleteV2()` ejecutada
- [ ] Permisos otorgados
- [ ] Función `diagnosticV2()` retorna todo OK
- [ ] Función `checkTriggerV2()` retorna `✅ Trigger instalado`

### En Google Sheets:
- [ ] Hoja se llama exactamente `ARTICULOS`
- [ ] Primera fila tiene columnas `CATEGORIA` y `ARTICULO`
- [ ] Al editar una celda, aparece en **Executions**

### En Backend:
- [ ] Servidor corriendo (`pm2 status` o `npm run dev`)
- [ ] Endpoint `/sync/row` existe (verificar compilación)
- [ ] Logs muestran requests entrantes

### En Base de Datos:
- [ ] No hay duplicados después de editar
- [ ] `fecha_actualizacion_producto` se actualiza

---

## 🎯 Funciones Útiles

### Nuevas funciones agregadas:

1. **`setupCompleteV2()`** - Setup todo de una vez
2. **`diagnosticV2()`** - Diagnóstico completo del sistema
3. **`checkTriggerV2()`** - Ver si el trigger está instalado
4. **`createTriggerV2()`** - Crear el trigger manualmente
5. **`deleteTriggerV2()`** - Borrar triggers existentes
6. **`checkPropertiesV2()`** - Ver configuración actual
7. **`testSyncV2()`** - Probar sync manualmente

### Orden de ejecución recomendado:

```javascript
// 1. Configurar todo
setupCompleteV2()

// 2. Verificar que funcionó
diagnosticV2()

// 3. Probar manualmente
testSyncV2()

// 4. Editar una celda real y ver logs
```

---

## 🔧 Troubleshooting Avanzado

### Ver todos los triggers instalados

En Apps Script, ejecuta:
```javascript
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  console.log('Total triggers:', triggers.length);
  triggers.forEach((t, i) => {
    console.log(`Trigger ${i + 1}:`, {
      función: t.getHandlerFunction(),
      tipo: t.getEventType(),
      id: t.getUniqueId()
    });
  });
}
```

### Borrar TODOS los triggers

```javascript
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  console.log('Todos los triggers eliminados');
}
```

### Crear trigger manualmente desde UI

1. Apps Script → **⏰ Triggers** (icono de reloj)
2. **+ Add Trigger**
3. Configurar:
   - **Function:** `onEditTriggerV2`
   - **Event source:** `From spreadsheet`
   - **Event type:** `On edit`
4. **Save**

---

## 📞 Si aún no funciona

1. **Exporta los logs:**
   - Apps Script → View → Executions
   - Copia los logs completos de la última ejecución

2. **Verifica la URL:**
   ```javascript
   checkPropertiesV2()
   // Debe mostrar TU URL real, no "tu-dominio.com"
   ```

3. **Prueba el endpoint manualmente:**
   ```bash
   curl -X POST https://tu-url/api/v1/articulos/sync/row \
     -H "Content-Type: application/json" \
     -d '{"data":{"CATEGORIA":"TEST","ARTICULO":"Test"},"uniqueKey":{"categoria":"TEST","articulo":"Test"}}'
   ```

4. **Revisa que el backend tenga el endpoint compilado:**
   ```bash
   npm run build
   pm2 restart backend
   ```

---

## ✅ Resultado Esperado

Cuando edites una celda:

1. **Apps Script logs:**
   ```
   [V2] 🔄 onEditTriggerV2 EJECUTADO
   [V2] ✅ SYNC_ENDPOINT: https://...
   [V2] 📄 Hoja editada: ARTICULOS
   [V2] 📍 Fila: 5 | Columna: 3
   [V2] ✅ Clave compuesta válida
   [V2] 🚀 Enviando request...
   [V2] 📡 RESPONSE STATUS: 200
   [V2] ✅ SYNC EXITOSO!
   [V2] Action: updated
   ```

2. **Backend logs:**
   ```
   [SYNC ROW] Procesando fila 5 de hoja ARTICULOS
   [SYNC ROW] Resultado: { action: 'updated', id: 42, affectedRows: 1 }
   ```

3. **Base de datos:**
   - ✅ UN solo registro
   - ✅ Datos actualizados
   - ✅ Sin duplicados
