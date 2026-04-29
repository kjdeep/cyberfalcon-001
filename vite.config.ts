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
		// Keep warning visibility but tune it for this app size.
		chunkSizeWarningLimit: 900,
		rollupOptions: {
			output: {
				// Split heavy libraries so initial bundle stays leaner.
				manualChunks(id: string) {
					if (!id.includes("node_modules")) return;

					if (id.includes("/three/")) return "three-core";
					if (id.includes("/@react-three/fiber/")) return "r3f";
					if (id.includes("/@react-three/drei/")) return "r3d";
					if (id.includes("/three-stdlib/")) return "three-stdlib";
					if (id.includes("/meshline/")) return "three-meshline";
					if (id.includes("/troika-three-text/")) return "troika-text";

					if (id.includes("/react/") || id.includes("/react-dom/")) return "react-core";
					if (id.includes("/wouter/")) return "router";
					if (id.includes("/lucide-react/")) return "icons";
					if (id.includes("/radix-ui/") || id.includes("/@radix-ui/")) return "radix";

					// Keep remaining third-party modules in a stable vendor chunk.
					return "vendor";
				},
			},
		},
	},
	server: {
		allowedHosts: true,
		hmr: { overlay: false, }
	}
});
