import { N as fallback, E as store_get, O as ensure_array_like, I as attr_class, P as attr, G as escape_html, J as stringify, Q as maybe_selected, R as slot, K as unsubscribe_stores, S as bind_props, D as pop, A as push } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/stores.js";
import { a as adminAuthStore } from "../../../chunks/admin.js";
import "@sveltejs/kit";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "../../../chunks/state.svelte.js";
function AdminLayout($$payload, $$props) {
  push();
  var $$store_subs;
  let currentPath, filteredNavItems;
  let title = fallback($$props["title"], "Admin Panel");
  let searchQuery = "";
  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "📊",
      permission: "read:dashboard"
    },
    {
      path: "/admin/contests",
      label: "Contests",
      icon: "🏆",
      permission: "read:contests"
    },
    {
      path: "/admin/matches",
      label: "Matches",
      icon: "⚽",
      permission: "read:matches"
    },
    {
      path: "/admin/players",
      label: "Players",
      icon: "👤",
      permission: "read:players"
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: "👥",
      permission: "read:users"
    },
    {
      path: "/admin/wallet",
      label: "Wallet",
      icon: "💰",
      permission: "read:wallet"
    },
    {
      path: "/admin/reports",
      label: "Reports",
      icon: "📈",
      permission: "read:reports"
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: "⚙️",
      permission: "write:settings"
    }
  ];
  currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  filteredNavItems = navItems.filter((item) => {
    const [resource, action] = item.permission.split(".");
    return store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).permissions[resource]?.[action] || false;
  });
  const each_array = ensure_array_like(
    // Search functionality
    // Mock global search across entities
    // Keyboard shortcuts
    filteredNavItems
  );
  $$payload.out.push(`<div class="flex h-screen bg-gray-50"><aside${attr_class(`${stringify("w-64")} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`, "svelte-1bs9by8")}><div class="p-4 border-b border-gray-200">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<h1 class="text-xl font-bold text-gray-900">Dream11 Admin</h1>`);
  }
  $$payload.out.push(`<!--]--></div> <nav class="flex-1 p-4 space-y-2"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out.push(`<a${attr("href", item.path)}${attr_class(`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${stringify(currentPath === item.path || item.path !== "/admin" && currentPath.startsWith(item.path) ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-700 hover:bg-gray-50")}`)}><span class="text-lg mr-3">${escape_html(item.icon)}</span> `);
    {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<span>${escape_html(item.label)}</span>`);
    }
    $$payload.out.push(`<!--]--></a>`);
  }
  $$payload.out.push(`<!--]--></nav> <div class="p-4 border-t border-gray-200">`);
  if (store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center space-x-3"><div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><span class="text-sm font-medium text-gray-700">${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.name.charAt(0).toUpperCase())}</span></div> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-900 truncate">${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.name)}</p> <p class="text-xs text-gray-500 capitalize">${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.role)}</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></aside> <div class="flex-1 flex flex-col overflow-hidden"><header class="bg-white border-b border-gray-200 px-6 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button> <h2 class="text-xl font-semibold text-gray-900">${escape_html(title)}</h2></div> <div class="flex items-center space-x-4"><div class="relative"><input id="global-search" type="text"${attr("value", searchQuery)} placeholder="Search... (Ctrl+K)" class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/> <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <select class="border border-gray-300 rounded px-3 py-1 text-sm"><option value="en"${maybe_selected($$payload, "en")}>EN</option><option value="nl"${maybe_selected($$payload, "nl")}>NL</option></select> <div class="relative"><button class="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100">`);
  if (store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><span class="text-white text-sm font-medium">${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.name.charAt(0).toUpperCase())}</span></div> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></button> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div></div></header> <main class="flex-1 overflow-auto p-6"><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></main></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { title });
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let pageTitle;
  function getPageTitle(pathname) {
    const routes = {
      "/admin": "Dashboard",
      "/admin/contests": "Contests Management",
      "/admin/matches": "Matches Management",
      "/admin/players": "Players Management",
      "/admin/users": "Users Management",
      "/admin/wallet": "Wallet Management",
      "/admin/reports": "Reports & Analytics",
      "/admin/settings": "System Settings",
      "/admin/login": "Admin Login",
      "/admin/unauthorized": "Unauthorized Access"
    };
    if (routes[pathname]) {
      return routes[pathname];
    }
    for (const [route, title] of Object.entries(routes)) {
      if (pathname.startsWith(route) && route !== "/admin") {
        return title;
      }
    }
    return "Admin Panel";
  }
  pageTitle = getPageTitle(store_get($$store_subs ??= {}, "$page", page).url.pathname);
  if (store_get($$store_subs ??= {}, "$page", page).url.pathname === "/admin/login") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<!---->`);
    slot($$payload, $$props, "default", {});
    $$payload.out.push(`<!---->`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).isAuthenticated) {
      $$payload.out.push("<!--[-->");
      AdminLayout($$payload, {
        title: pageTitle,
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->`);
          slot($$payload2, $$props, "default", {});
          $$payload2.out.push(`<!---->`);
        },
        $$slots: { default: true }
      });
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<div class="min-h-screen bg-gray-50 flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div> <p class="mt-4 text-gray-600">Checking authentication...</p></div></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
