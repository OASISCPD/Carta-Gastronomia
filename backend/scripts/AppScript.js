function onEditTrigger(e) {
  const SYNC_ENDPOINT = PropertiesService.getScriptProperties().getProperty('SYNC_ENDPOINT');
  const SYNC_TOKEN = PropertiesService.getScriptProperties().getProperty('SYNC_TOKEN');

  const SOURCE_SHEET_NAME = 'ARTICULOS';

  if (!SYNC_ENDPOINT) {
    console.error('Falta SYNC_ENDPOINT');
    return;
  }

  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) return;

  try {
    if (!e || !e.range) return;

    const sheet = e.range.getSheet();
    if (!sheet || sheet.getName() !== SOURCE_SHEET_NAME) return;

    const row = e.range.getRow();
    if (row === 1) return; // ignora encabezados

    const lastCol = sheet.getLastColumn();

    // Encabezados
    const headers = sheet
      .getRange(1, 1, 1, lastCol)
      .getValues()[0]
      .map(h => (h || '').toString().trim());

    // Fila completa editada
    const values = sheet
      .getRange(row, 1, 1, lastCol)
      .getValues()[0];

    const payload = {
      sheet: SOURCE_SHEET_NAME,
      row: row,
      headers: headers,
      values: values,
      editedAt: new Date().toISOString()
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    // Token SOLO si existe
    if (SYNC_TOKEN) {
      options.headers = { 'x-sync-token': SYNC_TOKEN };
    }

    const resp = UrlFetchApp.fetch(SYNC_ENDPOINT, options);

    console.log('SYNC', {
      status: resp.getResponseCode(),
      body: resp.getContentText()
    });

  } catch (err) {
    console.error('Error en onEditTrigger', err);
  } finally {
    lock.releaseLock();
  }
}
