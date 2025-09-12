import { E as store_get, O as ensure_array_like, F as head, P as attr, Q as maybe_selected, G as escape_html, I as attr_class, J as stringify, K as unsubscribe_stores, D as pop, A as push } from "../../../../chunks/index2.js";
import { a as adminAuthStore } from "../../../../chunks/admin.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let canEdit, canDelete, filteredUsers, paginatedUsers, totalPages;
  let users = [];
  let searchTerm = "";
  let selectedKycStatus = "";
  let selectedRole = "";
  let showBanned = false;
  let currentPage = 1;
  let itemsPerPage = 20;
  const kycStatuses = ["pending", "verified", "rejected"];
  const userRoles = ["user", "admin", "moderator", "viewer", "superadmin"];
  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
  function getKycStatusColor(status) {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  function getRoleColor(role) {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "moderator":
        return "bg-indigo-100 text-indigo-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-green-100 text-green-800";
    }
  }
  canEdit = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).permissions.users?.update ?? false;
  canDelete = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).permissions.users?.delete ?? false;
  store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "superadmin" || store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).session?.user.role === "admin";
  filteredUsers = users.filter((user) => {
    return !showBanned;
  });
  paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const each_array = ensure_array_like(
    // Mock data - in real app this would come from API
    kycStatuses
  );
  const each_array_1 = ensure_array_like(userRoles);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Users Management - Dream11 Admin</title>`;
  });
  $$payload.out.push(`<div class="p-6"><div class="flex justify-between items-center mb-6"><div><h1 class="text-2xl font-bold text-gray-900">Users</h1> <p class="text-gray-600">Manage user accounts, KYC status, and wallet information</p></div> <div class="flex space-x-3"><button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Export CSV</button></div></div> <div class="bg-white p-4 rounded-lg shadow mb-6"><div class="grid grid-cols-1 md:grid-cols-5 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Search</label> <input${attr("value", searchTerm)} type="text" placeholder="Search name or email..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"/></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">KYC Status</label> <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">`);
  $$payload.select_value = selectedKycStatus;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>All Statuses</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let status = each_array[$$index];
    $$payload.out.push(`<option${attr("value", status)}${maybe_selected($$payload, status)}>${escape_html(status)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Role</label> <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">`);
  $$payload.select_value = selectedRole;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>All Roles</option><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let role = each_array_1[$$index_1];
    $$payload.out.push(`<option${attr("value", role)}${maybe_selected($$payload, role)}>${escape_html(role)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div class="flex items-end"><label class="flex items-center"><input${attr("checked", showBanned, true)} type="checkbox" class="mr-2"/> <span class="text-sm font-medium text-gray-700">Show Banned Only</span></label></div> <div class="flex items-end"><button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Clear Filters</button></div></div></div> <div class="bg-white rounded-lg shadow overflow-hidden">`);
  {
    $$payload.out.push("<!--[!-->");
    if (paginatedUsers.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="p-8 text-center"><p class="text-gray-500">No users found</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_2 = ensure_array_like(paginatedUsers);
      $$payload.out.push(`<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let user = each_array_2[$$index_2];
        $$payload.out.push(`<tr${attr_class(`hover:bg-gray-50 ${stringify(user.isBanned ? "bg-red-50" : "")}`)}><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="flex-shrink-0 h-10 w-10"><div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"><span class="text-sm font-medium text-gray-700">${escape_html(user.name.charAt(0).toUpperCase())}</span></div></div> <div class="ml-4"><div class="text-sm font-medium text-gray-900">${escape_html(user.name)}</div> <div class="text-sm text-gray-500">${escape_html(user.email)}</div> <div class="text-xs text-gray-400">ID: ${escape_html(user.id)}</div></div></div></td><td class="px-6 py-4 whitespace-nowrap"><span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(getRoleColor(user.role || "user"))}`)}>${escape_html(user.role || "user")}</span></td><td class="px-6 py-4 whitespace-nowrap"><span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(getKycStatusColor(user.kycStatus))}`)}>${escape_html(user.kycStatus)}</span> `);
        if (user.kycStatus === "pending" && canEdit) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="mt-1 flex space-x-1"><button class="text-xs text-green-600 hover:text-green-800">Approve</button> <span class="text-xs text-gray-400">|</span> <button class="text-xs text-red-600 hover:text-red-800">Reject</button></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><div class="text-sm font-medium">₹${escape_html(user.walletBalance.toLocaleString())}</div> <div class="text-xs text-gray-500">↗ ₹${escape_html(user.totalDeposits.toLocaleString())} | ↙ ₹${escape_html(user.totalWithdrawals.toLocaleString())}</div></td><td class="px-6 py-4 whitespace-nowrap">`);
        if (user.isBanned) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Banned</span>`);
        } else {
          $$payload.out.push("<!--[!-->");
          $$payload.out.push(`<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>`);
        }
        $$payload.out.push(`<!--]--> <div class="text-xs text-gray-500 mt-1">Last: ${escape_html(formatDate(user.lastLoginAt))}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escape_html(formatDate(user.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex justify-end space-x-2"><button class="text-blue-600 hover:text-blue-900">View</button> `);
        if (canDelete && user.role !== "superadmin") {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button class="text-red-600 hover:text-red-900">Delete</button>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div></td></tr>`);
      }
      $$payload.out.push(`<!--]--></tbody></table></div> `);
      if (totalPages > 1) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"><div class="flex items-center justify-between"><div class="text-sm text-gray-700">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredUsers.length))} of ${escape_html(filteredUsers.length)} results</div> <div class="flex space-x-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Previous</button> <span class="px-3 py-1 text-sm">Page ${escape_html(currentPage)} of ${escape_html(totalPages)}</span> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Next</button></div></div></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
