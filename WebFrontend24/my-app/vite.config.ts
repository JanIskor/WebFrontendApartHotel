import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   server: { port: 3000 },
//   plugins: [react()],
// })

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/visa_api": {
//         target: "http://localhost:8000",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/visa_api/, "/"),
//       },
//     },
//   },
// });

// export default defineConfig({
// 	server: {
// 		proxy: {
// 			'/apartments': {
// 				target: 'http://localhost:8000',
// 				changeOrigin: true,
// 				rewrite: path => path.replace(/^\/apartments/, "/apartments"),
// 			},
// 		},
// 		port: 3000,
// 	},
// 	plugins: [react()],
// })

export default defineConfig({
	server: {
		port: 3000,
		host: 'localhost',
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '/'),
			},
		},
	},
	plugins: [react()],
})