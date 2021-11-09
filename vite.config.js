import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

export default defineConfig({
	base: "/arknights-calendar/",
	build: {
		sourcemap: true
	},
	plugins: [svelte()]
})
