import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev'); // Check if running in dev mode

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html' // GitHub Pages standard for SPA routing
		}),
		// If DEPLOY_TARGET is 'github-pages', use the repo name as base
		// Otherwise, use root for local development or other deployments
		paths: {
			base: process.env.DEPLOY_TARGET === 'github-pages' ? '/my-11-app' : ''
		}
	}
};

export default config;
