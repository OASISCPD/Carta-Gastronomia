Guía rápida: Google Sheets API (service account) para `ARTICULOS`

1) Crear proyecto en Google Cloud y habilitar API
- Ve a https://console.cloud.google.com/ y crea o selecciona un proyecto.
- En "APIs & Services" > "Library" busca "Google Sheets API" y habilítala.

2) Crear cuenta de servicio y descargar clave JSON
- En "IAM & Admin" > "Service Accounts" crea una nueva cuenta de servicio.
- En la cuenta creada, genera una clave (JSON) y descárgala a tu máquina.

3) Compartir la hoja de cálculo con la cuenta de servicio
- Abre la hoja de Google Sheets y comparte (botón "Compartir") con el email de la cuenta de servicio (valor `client_email` en el JSON). No hace falta dar permisos de edición si solo vas a leer.

4) Variables de entorno necesarias
- `GOOGLE_APPLICATION_CREDENTIALS`: ruta al archivo JSON descargado.
- `SPREADSHEET_ID`: id del spreadsheet (desde la URL, parte entre `/d/` y `/edit`).
- (Opcional) `SHEET_NAME`: nombre de la pestaña; por defecto `ARTICULOS`.

5) Ejecutar el script (TypeScript) localmente
- Instalar dependencias si no están instaladas:
```
cd backend
npm install
```
- Ejecutar con `ts-node` (usa la variable de entorno antes):
```
setx GOOGLE_APPLICATION_CREDENTIALS "C:\ruta\a\key.json"
setx SPREADSHEET_ID "1mprwggQ32spkssveMPcvPrdUzwsbe3lFtxQyEL49YJU"
npx ts-node scripts/fetchArticulosGoogleSheets.ts
```
En PowerShell usa `$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\ruta\a\key.json'` y `$env:SPREADSHEET_ID = '...'` antes de ejecutar el comando si no quieres crear variables permanentes.

6) Resultado
- Se generará `backend/scripts/articulos.json` con las filas normalizadas (se filtran filas sin `ARTICULO`).

Notas
- Si prefieres compilar TypeScript y ejecutar con `node`, añade el archivo al `tsconfig` o mueve el script a `src` y compila con `npm run build`.
- Ajusta las heurísticas de parseo en `fetchArticulosGoogleSheets.ts` según el formato real (se intentó cubrir casos comunes de separadores de miles y decimales).
