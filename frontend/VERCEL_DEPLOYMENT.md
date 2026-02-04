# Despliegue del Frontend en Vercel

Este documento describe los pasos para desplegar el frontend de Carta Gastronomía en Vercel.

## ✅ Pre-requisitos completados

- ✅ `package.json` tiene script `build` que ejecuta `vite build`
- ✅ `vercel.json` configurado con rewrite para SPA (fallback a `index.html`)
- ✅ Build local funciona correctamente (`npm run build` genera carpeta `dist`)

## 📦 Configuración del Proyecto en Vercel

### 1. Crear proyecto en Vercel

1. Ir a [vercel.com](https://vercel.com) e iniciar sesión
2. Click en "Add New..." → "Project"
3. Importar el repositorio Git

### 2. Configuración del proyecto (Project Settings)

En la configuración del proyecto, establecer:

**Framework Preset:** Vite

**Build & Development Settings:**
- **Root Directory:** `frontend` (importante para monorepos)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (por defecto)

### 3. Variables de Entorno

Agregar en **Environment Variables** (Settings → Environment Variables):

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | URL del backend desplegado | Ejemplo: `https://tu-backend.com/api/v1` |

**⚠️ Importante:** Las variables públicas en Vite **deben** tener prefijo `VITE_`.

**Ejemplo de uso en el código:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005/api/v1';
```

### 4. Desplegar

1. Click en "Deploy"
2. Vercel ejecutará el build y desplegará automáticamente
3. Una vez completado, obtendrás una URL de producción

## 🔧 Verificación Post-Despliegue

### Checklist de pruebas

- [ ] La página principal carga correctamente
- [ ] Navegar entre rutas internas funciona
- [ ] Recargar la página (F5) en rutas internas mantiene la ruta (no da 404)
- [ ] Las llamadas al backend funcionan (verificar en DevTools → Network)
- [ ] No hay errores de CORS en la consola del navegador

### Solución a problemas comunes

**1. Error 404 al recargar rutas internas**
- ✅ **Solución:** Ya configurado en `vercel.json` con el rewrite a `index.html`

**2. Errores de CORS**
- **Causa:** El backend no permite requests desde el dominio de Vercel
- **Solución:** Configurar CORS en el backend para permitir el dominio de Vercel
  ```typescript
  // En backend/src/app.ts
  app.use(cors({
    origin: ['https://tu-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true
  }));
  ```

**3. Variables de entorno no funcionan**
- **Causa:** Falta prefijo `VITE_` o no están definidas en Vercel
- **Solución:** 
  1. Verificar que tienen prefijo `VITE_`
  2. Agregarlas en Settings → Environment Variables
  3. Redesplegar (Vercel las carga al momento del build)

## 🔄 Despliegues Automáticos

Vercel desplegará automáticamente:
- **Producción:** Cada push a la rama `main`
- **Preview:** Cada push a otras ramas o Pull Requests

## 📝 Configuración Opcional

### Dominios Personalizados

1. Settings → Domains
2. Agregar tu dominio personalizado
3. Configurar DNS según instrucciones de Vercel

### Rewrites/Proxy al Backend (opcional)

Si querés servir el backend bajo el mismo dominio para evitar CORS:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://tu-backend.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Protección de Rutas

Para proteger el endpoint de sincronización:
1. Agregar variable `VITE_SYNC_TOKEN` en Vercel
2. Enviar token en header cuando llames al endpoint `/api/v1/articulos/sync`

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Despliegue de Vite en Vercel](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Variables de Entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)

---

**✨ Listo para desplegar!** Si tenés dudas, consultá la documentación oficial de Vercel o revisá los logs de deployment.
