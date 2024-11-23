import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        origin: process.env.VITE_DEV_SERVER || 'https://vite.hr.saas',
        port: process.env.VITE_PORT || 5173,
        strictPort: true,
        https: false,
    },
    logLevel: 'info',
});
