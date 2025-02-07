import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {defineConfig, loadEnv} from "vite";
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
			base: '/frontend',
			server: {
				https: {
					key: fs.readFileSync(path.resolve(__dirname, 'create-cert-key.pem')),
					cert: fs.readFileSync(path.resolve(__dirname, 'create-cert.pem')),
				},
				host: true,
				proxy: {
					'/api': {
						target: process.env.VITE_API_URL,
					},
				},
			},
			plugins: [react(),  mkcert(), tsconfigPaths()],
		})
}