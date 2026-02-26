import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("react-toastify")) return "vendor-toast";
          if (id.includes("lucide-react")) return "vendor-icons";

          return "vendor";
        },
      },
    },
  },
});
