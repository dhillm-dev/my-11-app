import { F as head, E as store_get, G as escape_html, K as unsubscribe_stores, D as pop, A as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import { a as adminAuthStore } from "../../../../chunks/admin.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Unauthorized - Dream11 Admin</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"><div class="sm:mx-auto sm:w-full sm:max-w-md"><div class="flex justify-center"><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg></div></div> <div class="mt-6 text-center"><h1 class="text-3xl font-bold text-gray-900">Access Denied</h1> <p class="mt-2 text-lg text-gray-600">You don't have permission to access this resource</p></div></div> <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md"><div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"><div class="space-y-4"><div class="bg-red-50 border border-red-200 rounded-md p-4"><div class="flex"><svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div class="ml-3"><h3 class="text-sm font-medium text-red-800">Insufficient Permissions</h3> <div class="mt-2 text-sm text-red-700"><p>Your current role `);
  if (store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<span class="font-semibold capitalize">(${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.role)})</span>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> does not have access to this resource. Please contact your administrator if you believe this is an error.</p></div></div></div></div> `);
  if (store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-blue-50 border border-blue-200 rounded-md p-4"><div class="flex"><svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div class="ml-3"><h3 class="text-sm font-medium text-blue-800">Current Session</h3> <div class="mt-2 text-sm text-blue-700"><p><strong>User:</strong> ${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.name)}</p> <p><strong>Email:</strong> ${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.email)}</p> <p><strong>Role:</strong> <span class="capitalize">${escape_html(store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session.user.role)}</span></p></div></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="flex flex-col space-y-3"><button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Go to Dashboard</button> <button class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Go Back</button> <button class="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Sign Out</button></div></div></div></div> <div class="mt-8 text-center"><p class="text-sm text-gray-500">Need help? Contact your system administrator.</p></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
