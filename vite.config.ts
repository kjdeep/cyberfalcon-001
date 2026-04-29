import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwind from "@tailwindcss/vite"
import path from "path";
import runableAnalyticsPlugin from "./vite/plugins/runable-analytics-plugin";

export default defineConfig({
	plugins: [react(), runableAnalyticsPlugin(), cloudflare(), tailwind()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src/web"),
		},
	},
	build: {
		chunkSizeWarningLimit: 900,
		rollupOptions: {
			output: {
				manualChunks(id: string) {
					if (!id.includes("node_modules")) return;

					// Split only the heavy 3D ecosystem.
					if (id.includes("/@react-three/drei/")) return "r3d";
					if (id.includes("/@react-three/fiber/")) return "r3f";
					if (id.includes("/three-stdlib/")) return "three-stdlib";
					if (id.includes("/troika-three-text/")) return "troika-text";
					if (id.includes("/meshline/")) return "three-meshline";
					if (id.includes("/three/")) return "three-core";

					// Let Rollup auto-chunk all other deps to avoid circular chunk graphs.
					return;
				},
			},
		},
	},
	server: {
		allowedHosts: true,
		hmr: { overlay: false, }
	}
});
