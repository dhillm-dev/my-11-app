import { E as store_get, O as ensure_array_like, F as head, P as attr, Q as maybe_selected, G as escape_html, I as attr_class, J as stringify, K as unsubscribe_stores, D as pop, A as push } from "../../../../chunks/index2.js";
import { a as adminAuthStore } from "../../../../chunks/admin.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let canEdit, canDelete, canCreate, canImport, filteredPlayers, paginatedPlayers, totalPages;
  let players = [];
  let searchTerm = "";
  let selectedPosition = "";
  let selectedTeam = "";
  let currentPage = 1;
  let itemsPerPage = 20;
  const positions = [
    { label: "Goalkeeper", value: "GK" },
    { label: "Defender", value: "DEF" },
    { label: "Midfielder", value: "MID" },
    { label: "Forward", value: "FWD" }
  ];
  const teams = [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Tottenham"
  ];
  function getInjuryStatusColor(status) {
    switch (status) {
      case "fit":
        return "bg-green-100 text-green-800";
      case "injured":
        return "bg-red-100 text-red-800";
      case "doubtful":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  canEdit = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).permissions.players?.update ?? false;
  canDelete = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).permissions.players?.delete ?? false;
  canCreate = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).permissions.players?.create ?? false;
  canImport = store_get($$store_subs ??= {}, "$adminAuthStore", adminAuthStore).permissions.players?.create ?? false;
  filteredPlayers = players.filter((player) => {
    const matchesTeam = !selectedTeam;
    return matchesTeam;
  });
  paginatedPlayers = filteredPlayers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const each_array = ensure_array_like(positions);
  const each_array_1 = ensure_array_like(teams);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Players Management - Dream11 Admin</title>`;
  });
  $$payload.out.push(`<div class="p-6"><div class="flex justify-between items-center mb-6"><div><h1 class="text-2xl font-bold text-gray-900">Players</h1> <p class="text-gray-600">Manage football players and their stats</p></div> <div class="flex space-x-3">`);
  if (canImport) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Bulk Import</button>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Export CSV</button> `);
  if (canCreate) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Add Player</button>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-white p-4 rounded-lg shadow mb-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Search</label> <input${attr("value", searchTerm)} type="text" placeholder="Search players or teams..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"/></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Position</label> <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">`);
  $$payload.select_value = selectedPosition;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>All Positions</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let position = each_array[$$index];
    $$payload.out.push(`<option${attr("value", position)}${maybe_selected($$payload, position)}>${escape_html(position)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Team</label> <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">`);
  $$payload.select_value = selectedTeam;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>All Teams</option><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let team = each_array_1[$$index_1];
    $$payload.out.push(`<option${attr("value", team)}${maybe_selected($$payload, team)}>${escape_html(team)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div class="flex items-end"><button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Clear Filters</button></div></div></div> <div class="bg-white rounded-lg shadow overflow-hidden">`);
  {
    $$payload.out.push("<!--[!-->");
    if (paginatedPlayers.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="p-8 text-center"><p class="text-gray-500">No players found</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_2 = ensure_array_like(paginatedPlayers);
      $$payload.out.push(`<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let player = each_array_2[$$index_2];
        $$payload.out.push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${escape_html(player.name)}</div> <div class="text-xs text-gray-500">ID: ${escape_html(player.id)}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escape_html(player.team)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escape_html(player.position)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${escape_html(player.price.toFixed(1))}M</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escape_html(player.points)}</td><td class="px-6 py-4 whitespace-nowrap"><div class="flex flex-col space-y-1"><span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(player.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}`)}>${escape_html(player.isActive ? "Active" : "Inactive")}</span> <span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(getInjuryStatusColor(player.injuryStatus || "healthy"))}`)}>${escape_html(player.injuryStatus || "Healthy")}</span></div></td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex justify-end space-x-2">`);
        if (canEdit) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button class="text-blue-600 hover:text-blue-900">Edit</button>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--> `);
        if (canDelete) {
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
        $$payload.out.push(`<div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"><div class="flex items-center justify-between"><div class="text-sm text-gray-700">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredPlayers.length))} of ${escape_html(filteredPlayers.length)} results</div> <div class="flex space-x-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Previous</button> <span class="px-3 py-1 text-sm">Page ${escape_html(currentPage)} of ${escape_html(totalPages)}</span> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Next</button></div></div></div>`);
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
  $$payload.out.push(`<!--]--> `);
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
