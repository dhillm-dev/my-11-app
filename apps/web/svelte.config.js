import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Determine deployment target from environment
const deployTarget = process.env.DEPLOY_TARGET || 'vercel'; // 'vercel' or 'github-pages'

// Configure adapter based on deployment target
const getAdapter = () => {
	if (deployTarget === 'github-pages') {
		return adapterStatic({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		});
	}
	return adapterAuto();
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: getAdapter(),
		// Configure base path for GitHub Pages if needed
		paths: {
			base: deployTarget === 'github-pages' ? (process.env.BASE_PATH || '') : ''
		},
		// Prerender all routes for static deployment
		prerender: {
			entries: deployTarget === 'github-pages' ? ['*'] : undefined
		}
	}
};

export default config;
