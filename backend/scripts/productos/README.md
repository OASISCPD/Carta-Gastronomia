# fetchProductos

Script para leer la pestaña `PRODUCTOS` de un Google Spreadsheet y generar `productos.json`.

Uso:

- Asegúrate de tener la variable `SPREADSHEET_ID` en el archivo `.env` del proyecto, o pásalo como primer argumento.
- Asegúrate de tener credenciales de servicio en `credentials/service-account.json` o setear `GOOGLE_APPLICATION_CREDENTIALS`.

Ejecutar:

```bash
# usar SPREADSHEET_ID desde .env
npx ts-node scripts/productos/fetchProductos.ts

# o pasar spreadsheetId y opcionalmente el nombre de la hoja
npx ts-node scripts/productos/fetchProductos.ts 1F_o0c4smL4UZ5rdkIdQ2Bb1k5Mzprdw1xQ06a7hCK3Q PRODUCTOS
```

Salida:
- `scripts/productos/productos.json` con las filas parseadas.
- Imprime un pequeño resumen en consola.
