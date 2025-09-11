import { E as store_get, F as head, P as attr, Q as maybe_selected, G as escape_html, O as ensure_array_like, T as attr_style, I as attr_class, J as stringify, K as unsubscribe_stores, D as pop, A as push } from "../../../../chunks/index2.js";
import { a as adminAuthStore } from "../../../../chunks/admin.js";
import "../../../../chunks/feedAdapter.js";
import "../../../../chunks/button.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let canCreate, canEdit, canDelete, showBulkActions, filteredContests;
  let contests = [];
  let searchQuery = "";
  let statusFilter = "all";
  let selectedContests = /* @__PURE__ */ new Set();
  let currentPage = 1;
  let totalPages = 1;
  let pageSize = 10;
  let totalContests = 0;
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount);
  }
  function getStatusBadgeClass(status) {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "finished":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "superadmin" || store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "admin";
  canCreate = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "superadmin" || store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "admin" || store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "moderator";
  canEdit = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "superadmin" || store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "admin" || store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "moderator";
  canDelete = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "superadmin" || store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "admin";
  showBulkActions = selectedContests.size > 0;
  filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase()) || contest.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all";
    return matchesSearch && matchesStatus;
  });
  {
    totalContests = filteredContests.length;
    totalPages = Math.ceil(totalContests / pageSize);
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Contests Management - Dream11 Admin</title>`;
  });
  $$payload.out.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h1 class="text-2xl font-bold text-gray-900">Contests Management</h1> <p class="text-gray-600">Manage contests, publish, lock, and track performance</p></div> `);
  if (canCreate) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> <span>Create Contest</span></button>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="bg-white p-6 rounded-lg shadow"><div class="flex flex-col sm:flex-row gap-4"><div class="flex-1"><input type="text"${attr("value", searchQuery)} placeholder="Search contests..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/></div> <div><select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">`);
  $$payload.select_value = statusFilter;
  $$payload.out.push(`<option value="all"${maybe_selected($$payload, "all")}>All Status</option><option value="draft"${maybe_selected($$payload, "draft")}>Draft</option><option value="open"${maybe_selected($$payload, "open")}>Open</option><option value="closed"${maybe_selected($$payload, "closed")}>Closed</option><option value="finished"${maybe_selected($$payload, "finished")}>Finished</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span>Export CSV</span></button></div></div> `);
  if (showBulkActions) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><div class="flex items-center justify-between"><span class="text-blue-800 font-medium">${escape_html(selectedContests.size)} contest${escape_html(selectedContests.size !== 1 ? "s" : "")} selected</span> <div class="flex space-x-2">`);
    if (canEdit) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Publish</button> <button class="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">Lock</button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (canDelete) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <button class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">Clear</button></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="bg-white rounded-lg shadow overflow-hidden">`);
  {
    $$payload.out.push("<!--[!-->");
    if (contests.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="p-8 text-center"><p class="text-gray-500">No contests found</p> `);
      if (canCreate) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Create First Contest</button>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array = ensure_array_like(contests);
      $$payload.out.push(`<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left"><input type="checkbox"${attr("checked", selectedContests.size === contests.length && contests.length > 0, true)} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize Pool</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entries</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let contest = each_array[$$index];
        $$payload.out.push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4"><input type="checkbox"${attr("checked", selectedContests.has(contest.id), true)} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></td><td class="px-6 py-4"><div><div class="text-sm font-medium text-gray-900">${escape_html(contest.title)}</div> <div class="text-sm text-gray-500">Match: ${escape_html(contest.matchId)}</div> <div class="text-sm text-gray-500">Entry: ${escape_html(formatCurrency(contest.entryFee))}</div></div></td><td class="px-6 py-4 text-sm text-gray-900">${escape_html(formatCurrency(contest.prizePool))}</td><td class="px-6 py-4 text-sm text-gray-900">${escape_html(contest.currentEntries)} / ${escape_html(contest.maxEntries)} <div class="w-full bg-gray-200 rounded-full h-2 mt-1"><div class="bg-blue-600 h-2 rounded-full"${attr_style(`width: ${stringify(contest.currentEntries / contest.maxEntries * 100)}%`)}></div></div></td><td class="px-6 py-4"><span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(getStatusBadgeClass(contest.status))}`)}>${escape_html(contest.status)}</span></td><td class="px-6 py-4 text-sm font-medium"><div class="flex space-x-2">`);
        if (canEdit) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button class="text-blue-600 hover:text-blue-900" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button> `);
          if (contest.status === "draft") {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`<button class="text-green-600 hover:text-green-900" title="Publish"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>`);
          } else {
            $$payload.out.push("<!--[!-->");
            if (contest.status === "published") {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`<button class="text-orange-600 hover:text-orange-900" title="Lock"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></button>`);
            } else {
              $$payload.out.push("<!--[!-->");
            }
            $$payload.out.push(`<!--]-->`);
          }
          $$payload.out.push(`<!--]--> <button class="text-purple-600 hover:text-purple-900" title="Clone"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--> `);
        if (canDelete) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button class="text-red-600 hover:text-red-900" title="Delete" aria-label="Delete contest"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div></td></tr>`);
      }
      $$payload.out.push(`<!--]--></tbody></table></div> `);
      if (totalPages > 1) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"><div class="flex items-center justify-between"><div class="flex-1 flex justify-between sm:hidden"><button${attr("disabled", currentPage === 1, true)} class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button></div> <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"><div><p class="text-sm text-gray-700">Showing <span class="font-medium">${escape_html((currentPage - 1) * pageSize + 1)}</span> to <span class="font-medium">${escape_html(Math.min(currentPage * pageSize, totalContests))}</span> of <span class="font-medium">${escape_html(totalContests)}</span> results</p></div> <div><nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"><button${attr("disabled", currentPage === 1, true)} class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Next</button></nav></div></div></div></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
