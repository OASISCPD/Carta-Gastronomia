/**
 * AppScript v2 - Sincronización inteligente con detección de UPDATE vs INSERT
 * 
 * SOLUCIÓN: Usa (categoria + articulo) como clave compuesta única
 * - Si existe ese registro → UPDATE
 * - Si no existe → INSERT
 * 
 * SETUP:
 * 1. En Google Sheets: Extensions > Apps Script
 * 2. Copiar este código
 * 3. Configurar propiedades:
 *    - SYNC_ENDPOINT: https://tu-dominio.com/api/v1/articulos/sync/row
 *    - SYNC_TOKEN: (opcional) tu token de seguridad
 * 4. Crear trigger: onEditTriggerV2 → On edit
 */

function onEditTriggerV2(e) {
  const SYNC_ENDPOINT = PropertiesService.getScriptProperties().getProperty('SYNC_ENDPOINT');
  const SYNC_TOKEN = PropertiesService.getScriptProperties().getProperty('SYNC_TOKEN');
  
  const SOURCE_SHEET_NAME = 'ARTICULOS';

  // Log de inicio SIEMPRE para saber que se ejecutó
  console.log('========================================');
  console.log('[V2] 🔄 onEditTriggerV2 EJECUTADO');
  console.log('[V2] Timestamp:', new Date().toISOString());
  console.log('========================================');

  if (!SYNC_ENDPOINT) {
    console.error('[V2] ❌ Falta SYNC_ENDPOINT en las propiedades del script');
    console.error('[V2] 💡 Ejecuta setupPropertiesV2() para configurarlo');
    return;
  }

  console.log('[V2] ✅ SYNC_ENDPOINT:', SYNC_ENDPOINT);

  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) {
    console.log('[V2] ⏳ No se pudo obtener el lock, otra edición en curso');
    return;
  }

  try {
    // Validaciones básicas
    if (!e || !e.range) {
      console.log('[V2] ⚠️ No hay evento o rango');
      return;
    }

    const sheet = e.range.getSheet();
    const sheetName = sheet ? sheet.getName() : 'unknown';
    console.log('[V2] 📄 Hoja editada:', sheetName);
    
    if (!sheet || sheetName !== SOURCE_SHEET_NAME) {
      console.log(`[V2] ⏭️ Cambio en otra hoja (${sheetName}), ignorando`);
      console.log(`[V2] 💡 Solo se sincroniza la hoja: ${SOURCE_SHEET_NAME}`);
      return;
    }

    const row = e.range.getRow();
    const col = e.range.getColumn();
    console.log('[V2] 📍 Fila:', row, '| Columna:', col);
    
    if (row === 1) {
      console.log('[V2] ⏭️ Cambio en encabezados (fila 1), ignorando');
      return;
    }

    console.log('[V2] ✅ Validaciones pasadas, leyendo datos...');

    const lastCol = sheet.getLastColumn();

    // Leer encabezados
    const headers = sheet
      .getRange(1, 1, 1, lastCol)
      .getValues()[0]
      .map(h => (h || '').toString().trim());

    console.log('[V2] 📋 Headers encontrados:', headers.length, 'columnas');

    // Leer la fila completa editada
    const values = sheet
      .getRange(row, 1, 1, lastCol)
      .getValues()[0];

    // Crear objeto con los datos de la fila
    const rowData = {};
    headers.forEach((header, index) => {
      if (header) {
        rowData[header] = values[index];
      }
    });

    console.log('[V2] 📊 Datos de la fila:', JSON.stringify(rowData, null, 2));

    // Validar que tenga al menos categoria y articulo (clave compuesta)
    if (!rowData['CATEGORIA'] || !rowData['ARTICULO']) {
      console.warn('[V2] ⚠️ Fila sin CATEGORIA o ARTICULO, no se puede sincronizar');
      console.warn('[V2] CATEGORIA:', rowData['CATEGORIA']);
      console.warn('[V2] ARTICULO:', rowData['ARTICULO']);
      return;
    }

    console.log('[V2] ✅ Clave compuesta válida:');
    console.log('[V2]   - CATEGORIA:', rowData['CATEGORIA']);
    console.log('[V2]   - ARTICULO:', rowData['ARTICULO']);

    // ⚠️ IMPORTANTE: Si editas CATEGORIA o ARTICULO, se creará un registro NUEVO
    // porque onEdit lee el valor DESPUÉS de editarlo.
    // Para actualizar el registro correcto, NO cambies CATEGORIA ni ARTICULO.
    // Solo edita precio, costo, disponibilidad, etc.

    // Payload para el backend
    const payload = {
      sheet: SOURCE_SHEET_NAME,
      row: row,
      data: rowData,
      // Clave compuesta para identificación única
      uniqueKey: {
        categoria: rowData['CATEGORIA'],
        articulo: rowData['ARTICULO']
      },
      editedAt: new Date().toISOString()
    };

    console.log('[V2] 📦 Payload preparado, enviando a:', SYNC_ENDPOINT);

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    // Agregar token si existe
    if (SYNC_TOKEN) {
      options.headers = { 'x-sync-token': SYNC_TOKEN };
      console.log('[V2] 🔐 Token agregado');
    }

    // Enviar al backend
    console.log('[V2] 🚀 Enviando request...');
    const resp = UrlFetchApp.fetch(SYNC_ENDPOINT, options);
    const statusCode = resp.getResponseCode();
    const responseText = resp.getContentText();

    console.log('[V2] 📡 RESPONSE STATUS:', statusCode);
    console.log('[V2] 📡 RESPONSE BODY:', responseText);

    if (statusCode >= 200 && statusCode < 300) {
      console.log('[V2] ✅ SYNC EXITOSO!');
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('[V2] Action:', jsonResponse.action || 'unknown');
        console.log('[V2] Message:', jsonResponse.message || '');
      } catch (parseError) {
        console.log('[V2] (No se pudo parsear la respuesta como JSON)');
      }
    } else {
      console.error('[V2] ❌ Error en sync:', statusCode, responseText);
    }

  } catch (err) {
    console.error('[V2] ❌❌❌ ERROR EN onEditTriggerV2 ❌❌❌');
    console.error('[V2] Error:', err.toString());
    console.error('[V2] Stack:', err.stack);
  } finally {
    lock.releaseLock();
    console.log('[V2] 🔓 Lock liberado');
    console.log('========================================');
  }
}

/**
 * Función de prueba manual
 * Ejecutar desde el editor de Apps Script para probar sin necesidad de editar la hoja
 */
function testSyncV2() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ARTICULOS');
  
  if (!sheet) {
    console.error('[TEST] No se encontró la hoja ARTICULOS');
    return;
  }

  // Simular edición de la fila 2
  const mockEvent = {
    range: sheet.getRange(2, 1, 1, 1) // Fila 2, columna 1
  };

  console.log('[TEST] Simulando edición en fila 2...');
  onEditTriggerV2(mockEvent);
  console.log('[TEST] Completado');
}

/**
 * Función para configurar las propiedades necesarias
 * Ejecutar UNA VEZ desde el editor para configurar
 */
function setupPropertiesV2() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // CAMBIAR ESTA URL POR LA REAL
  const ENDPOINT = 'https://tu-dominio.com/api/v1/articulos/sync/row';
  
  scriptProperties.setProperties({
    'SYNC_ENDPOINT': ENDPOINT,
    'SYNC_TOKEN': '' // Dejar vacío si no usas token
  });
  
  console.log('[SETUP] Propiedades configuradas:');
  console.log('- SYNC_ENDPOINT:', scriptProperties.getProperty('SYNC_ENDPOINT'));
  console.log('- SYNC_TOKEN:', scriptProperties.getProperty('SYNC_TOKEN') ? '(configurado)' : '(no configurado)');
}

/**
 * Función para ver las propiedades actuales
 */
function checkPropertiesV2() {
  const scriptProperties = PropertiesService.getScriptProperties();
  console.log('[CHECK] Propiedades actuales:');
 

/**
 * Función para verificar si el trigger está instalado
 */
function checkTriggerV2() {
  const triggers = ScriptApp.getProjectTriggers();
  const editTriggers = triggers.filter(t => 
    t.getHandlerFunction() === 'onEditTriggerV2' && 
    t.getEventType() === ScriptApp.EventType.ON_EDIT
  );
  
  console.log('[CHECK TRIGGER] Total de triggers:', triggers.length);
  console.log('[CHECK TRIGGER] Triggers onEditTriggerV2:', editTriggers.length);
  
  if (editTriggers.length === 0) {
    console.error('❌ NO HAY TRIGGER INSTALADO para onEditTriggerV2');
    console.log('📝 Ejecuta createTriggerV2() para crearlo');
  } else {
    console.log('✅ Trigger instalado correctamente');
    editTriggers.forEach((trigger, index) => {
      console.log(`  Trigger ${index + 1}:`, {
        función: trigger.getHandlerFunction(),
        tipo: trigger.getEventType(),
        uniqueId: trigger.getUniqueId()
      });
    });
  }
  
  return editTriggers.length > 0;
}

/**
 * Función para crear el trigger automáticamente
 */
function createTriggerV2() {
  // Primero verificar si ya existe
  const triggers = ScriptApp.getProjectTriggers();
  const existingTriggers = triggers.filter(t => 
    t.getHandlerFunction() === 'onEditTriggerV2'
  );
  
  if (existingTriggers.length > 0) {
    console.warn('⚠️ Ya existe un trigger para onEditTriggerV2');
    console.log('Si quieres recrearlo, ejecuta deleteTriggerV2() primero');
    return;
  }
  
  // Crear el trigger
  ScriptApp.newTrigger('onEditTriggerV2')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  
  console.log('✅ Trigger creado exitosamente!');
  console.log('Ahora cuando edites una celda en la hoja ARTICULOS, se ejecutará onEditTriggerV2()');
  
  // Verificar
  checkTriggerV2();
}

/**
 * Función para eliminar todos los triggers de onEditTriggerV2
 */
function deleteTriggerV2() {
  const triggers = ScriptApp.getProjectTriggers();
  let deleted = 0;
  
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEditTriggerV2') {
      ScriptApp.deleteTrigger(trigger);
      deleted++;
    }
  });
  
  console.log(`🗑️ Eliminados ${deleted} trigger(s) de onEditTriggerV2`);
  checkTriggerV2();
}

/**
 * Setup completo: configura propiedades Y crea trigger
 */
function setupCompleteV2() {
  console.log('=== SETUP COMPLETO V2 ===');
  console.log('');
  
  // 1. Configurar propiedades
  console.log('Paso 1: Configurando propiedades...');
  setupPropertiesV2();
  console.log('');
  
  // 2. Crear trigger
  console.log('Paso 2: Creando trigger...');
  createTriggerV2();
  console.log('');
  
  // 3. Verificar todo
  console.log('Paso 3: Verificación final...');
  checkPropertiesV2();
  console.log('');
  checkTriggerV2();
  console.log('');
  
  console.log('=== SETUP COMPLETADO ===');
  console.log('✅ Ahora edita una celda en la hoja ARTICULOS para probar');
}

/**
 * Diagnóstico completo del sistema
 */
function diagnosticV2() {
  console.log('=== DIAGNÓSTICO V2 ===');
  console.log('');
  
  // 1. Verificar hoja
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ARTICULOS');
  if (sheet) {
    console.log('✅ Hoja ARTICULOS encontrada');
    console.log('  - Filas con datos:', sheet.getLastRow());
    console.log('  - Columnas:', sheet.getLastColumn());
  } else {
    console.error('❌ Hoja ARTICULOS NO encontrada');
    console.log('Hojas disponibles:');
    SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(s => {
      console.log('  -', s.getName());
    });
  }
  console.log('');
  
  // 2. Verificar propiedades
  console.log('Verificando propiedades...');
  checkPropertiesV2();
  console.log('');
  
  // 3. Verificar trigger
  console.log('Verificando trigger...');
  const hasTrigger = checkTriggerV2();
  console.log('');
  
  // 4. Resumen
  console.log('=== RESUMEN ===');
  if (!sheet) {
    console.error('❌ PROBLEMA: Hoja ARTICULOS no existe');
  }
  
  const endpoint = PropertiesService.getScriptProperties().getProperty('SYNC_ENDPOINT');
  if (!endpoint || endpoint.includes('tu-dominio')) {
    console.error('❌ PROBLEMA: SYNC_ENDPOINT no configurado correctamente');
  }
  
  if (!hasTrigger) {
    console.error('❌ PROBLEMA: Trigger no instalado');
    console.log('💡 SOLUCIÓN: Ejecuta createTriggerV2() o setupCompleteV2()');
  }
  
  if (sheet && endpoint && !endpoint.includes('tu-dominio') && hasTrigger) {
    console.log('✅ TODO CONFIGURADO CORRECTAMENTE');
    console.log('💡 Edita una celda en ARTICULOS para probar');
  }
} console.log('- SYNC_ENDPOINT:', scriptProperties.getProperty('SYNC_ENDPOINT'));
  console.log('- SYNC_TOKEN:', scriptProperties.getProperty('SYNC_TOKEN') ? '(configurado)' : '(no configurado)');
}
