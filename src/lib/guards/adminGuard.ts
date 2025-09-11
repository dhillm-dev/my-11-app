import { redirect } from '@sveltejs/kit';
import type { AdminPermission } from '$lib/types';
import { adminAuthStore, hasAdminPermission } from '$lib/stores/admin';
import { get } from 'svelte/store';

// Route-level guard for admin access
export function requireAdminAuth() {
	const adminAuth = get(adminAuthStore);
	
	if (!adminAuth.isAuthenticated || !adminAuth.session) {
		throw redirect(302, '/admin/login');
	}
	
	return adminAuth.session;
}

// Permission-based guard for specific actions
export function requirePermission(permission: AdminPermission) {
	const adminAuth = get(adminAuthStore);
	
	if (!adminAuth.isAuthenticated || !adminAuth.session) {
		throw redirect(302, '/admin/login');
	}
	
	// Check if user has any of the required actions for the resource
	const hasAnyPermission = permission.actions.some(action => 
		hasAdminPermission(permission.resource, action)
	);
	
	if (!hasAnyPermission) {
		throw redirect(302, '/admin/unauthorized');
	}
	
	return adminAuth.session;
}

// Role-based guard
export function requireRole(roles: string | string[]) {
	const adminAuth = get(adminAuthStore);
	
	if (!adminAuth.isAuthenticated || !adminAuth.session) {
		throw redirect(302, '/admin/login');
	}
	
	const allowedRoles = Array.isArray(roles) ? roles : [roles];
	if (!allowedRoles.includes(adminAuth.session.user.role || '')) {
		throw redirect(302, '/admin/unauthorized');
	}
	
	return adminAuth.session;
}

// Viewer role guard (read-only access)
export function requireViewerOrAbove() {
	return requireRole(['viewer', 'moderator', 'admin', 'superadmin']);
}

// Moderator role guard
export function requireModeratorOrAbove() {
	return requireRole(['moderator', 'admin', 'superadmin']);
}

// Admin role guard
export function requireAdminOrAbove() {
	return requireRole(['admin', 'superadmin']);
}

// Super admin role guard
export function requireSuperAdmin() {
	return requireRole('superadmin');
}

// Check if user can perform destructive actions
export function canPerformDestructiveActions(): boolean {
	const adminAuth = get(adminAuthStore);
	
	if (!adminAuth.isAuthenticated || !adminAuth.session) {
		return false;
	}
	
	const role = adminAuth.session.user.role;
	return role === 'admin' || role === 'superadmin';
}

// Check if user can modify settings
export function canModifySettings(): boolean {
	const adminAuth = get(adminAuthStore);
	
	if (!adminAuth.isAuthenticated || !adminAuth.session) {
		return false;
	}
	
	return adminAuth.session.user.role === 'superadmin';
}

// Check if user can impersonate other users
export function canImpersonate(): boolean {
	const adminAuth = get(adminAuthStore);
	
	if (!adminAuth.isAuthenticated || !adminAuth.session) {
		return false;
	}
	
	const role = adminAuth.session.user.role;
	return role === 'admin' || role === 'superadmin';
}