import { d as derived, w as writable } from "./index.js";
const initialState = {
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
const ROLE_PERMISSIONS = {
  superadmin: [
    { resource: "*", actions: ["create", "read", "update", "delete", "publish", "lock"] }
  ],
  admin: [
    { resource: "contests", actions: ["create", "read", "update", "delete", "publish", "lock"] },
    { resource: "matches", actions: ["create", "read", "update", "delete"] },
    { resource: "players", actions: ["create", "read", "update", "delete"] },
    { resource: "users", actions: ["read", "update"] },
    { resource: "wallet", actions: ["read", "create"] },
    { resource: "reports", actions: ["read"] },
    { resource: "settings", actions: ["read", "update"] }
  ],
  moderator: [
    { resource: "contests", actions: ["read", "update", "publish"] },
    { resource: "matches", actions: ["read", "update"] },
    { resource: "players", actions: ["read", "update"] },
    { resource: "users", actions: ["read"] },
    { resource: "wallet", actions: ["read"] },
    { resource: "reports", actions: ["read"] }
  ],
  viewer: [
    { resource: "contests", actions: ["read"] },
    { resource: "matches", actions: ["read"] },
    { resource: "players", actions: ["read"] },
    { resource: "users", actions: ["read"] },
    { resource: "wallet", actions: ["read"] },
    { resource: "reports", actions: ["read"] },
    { resource: "settings", actions: ["read"] }
  ]
};
function createAdminAuthStore() {
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    // Actions
    async login(email, password) {
      update((state) => ({ ...state, isLoading: true }));
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const adminUsers = {
          "admin@dream11.com": {
            user: {
              id: "admin-1",
              email: "admin@dream11.com",
              name: "Super Admin",
              balance: 0,
              kycVerified: true,
              role: "superadmin",
              createdAt: /* @__PURE__ */ new Date()
            },
            role: "superadmin",
            password: "admin123"
          },
          "manager@dream11.com": {
            user: {
              id: "admin-2",
              email: "manager@dream11.com",
              name: "Admin Manager",
              balance: 0,
              kycVerified: true,
              role: "admin",
              createdAt: /* @__PURE__ */ new Date()
            },
            role: "admin",
            password: "manager123"
          },
          "mod@dream11.com": {
            user: {
              id: "admin-3",
              email: "mod@dream11.com",
              name: "Moderator",
              balance: 0,
              kycVerified: true,
              role: "moderator",
              createdAt: /* @__PURE__ */ new Date()
            },
            role: "moderator",
            password: "mod123"
          },
          "viewer@dream11.com": {
            user: {
              id: "admin-4",
              email: "viewer@dream11.com",
              name: "Viewer",
              balance: 0,
              kycVerified: true,
              role: "viewer",
              createdAt: /* @__PURE__ */ new Date()
            },
            role: "viewer",
            password: "viewer123"
          }
        };
        const adminData = adminUsers[email];
        if (adminData && password === adminData.password) {
          const session = {
            user: adminData.user,
            role: adminData.role,
            permissions: ROLE_PERMISSIONS[adminData.role] || []
          };
          const permissions = {
            users: { create: false, read: false, update: false, delete: false },
            players: { create: false, read: false, update: false, delete: false },
            contests: { create: false, read: false, update: false, delete: false },
            matches: { create: false, read: false, update: false, delete: false }
          };
          const rolePerms = ROLE_PERMISSIONS[adminData.role] || [];
          rolePerms.forEach((perm) => {
            if (perm.resource === "*" || permissions[perm.resource]) {
              perm.actions.forEach((action) => {
                if (perm.resource === "*") {
                  Object.keys(permissions).forEach((resource) => {
                    permissions[resource][action] = true;
                  });
                } else {
                  permissions[perm.resource][action] = true;
                }
              });
            }
          });
          update((state) => ({
            ...state,
            session,
            isAuthenticated: true,
            isLoading: false,
            permissions
          }));
          if (typeof window !== "undefined") {
            localStorage.setItem("admin_session", JSON.stringify(session));
          }
          return { success: true };
        } else {
          update((state) => ({ ...state, isLoading: false }));
          return { success: false, error: "Invalid credentials" };
        }
      } catch (error) {
        update((state) => ({ ...state, isLoading: false }));
        return { success: false, error: "Network error" };
      }
    },
    logout() {
      set(initialState);
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_session");
      }
    },
    // Initialize from localStorage
    init() {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("admin_session");
        if (stored) {
          try {
            const session = JSON.parse(stored);
            const permissions = {
              users: { create: false, read: false, update: false, delete: false },
              players: { create: false, read: false, update: false, delete: false },
              contests: { create: false, read: false, update: false, delete: false },
              matches: { create: false, read: false, update: false, delete: false }
            };
            const rolePerms = ROLE_PERMISSIONS[session.role] || [];
            rolePerms.forEach((perm) => {
              if (perm.resource === "*" || permissions[perm.resource]) {
                perm.actions.forEach((action) => {
                  if (perm.resource === "*") {
                    Object.keys(permissions).forEach((resource) => {
                      permissions[resource][action] = true;
                    });
                  } else {
                    permissions[perm.resource][action] = true;
                  }
                });
              }
            });
            update((state) => ({
              ...state,
              session,
              isAuthenticated: true,
              permissions
            }));
          } catch (e) {
            localStorage.removeItem("admin_session");
          }
        }
      }
    },
    // Impersonation
    impersonateUser(userId, userName) {
      update((state) => {
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
      update((state) => {
        if (!state.session) return state;
        return {
          ...state,
          session: {
            ...state.session,
            isImpersonating: false,
            originalAdminId: void 0
          }
        };
      });
    },
    // Permission checking
    hasPermission(resource, action) {
      let hasPermission = false;
      subscribe((state) => {
        if (!state.session) {
          hasPermission = false;
          return;
        }
        if (state.session.role === "superadmin") {
          hasPermission = true;
          return;
        }
        hasPermission = state.session.permissions.some(
          (perm) => (perm.resource === resource || perm.resource === "*") && perm.actions.includes(action)
        );
      })();
      return hasPermission;
    }
  };
}
const adminAuthStore = createAdminAuthStore();
derived(
  adminAuthStore,
  ($adminAuth) => $adminAuth.isAuthenticated
);
derived(
  adminAuthStore,
  ($adminAuth) => $adminAuth.session
);
derived(
  adminAuthStore,
  ($adminAuth) => $adminAuth.session?.isImpersonating || false
);
export {
  adminAuthStore as a
};
