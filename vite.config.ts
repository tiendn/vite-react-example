import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		minify: false,
		rollupOptions: {
			input: {
				app: "./index.html",
			},
			output: {
				format: "es",
			},
		},
		outDir: "dist",
		emptyOutDir: true,
	},
	ssr: {
		target: "webworker",
		noExternal: [
			"react",
			"react-dom",
			"react-dom/server",
			"react-router-dom",
			"react-router-dom/server",
		],
	},
	optimizeDeps: {
		include: [
			"react",
			"react-dom",
			"react-dom/server.edge",
			"react-router-dom",
			"react-router-dom/server",
		],
	},
});
