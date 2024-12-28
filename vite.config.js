import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        origin: process.env.VITE_DEV_SERVER || 'https://vite.hr.saas',
        port: process.env.VITE_PORT || 5173,
        strictPort: true,
        https: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@/css': path.resolve(__dirname, 'resources/css')
        }
    },
    logLevel: 'info',
});
