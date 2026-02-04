import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import articulosRoutes from './routes/articulos.routes';
import productosRoutes from './routes/productos.routes';
import { frontendAuthMiddleware } from './middleware/frontend.auth.middleware';
import authRoutes from './routes/auth.routes';
import { checkUserState } from './middleware/state.middleware';
export const app = express();
export const API_PREFIX = '/api/v1';

//cors permite origen en este caso vite-react
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

// Nota: se removió el middleware global de autenticación para permitir
// que este servidor funcione sin exigir tokens. Las rutas que requieran
// protección deben implementar su propio middleware si se desea.

// 📚 API Routes (sin middleware de frontend auth)
/* app.use(`${API_PREFIX}/auth`, authRoutes); */
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/articulos`, articulosRoutes);
app.use(`${API_PREFIX}/productos`, productosRoutes);


// 📁 Servir archivos estáticos del frontend build (../frontend/dist)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// 🔒 Middleware de autenticación para rutas del frontend (excepto /login y assets)
app.use(frontendAuthMiddleware);

// 📄 SPA fallback - sirve index.html para rutas no API (debe ir al final)
app.get(/^\/(?!api).*/, (req, res, next) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
        if (err) {
            next(err);
        }
    });
});

