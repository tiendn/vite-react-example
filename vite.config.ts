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
		},
		outDir: "dist",
		emptyOutDir: true,
	},
	ssr: {
		target: "webworker",
		noExternal: true,
	},
});
