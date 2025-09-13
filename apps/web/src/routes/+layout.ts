import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

// Enable static prerendering for GitHub Pages
export const prerender = true;
export const ssr = false;

// Define public routes that don't require authentication
const publicRoutes = [
	'/',
	'/how-to-play',
	'/faqs', 
	'/terms',
	'/auth/login',
	'/auth/register',
	'/auth/forgot',
	'/auth/reset'
];

// Define preview-only routes (can view but actions require auth)
const previewRoutes = [
	'/contests'
];

// Define routes that require authentication
const requiredAuthRoutes = [
	'/dashboard',
	'/wallet',
	'/my-teams',
	'/team-builder',
	'/live',
	'/results',
	'/profile',
	'/admin'
];

export const load: LayoutLoad = async ({ url, depends }) => {
	depends('auth:user');
	
	const pathname = url.pathname;
	
	// Check if user is authenticated (from localStorage in browser)
	let isAuthenticated = false;
	if (browser) {
		try {
			const userData = localStorage.getItem('user');
			isAuthenticated = !!userData;
		} catch (e) {
			isAuthenticated = false;
		}
	}
	
	// Check if current route requires authentication
	const requiresAuth = requiredAuthRoutes.some(route => 
		pathname === route || pathname.startsWith(route + '/')
	);
	
	// Check if current route is public
	const isPublicRoute = publicRoutes.some(route => 
		pathname === route || pathname.startsWith(route + '/')
	);
	
	// Check if current route is preview-only
	const isPreviewRoute = previewRoutes.some(route => 
		pathname === route || pathname.startsWith(route + '/')
	);
	
	// Redirect logic
	if (requiresAuth && !isAuthenticated) {
		// Store the intended destination for after login
		const returnTo = encodeURIComponent(pathname + url.search);
		throw redirect(302, `/auth/login?returnTo=${returnTo}`);
	}
	
	// If authenticated user tries to access auth pages, redirect to dashboard
	if (isAuthenticated && pathname.startsWith('/auth')) {
		throw redirect(302, '/dashboard');
	}
	
	return {
		isAuthenticated,
		requiresAuth,
		isPublicRoute,
		isPreviewRoute,
		pathname,
		publicRoutes,
		previewRoutes,
		requiredAuthRoutes
	};
};