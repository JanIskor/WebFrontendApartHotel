import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths'
import {VitePWA, VitePWAOptions} from "vite-plugin-pwa";
import * as path from "node:path";

const manifestForPlugin: Partial<VitePWAOptions> = {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    manifest: {
        name: 'Удаленное заселение в апарт-отель',
        short_name: 'Удаленное заселение в апарт-отель',
        description: 'Description',
        theme_color: '#ffffff',
        icons: [
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    }
};

export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    // @ts-expect-error process is a nodejs global
    const host = process.env.TAURI_DEV_HOST;

    return defineConfig({
        plugins: [
            react(),
            tsconfigPaths(),
            VitePWA(manifestForPlugin)
        ],
        clearScreen: false,
        server: {
            port: 3000,
            strictPort: true,
            host: host || false,
            watch: {
                ignored: ["**/src-tauri/**"]
            },
            proxy: {
                "/api": {
                    target: process.env.VITE_API_URL
                },
            }
        },
    });
}
