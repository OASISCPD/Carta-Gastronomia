# ⚠️ Limitaciones y Comportamiento del Sync V2

## 🎯 Cómo Funciona el Sistema

### ✅ Casos que funcionan correctamente

#### 1. Editar campos que NO son clave (PRECIO, COSTO, etc.)
```
Excel ANTES:
  CATEGORIA: BEBIDAS
  ARTICULO: Coca Cola
  PRECIO: 1500  ← Editas esto

Excel DESPUÉS:
  CATEGORIA: BEBIDAS
  ARTICULO: Coca Cola
  PRECIO: 1800  ← Nuevo valor

Apps Script envía:
  uniqueKey: { categoria: "BEBIDAS", articulo: "Coca Cola" }
  
Backend:
  ✅ Busca por "BEBIDAS" + "Coca Cola"
  ✅ Encuentra el registro
  ✅ UPDATE del precio a 1800
```

**Resultado:** ✅ Funciona perfecto, actualiza el registro existente

---

#### 2. Agregar fila nueva
```
Excel:
  [Nueva fila 241]
  CATEGORIA: POSTRES
  ARTICULO: Tiramisu
  PRECIO: 2500

Apps Script envía:
  uniqueKey: { categoria: "POSTRES", articulo: "Tiramisu" }
  
Backend:
  ✅ Busca por "POSTRES" + "Tiramisu"
  ❌ No encuentra nada
  ✅ INSERT nuevo registro
```

**Resultado:** ✅ Funciona perfecto, crea registro nuevo

---

### ⚠️ Casos con limitaciones

#### 3. Editar CATEGORIA o ARTICULO (el nombre)
```
Excel ANTES:
  CATEGORIA: BEBIDAS
  ARTICULO: Coca Cola  ← Quieres cambiar esto a "Coca Cola 500ml"
  PRECIO: 1500

Editas el nombre...

Excel DESPUÉS:
  CATEGORIA: BEBIDAS
  ARTICULO: Coca Cola 500ml  ← Nuevo nombre
  PRECIO: 1500

Apps Script lee DESPUÉS de editar:
  uniqueKey: { categoria: "BEBIDAS", articulo: "Coca Cola 500ml" }
  ⚠️ No tiene el valor viejo "Coca Cola"
  
Backend:
  ✅ Busca por "BEBIDAS" + "Coca Cola 500ml"
  ❌ No encuentra (porque el registro se llama "Coca Cola")
  ✅ INSERT nuevo registro con "Coca Cola 500ml"
  
Resultado en BD:
  - Registro 1: BEBIDAS | Coca Cola         | 1500  ← Viejo (queda huérfano)
  - Registro 2: BEBIDAS | Coca Cola 500ml   | 1500  ← Nuevo
```

**Resultado:** ⚠️ Se crea un registro duplicado

---

## 🤔 ¿Por Qué Pasa Esto?

Google Sheets Apps Script con `onEdit` **solo te da el valor DESPUÉS de editarlo**.

No hay forma nativa de saber el valor anterior sin:
1. Mantener un caché completo de la hoja (complejo, lento)
2. Agregar una columna ID al Excel (requiere cambiar estructura)
3. Usar Google Sheets API con versiones/historial (muy complejo)

---

## ✅ Soluciones Prácticas

### Solución 1: NO editar CATEGORIA ni ARTICULO
**Recomendada para uso diario**

Si necesitas cambiar el nombre:
1. Marca el artículo viejo como `DESHABILITADO`
2. Agrega una fila nueva con el nombre correcto
3. Opcional: Borra el viejo desde la BD

```
Paso 1: Deshabilitar viejo
  CATEGORIA: BEBIDAS
  ARTICULO: Coca Cola
  DISPONIBILIDAD: DESHABILITADO  ← Cambiar esto

Paso 2: Agregar nuevo
  [Nueva fila]
  CATEGORIA: BEBIDAS
  ARTICULO: Coca Cola 500ml
  PRECIO: 1500
  DISPONIBILIDAD: HABILITADO
```

---

### Solución 2: Agregar columna ID al Excel
**Más robusto pero requiere cambios**

1. Agregar columna `ID` en tu Excel (puede estar oculta)
2. Cuando haces sync completo (`/sync`), guarda el ID de cada registro en esa columna
3. Modificar Apps Script para usar el ID si existe

```javascript
// En AppScript_v2.js
const uniqueKey = rowData['ID'] 
  ? { id: rowData['ID'] }  // Si tiene ID, usar eso
  : { categoria: rowData['CATEGORIA'], articulo: rowData['ARTICULO'] };
```

```typescript
// En el backend
if (uniqueKey.id) {
  // Buscar por ID
  const [rows] = await pool.query('SELECT id FROM articulos WHERE id = ?', [uniqueKey.id]);
} else {
  // Buscar por categoria + articulo (fallback)
  const [rows] = await pool.query('SELECT id FROM articulos WHERE categoria = ? AND articulo = ?', [categoria, articulo]);
}
```

---

### Solución 3: Sync completo periódico
**Limpieza de duplicados**

Ejecuta el sync completo (`POST /sync`) una vez al día para:
- Leer toda la hoja desde cero
- Actualizar todos los registros correctamente
- Evitar duplicados acumulados

```bash
# Cron job diario (ejemplo)
curl -X POST https://tu-backend.com/api/v1/articulos/sync
```

---

## 📊 Tabla de Comportamiento

| Acción en Excel | uniqueKey enviado | Backend busca | Resultado |
|-----------------|-------------------|---------------|-----------|
| Editar PRECIO | `{cat: "A", art: "B"}` | Encuentra "A"+"B" | ✅ UPDATE |
| Editar COSTO | `{cat: "A", art: "B"}` | Encuentra "A"+"B" | ✅ UPDATE |
| Editar DISPONIBILIDAD | `{cat: "A", art: "B"}` | Encuentra "A"+"B" | ✅ UPDATE |
| Agregar fila | `{cat: "X", art: "Y"}` | No encuentra | ✅ INSERT |
| Cambiar ARTICULO: "B"→"C" | `{cat: "A", art: "C"}` | No encuentra "A"+"C" | ⚠️ INSERT (duplica) |
| Cambiar CATEGORIA: "A"→"Z" | `{cat: "Z", art: "B"}` | No encuentra "Z"+"B" | ⚠️ INSERT (duplica) |

---

## 🛠️ Cómo Limpiar Duplicados

### Ver duplicados
```sql
-- Artículos que aparecen más de una vez
SELECT categoria, articulo, COUNT(*) as count
FROM articulos
GROUP BY categoria, articulo
HAVING count > 1
ORDER BY count DESC;
```

### Ver detalles de duplicados
```sql
-- Ver todos los registros duplicados con sus IDs
SELECT id, categoria, articulo, precio, disponibilidad, 
       fecha_alta_producto, fecha_actualizacion_producto
FROM articulos
WHERE CONCAT(categoria, articulo) IN (
  SELECT CONCAT(categoria, articulo)
  FROM articulos
  GROUP BY categoria, articulo
  HAVING COUNT(*) > 1
)
ORDER BY categoria, articulo, id;
```

### Eliminar duplicados manualmente
```sql
-- Opción 1: Borrar por ID específico
DELETE FROM articulos WHERE id = 123;

-- Opción 2: Borrar el más viejo y dejar el más nuevo
DELETE t1 FROM articulos t1
INNER JOIN articulos t2 
WHERE t1.categoria = t2.categoria 
  AND t1.articulo = t2.articulo
  AND t1.id < t2.id;  -- Borra el de menor ID (más viejo)

-- Opción 3: Deshabilitar en lugar de borrar
UPDATE articulos 
SET disponibilidad = 'DESHABILITADO'
WHERE id IN (123, 456, 789);
```

---

## 📋 Mejores Prácticas

### ✅ HACER:
- Editar precio, costo, disponibilidad sin problema
- Agregar filas nuevas libremente
- Ejecutar sync completo (`/sync`) periódicamente
- Revisar duplicados cada semana

### ⚠️ EVITAR:
- Cambiar el nombre de CATEGORIA o ARTICULO directamente
- Si necesitas cambiar nombre: deshabilitar viejo + crear nuevo

### ❌ NO HACER:
- Borrar filas del Excel (no se sincronizan las eliminaciones)
- Cambiar nombres masivamente sin verificar después

---

## 🔮 Mejoras Futuras

### Opción A: Agregar columna ID
- ✅ Pro: Solución definitiva
- ❌ Con: Requiere modificar Excel
- ⏱️ Esfuerzo: 2-3 horas

### Opción B: Caché de estado previo
- ✅ Pro: No requiere cambios en Excel
- ❌ Con: Complejo, puede tener bugs
- ⏱️ Esfuerzo: 1 día

### Opción C: Webhook con historial
- ✅ Pro: Más robusto
- ❌ Con: Muy complejo, requiere infraestructura
- ⏱️ Esfuerzo: 3-5 días

---

## 💡 Recomendación Final

**Para uso normal:**
- ✅ Edita precios, costos, disponibilidad sin preocuparte
- ⚠️ Si necesitas cambiar nombre: deshabilita viejo + agrega nuevo
- 🔄 Ejecuta sync completo (`/sync`) una vez por semana

**Si cambias nombres frecuentemente:**
- Considera agregar columna ID al Excel (Solución 2)
- O acepta los duplicados y límplalos periódicamente

---

## 🐛 Problemas Conocidos

### Error: `Unknown column 'NaN' in 'field list'`
**Causa:** Celdas de precio/costo vacías en Excel

**Solución:** ✅ YA CORREGIDO en esta versión
- Valores vacíos ahora se convierten a `0`
- El error ya no debería aparecer

### Duplicados al cambiar nombre
**Causa:** Limitación explicada arriba

**Solución:** Usar las prácticas recomendadas

---

## 📞 Monitoreo Recomendado

```sql
-- Query para ejecutar semanalmente
-- Ver si hay duplicados nuevos
SELECT 
  categoria,
  articulo,
  COUNT(*) as duplicados,
  GROUP_CONCAT(id ORDER BY id) as ids,
  GROUP_CONCAT(fecha_actualizacion_producto ORDER BY id) as fechas
FROM articulos
GROUP BY categoria, articulo
HAVING COUNT(*) > 1;
```

Si aparecen duplicados:
1. Verificar cuál es el correcto (normalmente el más nuevo)
2. Deshabilitar o borrar los viejos
3. Documentar qué pasó para evitarlo en el futuro
