import { E as store_get, O as ensure_array_like, F as head, G as escape_html, I as attr_class, J as stringify, K as unsubscribe_stores, D as pop, A as push } from "../../../chunks/index2.js";
import { a as adminAuthStore } from "../../../chunks/admin.js";
import { g as goto } from "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let quickActions;
  let recentActivity = [];
  let liveIncidents = [];
  function getQuickActions(role) {
    const actions = [
      {
        title: "Create Contest",
        description: "Set up a new contest",
        icon: "🏆",
        action: () => goto(),
        roles: ["superadmin", "admin", "moderator"]
      },
      {
        title: "Add Match",
        description: "Create a new match",
        icon: "⚽",
        action: () => goto(),
        roles: ["superadmin", "admin", "moderator"]
      },
      {
        title: "Manage Users",
        description: "View and manage users",
        icon: "👥",
        action: () => goto(),
        roles: ["superadmin", "admin", "moderator", "viewer"]
      },
      {
        title: "Wallet Transactions",
        description: "Process wallet operations",
        icon: "💰",
        action: () => goto(),
        roles: ["superadmin", "admin"]
      },
      {
        title: "View Reports",
        description: "Analytics and insights",
        icon: "📈",
        action: () => goto(),
        roles: ["superadmin", "admin", "moderator", "viewer"]
      },
      {
        title: "System Settings",
        description: "Configure system settings",
        icon: "⚙️",
        action: () => goto(),
        roles: ["superadmin"]
      }
    ];
    return actions.filter((action) => !role || action.roles.includes(role));
  }
  function getRelativeTime(date) {
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1e3 * 60));
    const hours = Math.floor(diff / (1e3 * 60 * 60));
    const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
  quickActions = getQuickActions(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role);
  const each_array_1 = ensure_array_like(quickActions);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Dashboard - Dream11 Admin</title>`;
  });
  $$payload.out.push(`<div class="space-y-6"><div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white"><h1 class="text-2xl font-bold mb-2">Welcome back, ${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.name || "Admin")}!</h1> <p class="text-blue-100">Here's what's happening with your platform today.</p></div> `);
  {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(Array(5));
    $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      each_array[$$index];
      $$payload.out.push(`<div class="bg-white p-6 rounded-lg shadow animate-pulse"><div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div> <div class="h-8 bg-gray-200 rounded w-1/2"></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-1"><div class="bg-white rounded-lg shadow"><div class="p-6 border-b border-gray-200"><h3 class="text-lg font-medium text-gray-900">Quick Actions</h3></div> <div class="p-6 space-y-4"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let action = each_array_1[$$index_1];
    $$payload.out.push(`<button class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"><span class="text-2xl mr-3">${escape_html(action.icon)}</span> <div><p class="font-medium text-gray-900">${escape_html(action.title)}</p> <p class="text-sm text-gray-500">${escape_html(action.description)}</p></div></button>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="lg:col-span-1"><div class="bg-white rounded-lg shadow"><div class="p-6 border-b border-gray-200"><h3 class="text-lg font-medium text-gray-900">Recent Activity</h3></div> <div class="p-6">`);
  if (recentActivity.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_2 = ensure_array_like(recentActivity);
    $$payload.out.push(`<div class="space-y-4"><!--[-->`);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let activity = each_array_2[$$index_2];
      $$payload.out.push(`<div class="flex items-start space-x-3"><div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div> <div class="flex-1 min-w-0"><p class="text-sm text-gray-900"><span class="font-medium">${escape_html(activity.adminName)}</span> ${escape_html(activity.action)} ${escape_html(activity.resource)} `);
      if (activity.resourceId) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span class="text-gray-500">#${escape_html(activity.resourceId.slice(-6))}</span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></p> <p class="text-xs text-gray-500">${escape_html(getRelativeTime(activity.timestamp))}</p></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<p class="text-gray-500 text-center py-4">No recent activity</p>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="lg:col-span-1"><div class="bg-white rounded-lg shadow"><div class="p-6 border-b border-gray-200"><h3 class="text-lg font-medium text-gray-900">Live Incidents</h3></div> <div class="p-6">`);
  if (liveIncidents.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_3 = ensure_array_like(liveIncidents);
    $$payload.out.push(`<div class="space-y-4"><!--[-->`);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let incident = each_array_3[$$index_3];
      $$payload.out.push(`<div class="flex items-start space-x-3"><div${attr_class(`w-2 h-2 rounded-full mt-2 ${stringify(incident.type === "warning" ? "bg-yellow-500" : "bg-blue-500")}`)}></div> <div class="flex-1 min-w-0"><p class="text-sm text-gray-900">${escape_html(incident.message)}</p> <p class="text-xs text-gray-500">${escape_html(getRelativeTime(incident.timestamp))}</p></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<p class="text-gray-500 text-center py-4">No active incidents</p>`);
  }
  $$payload.out.push(`<!--]--></div></div></div></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
