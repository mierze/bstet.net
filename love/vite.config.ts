import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "/wedding/",
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        host: "0.0.0.0",
        port: 4444,
    },
    build: {
        outDir: "../_build/dist",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
