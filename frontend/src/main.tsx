import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initWebVitals } from './core/utils/webVitals.ts'

initWebVitals()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const bootLoader = document.getElementById("boot-loader");
if (bootLoader) {
  requestAnimationFrame(() => {
    bootLoader.classList.add("hidden");
    window.setTimeout(() => bootLoader.remove(), 220);
  });
}
