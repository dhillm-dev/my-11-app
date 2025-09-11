import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts']
	},
	resolve: {
		alias: {
			'$lib': path.resolve('./src/lib'),
			'$app': path.resolve('./node_modules/@sveltejs/kit/src/runtime/app')
		}
	}
});