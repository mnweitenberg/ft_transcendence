import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		basicSsl(),
		eslintPlugin({
			fix: true,
			cache: false,
			include: "**/*.+(vue|js|jsx|ts|tsx|scss)",
			exclude: ["node_modules", ".git", "dist"],
		}),
	],
	resolve: {
		alias: {
			src: "/src",
		},
	},
});
