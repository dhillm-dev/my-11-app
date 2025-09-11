import { vi } from 'vitest';

// Mock SvelteKit runtime module
vi.mock('$app/environment', () => ({
	browser: false,
	dev: true,
	building: false,
	version: '1.0.0'
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn(),
	preloadData: vi.fn(),
	preloadCode: vi.fn(),
	beforeNavigate: vi.fn(),
	afterNavigate: vi.fn()
}));

vi.mock('$app/stores', () => {
	const getStores = () => {
		const navigating = readable(null);
		const page = readable({ url: new URL('http://localhost'), params: {} });
		const updated = { subscribe: vi.fn(), check: vi.fn() };

		return { navigating, page, updated };
	};

	const page = readable({ url: new URL('http://localhost'), params: {} });
	const navigating = readable(null);
	const updated = { subscribe: vi.fn(), check: vi.fn() };

	return { getStores, navigating, page, updated };
});

// Import readable from svelte/store
import { readable } from 'svelte/store';