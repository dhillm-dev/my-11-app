import { writable, derived } from 'svelte/store';
import type { AdminSession, AdminPermission, User } from '$lib/types';

// Admin authentication store
interface AdminAuthState {
	session: AdminSession | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	permissions: {
		users?: { create?: boolean; read?: boolean; update?: boolean; delete?: boolean };
		players?: { create?: boolean; read?: boolean; update?: boolean; delete?: boolean };
		contests?: { create?: boolean; read?: boolean; update?: boolean; delete?: boolean };
		matches?: { create?: boolean; read?: boolean; update?: boolean; delete?: boolean };
	};
}

const initialState: AdminAuthState = {
	session: null,
	isLoading: false,
	isAuthenticated: false,
	permissions: {
		users: { create: false, read: false, update: false, delete: false },
		players: { create: false, read: false, update: false, delete: false },
		contests: { create: false, read: false, update: false, delete: false },
		matches: { create: false, read: false, update: false, delete: false }
	}
};

// Role-based permissions configuration
const ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
	superadmin: [
		{ resource: '*', actions: ['create', 'read', 'update', 'delete', 'publish', 'lock'] }
	],
	admin: [
		{ resource: 'contests', actions: ['create', 'read', 'update', 'delete', 'publish', 'lock'] },
		{ resource: 'matches', actions: ['create', 'read', 'update', 'delete'] },
		{ resource: 'players', actions: ['create', 'read', 'update', 'delete'] },
		{ resource: 'users', actions: ['read', 'update'] },
		{ resource: 'wallet', actions: ['read', 'create'] },
		{ resource: 'reports', actions: ['read'] },
		{ resource: 'settings', actions: ['read', 'update'] }
	],
	moderator: [
		{ resource: 'contests', actions: ['read', 'update', 'publish'] },
		{ resource: 'matches', actions: ['read', 'update'] },
		{ resource: 'players', actions: ['read', 'update'] },
		{ resource: 'users', actions: ['read'] },
		{ resource: 'wallet', actions: ['read'] },
		{ resource: 'reports', actions: ['read'] }
	],
	viewer: [
		{ resource: 'contests', actions: ['read'] },
		{ resource: 'matches', actions: ['read'] },
		{ resource: 'players', actions: ['read'] },
		{ resource: 'users', actions: ['read'] },
		{ resource: 'wallet', actions: ['read'] },
		{ resource: 'reports', actions: ['read'] },
		{ resource: 'settings', actions: ['read'] }
	]
};

function createAdminAuthStore() {
	const { subscribe, set, update } = writable<AdminAuthState>(initialState);

	return {
		subscribe,

		// Actions
		async login(email: string, password: string) {
			update(state => ({ ...state, isLoading: true }));

			try {
				// Mock admin login - in real app, this would call admin API
				await new Promise(resolve => setTimeout(resolve, 1000));

				// Mock admin users
				const adminUsers: Record<string, { user: User; role: AdminSession['role']; password: string }> = {
					'admin@dream11.com': {
						user: {
							id: 'admin-1',
							email: 'admin@dream11.com',
							name: 'Super Admin',
							balance: 0,
							kycVerified: true,
							role: 'superadmin',
							createdAt: new Date()
						},
						role: 'superadmin',
						password: 'admin123'
					},
					'manager@dream11.com': {
						user: {
							id: 'admin-2',
							email: 'manager@dream11.com',
							name: 'Admin Manager',
							balance: 0,
							kycVerified: true,
							role: 'admin',
							createdAt: new Date()
						},
						role: 'admin',
						password: 'manager123'
					},
					'mod@dream11.com': {
						user: {
							id: 'admin-3',
							email: 'mod@dream11.com',
							name: 'Moderator',
							balance: 0,
							kycVerified: true,
							role: 'moderator',
							createdAt: new Date()
						},
						role: 'moderator',
						password: 'mod123'
					},
					'viewer@dream11.com': {
						user: {
							id: 'admin-4',
							email: 'viewer@dream11.com',
							name: 'Viewer',
							balance: 0,
							kycVerified: true,
							role: 'viewer',
							createdAt: new Date()
						},
						role: 'viewer',
						password: 'viewer123'
					}
				};

				const adminData = adminUsers[email];
				if (adminData && password === adminData.password) {
					const session: AdminSession = {
					user: adminData.user,
					role: adminData.role,
					permissions: ROLE_PERMISSIONS[adminData.role] || []
				};

				// Build permissions object from role permissions
				const permissions = {
					users: { create: false, read: false, update: false, delete: false },
					players: { create: false, read: false, update: false, delete: false },
					contests: { create: false, read: false, update: false, delete: false },
					matches: { create: false, read: false, update: false, delete: false }
				};

				// Set permissions based on role
				const rolePerms = ROLE_PERMISSIONS[adminData.role] || [];
				rolePerms.forEach(perm => {
					if (perm.resource === '*' || permissions[perm.resource as keyof typeof permissions]) {
						perm.actions.forEach(action => {
							if (perm.resource === '*') {
								// Superadmin gets all permissions
								Object.keys(permissions).forEach(resource => {
									permissions[resource as keyof typeof permissions][action as keyof typeof permissions.users] = true;
								});
							} else {
								permissions[perm.resource as keyof typeof permissions][action as keyof typeof permissions.users] = true;
							}
						});
					}
				});

				update(state => ({
					...state,
					session,
					isAuthenticated: true,
					isLoading: false,
					permissions
				}));

					// Store session in localStorage
					if (typeof window !== 'undefined') {
						localStorage.setItem('admin_session', JSON.stringify(session));
					}

					return { success: true };
				} else {
					update(state => ({ ...state, isLoading: false }));
					return { success: false, error: 'Invalid credentials' };
				}
			} catch (error) {
				update(state => ({ ...state, isLoading: false }));
				return { success: false, error: 'Network error' };
			}
		},

		logout() {
			set(initialState);
			if (typeof window !== 'undefined') {
				localStorage.removeItem('admin_session');
			}
		},

		// Initialize from localStorage
		init() {
			if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('admin_session');
			if (stored) {
				try {
					const session = JSON.parse(stored) as AdminSession;
					
					// Build permissions object from role permissions
					const permissions = {
						users: { create: false, read: false, update: false, delete: false },
						players: { create: false, read: false, update: false, delete: false },
						contests: { create: false, read: false, update: false, delete: false },
						matches: { create: false, read: false, update: false, delete: false }
					};

					// Set permissions based on role
					const rolePerms = ROLE_PERMISSIONS[session.role] || [];
					rolePerms.forEach(perm => {
						if (perm.resource === '*' || permissions[perm.resource as keyof typeof permissions]) {
							perm.actions.forEach(action => {
								if (perm.resource === '*') {
									// Superadmin gets all permissions
									Object.keys(permissions).forEach(resource => {
										permissions[resource as keyof typeof permissions][action as keyof typeof permissions.users] = true;
									});
								} else {
									permissions[perm.resource as keyof typeof permissions][action as keyof typeof permissions.users] = true;
								}
							});
						}
					});

					update(state => ({
						...state,
						session,
						isAuthenticated: true,
						permissions
						}));
					} catch (e) {
						localStorage.removeItem('admin_session');
					}
				}
			}
		},

		// Impersonation
		impersonateUser(userId: string, userName: string) {
			update(state => {
				if (!state.session) return state;
				return {
					...state,
					session: {
						...state.session,
						isImpersonating: true,
						originalAdminId: state.session.user.id
					}
				};
			});
		},

		stopImpersonation() {
			update(state => {
				if (!state.session) return state;
				return {
					...state,
					session: {
						...state.session,
						isImpersonating: false,
						originalAdminId: undefined
					}
				};
			});
		},

		// Permission checking
		hasPermission(resource: string, action: string): boolean {
			let hasPermission = false;
			subscribe(state => {
				if (!state.session) {
					hasPermission = false;
					return;
				}

				// Superadmin has all permissions
				if (state.session.role === 'superadmin') {
					hasPermission = true;
					return;
				}

				// Check specific permissions
				hasPermission = state.session.permissions.some(perm => 
					(perm.resource === resource || perm.resource === '*') && 
					perm.actions.includes(action as any)
				);
			})();
			return hasPermission;
		}
	};
}

export const adminAuthStore = createAdminAuthStore();

// Derived stores
export const isAdminAuthenticated = derived(
	adminAuthStore, 
	$adminAuth => $adminAuth.isAuthenticated
);

export const adminSession = derived(
	adminAuthStore, 
	$adminAuth => $adminAuth.session
);

export const isImpersonating = derived(
	adminAuthStore, 
	$adminAuth => $adminAuth.session?.isImpersonating || false
);

// Permission helpers
export function hasAdminPermission(resource: string, action: string): boolean {
	return adminAuthStore.hasPermission(resource, action);
}

export function requireAdminRole(allowedRoles: string[]): boolean {
	let hasRole = false;
	adminSession.subscribe(session => {
		hasRole = session ? allowedRoles.includes(session.role) : false;
	})();
	return hasRole;
}