import { _ as copy_payload, $ as assign_payload, D as pop, A as push, O as ensure_array_like, F as head, G as escape_html, T as attr_style, I as attr_class, P as attr, J as stringify } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "../../../chunks/state.svelte.js";
import "../../../chunks/teams.js";
import "../../../chunks/runtime.js";
import { L as LoginModal } from "../../../chunks/LoginModal.js";
function _page($$payload, $$props) {
  push();
  let availablePlayers = [];
  let selectedPlayers = [];
  let captain = null;
  let viceCaptain = null;
  let teamName = "";
  let credits = 100;
  let usedCredits = 0;
  let activeTab = "GK";
  let showLoginModal = false;
  let loginModalConfig = {
    title: "Login Required",
    message: "Please login to build your dream team.",
    actionText: "Build Team"
  };
  const playerTypes = [
    { key: "GK", label: "Goalkeeper", min: 1, max: 1 },
    { key: "DEF", label: "Defender", min: 3, max: 5 },
    { key: "MID", label: "Midfielder", min: 3, max: 5 },
    { key: "FWD", label: "Forward", min: 1, max: 3 }
  ];
  function getPlayersByType(type) {
    return availablePlayers.filter((player) => player.position === type);
  }
  function getSelectedPlayersByType(type) {
    return selectedPlayers.filter((player) => player.position === type);
  }
  function getPlayerTeamName(player) {
    return "";
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const each_array = ensure_array_like(playerTypes);
    const each_array_1 = ensure_array_like(getPlayersByType(activeTab));
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Team Builder - PickNWin</title>`;
      $$payload3.out.push(`<meta name="description" content="Build your fantasy cricket team and compete"/>`);
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 pb-20"><div class="bg-white/80 backdrop-blur-sm border-b-2 border-slate-200/60 p-6 shadow-xl shadow-slate-200/50"><div class="flex items-center justify-between mb-4"><button class="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 hover:scale-105 transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-slate-900 group"><svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button> <div class="text-center"><h1 class="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Create Team</h1> <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto mt-2"></div></div> <div class="w-12"></div></div> `);
    {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--></div> <div class="bg-white/80 backdrop-blur-sm border-b-2 border-slate-200/60 p-6 shadow-xl shadow-slate-200/50"><div class="grid grid-cols-3 gap-4 mb-6"><div class="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 p-4 text-center hover:scale-105 transition-transform duration-300"><div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-400/25"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg></div> <div class="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">${escape_html(selectedPlayers.length)}/11</div> <div class="text-xs font-bold text-slate-600">Players</div> <div class="mt-2"><div class="w-full bg-slate-200 rounded-full h-2"><div class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(selectedPlayers.length / 11 * 100)}%`)}></div></div></div></div> <div class="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 p-4 text-center hover:scale-105 transition-transform duration-300"><div class="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-lime-400/25"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"></path></svg></div> <div class="text-2xl font-black bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">${escape_html(credits - usedCredits)}</div> <div class="text-xs font-bold text-slate-600">Credits Left</div> <div class="mt-2"><div class="w-full bg-slate-200 rounded-full h-2"><div class="bg-gradient-to-r from-lime-400 to-lime-500 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify((credits - usedCredits) / credits * 100)}%`)}></div></div></div></div> <div class="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 shadow-xl shadow-slate-200/50 p-4 text-center hover:scale-105 transition-transform duration-300"><div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-400/25"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg></div> <div class="text-lg font-black text-slate-900 flex items-center justify-center space-x-2"><span${attr_class("text-slate-400")}>👑</span> <span${attr_class("text-slate-400")}>🥈</span></div> <div class="text-xs font-bold text-slate-600">Captain/VC</div> <div class="mt-2 flex items-center justify-center space-x-1"><span${attr_class(`text-xs font-bold px-2 py-1 rounded-full ${stringify("text-slate-400 bg-slate-100")}`)}>C</span> <span${attr_class(`text-xs font-bold px-2 py-1 rounded-full ${stringify("text-slate-400 bg-slate-100")}`)}>VC</span></div></div></div> <div class="mb-4"><div class="relative"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path></svg></div> <input type="text"${attr("value", teamName)} placeholder="Enter team name" maxlength="20" class="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 font-medium text-slate-900 placeholder-slate-500"/></div></div></div> <div class="bg-white/80 backdrop-blur-sm border-b-2 border-slate-200/60 p-4 shadow-xl shadow-slate-200/50"><div class="grid grid-cols-2 sm:grid-cols-4 gap-2"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let type = each_array[$$index];
      $$payload2.out.push(`<button${attr_class(`px-4 py-4 text-sm font-black text-center rounded-3xl transition-all duration-300 border-2 shadow-lg hover:scale-105 ${stringify(activeTab === type.key ? "border-emerald-500/60 text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-400/25" : "border-slate-200/60 text-slate-600 bg-white/70 backdrop-blur-sm shadow-slate-200/50 hover:text-slate-900 hover:border-slate-300/60 hover:shadow-slate-300/60")}`)}><div class="flex items-center justify-center space-x-2"><span>${escape_html(type.label)}</span> <span${attr_class(`text-xs px-3 py-1 rounded-full font-bold ${stringify(activeTab === type.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}`)}>${escape_html(getSelectedPlayersByType(type.key).length)}/${escape_html(type.max)}</span></div> <div class="mt-1"><div${attr_class(`w-full bg-slate-200 rounded-full h-1 ${stringify(activeTab === type.key ? "bg-white/20" : "")}`)}><div${attr_class(`h-1 rounded-full transition-all duration-300 ${stringify(activeTab === type.key ? "bg-white" : "bg-gradient-to-r from-emerald-400 to-green-500")}`)}${attr_style(`width: ${stringify(getSelectedPlayersByType(type.key).length / type.max * 100)}%`)}></div></div></div></button>`);
    }
    $$payload2.out.push(`<!--]--></div></div> <div class="p-6"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let player = each_array_1[$$index_1];
      const isSelected = selectedPlayers.find((p) => p.id === player.id);
      const isCaptain = captain?.id === player.id;
      const isViceCaptain = viceCaptain?.id === player.id;
      $$payload2.out.push(`<div${attr_class(`bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 mb-4 overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 hover:scale-[1.02] ${stringify(isSelected ? "ring-4 ring-emerald-500/30 border-emerald-400/60" : "")}`)}><div class="p-6"><div class="flex items-center justify-between"><div class="flex-1"><div class="flex items-center space-x-4"><div class="relative"><div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/25"><span class="text-xl font-black text-white">${escape_html(player.name.charAt(0))}</span></div> `);
      if (isSelected) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--> `);
      if (isCaptain) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="absolute -top-3 -left-1 text-2xl">👑</div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--> `);
      if (isViceCaptain) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="absolute -top-3 -left-1 text-xl">🥈</div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--></div> <div class="flex-1"><h3 class="font-black text-lg text-slate-900">${escape_html(player.name)}</h3> <div class="text-sm font-bold text-slate-600 flex items-center space-x-2 mt-1"><span class="bg-slate-100 px-3 py-1 rounded-full">${escape_html(getPlayerTeamName())}</span> <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">${escape_html(player.position)}</span></div> <div class="text-sm font-bold text-emerald-600 mt-2 flex items-center space-x-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"></path></svg> <span>${escape_html(player.credits)} Credits</span></div></div></div></div> <div class="flex items-center space-x-3"><button class="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-purple-300/60 hover:scale-105 transition-all duration-300 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:border-purple-400/60" title="AI Analysis"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></button> <button${attr_class(`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg ${stringify(isSelected ? "border-emerald-500/60 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-400/25" : "border-slate-300/60 bg-white/70 backdrop-blur-sm text-slate-600 hover:border-emerald-500/60 hover:text-emerald-600 shadow-slate-200/50 hover:shadow-emerald-300/60")}`)}>`);
      if (isSelected) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>`);
      }
      $$payload2.out.push(`<!--]--></button></div></div> `);
      if (isSelected) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="mt-6 pt-4 border-t-2 border-slate-100/60"><div class="flex space-x-3"><button${attr_class(`flex-1 py-3 px-4 rounded-2xl text-sm font-black transition-all duration-300 hover:scale-105 shadow-lg border-2 ${stringify(isCaptain ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400/60 shadow-yellow-400/25" : "bg-white/70 backdrop-blur-sm text-slate-700 border-slate-200/60 shadow-slate-200/50 hover:border-yellow-400/60 hover:text-yellow-600 hover:shadow-yellow-300/60")}`)}><div class="flex items-center justify-center space-x-2"><span>👑</span> <span>${escape_html(isCaptain ? "Captain" : "Make Captain")}</span></div></button> <button${attr_class(`flex-1 py-3 px-4 rounded-2xl text-sm font-black transition-all duration-300 hover:scale-105 shadow-lg border-2 ${stringify(isViceCaptain ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-400/60 shadow-blue-400/25" : "bg-white/70 backdrop-blur-sm text-slate-700 border-slate-200/60 shadow-slate-200/50 hover:border-blue-400/60 hover:text-blue-600 hover:shadow-blue-300/60")}`)}><div class="flex items-center justify-center space-x-2"><span>🥈</span> <span>${escape_html(isViceCaptain ? "Vice Captain" : "Make VC")}</span></div></button></div></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--></div></div>`);
    }
    $$payload2.out.push(`<!--]--> `);
    if (getPlayersByType(activeTab).length === 0) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="text-center py-8"><p class="text-slate-600">No ${escape_html(playerTypes.find((t) => t.key === activeTab)?.label)}s available</p></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--></div> <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t-2 border-slate-200/60 p-6 shadow-2xl shadow-slate-300/50"><div class="max-w-md mx-auto"><button${attr("disabled", selectedPlayers.length !== 11 || !captain, true)} class="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-6 rounded-3xl font-black text-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-400/25 hover:shadow-emerald-500/30 hover:scale-[1.02] border-2 border-emerald-400/20 disabled:hover:scale-100"><div class="flex items-center justify-center space-x-3"><div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">`);
    if (selectedPlayers.length !== 11) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>`);
    } else {
      $$payload2.out.push("<!--[!-->");
      {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<span class="text-lg">👑</span>`);
      }
      $$payload2.out.push(`<!--]-->`);
    }
    $$payload2.out.push(`<!--]--></div> <span>`);
    if (selectedPlayers.length !== 11) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`Select ${escape_html(11 - selectedPlayers.length)} more player${escape_html(11 - selectedPlayers.length !== 1 ? "s" : "")}`);
    } else {
      $$payload2.out.push("<!--[!-->");
      {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`Select Captain`);
      }
      $$payload2.out.push(`<!--]-->`);
    }
    $$payload2.out.push(`<!--]--></span> <div class="flex items-center space-x-1"><span class="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">✨ Ready</span></div></div></button> <div class="mt-4 flex items-center justify-center space-x-4 text-sm font-bold text-slate-600"><div class="flex items-center space-x-2"><div${attr_class(`w-3 h-3 rounded-full ${stringify(selectedPlayers.length === 11 ? "bg-emerald-500" : "bg-slate-300")}`)}></div> <span>11 Players</span></div> <div class="flex items-center space-x-2"><div${attr_class(`w-3 h-3 rounded-full ${stringify("bg-slate-300")}`)}></div> <span>Captain</span></div> <div class="flex items-center space-x-2"><div${attr_class(`w-3 h-3 rounded-full ${stringify("bg-slate-300")}`)}></div> <span>Vice Captain</span></div> <div class="flex items-center space-x-2"><div${attr_class(`w-3 h-3 rounded-full ${stringify(teamName.trim() ? "bg-purple-500" : "bg-slate-300")}`)}></div> <span>Team Name</span></div></div></div></div></div> `);
    {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> `);
    LoginModal($$payload2, {
      title: loginModalConfig.title,
      message: loginModalConfig.message,
      actionText: loginModalConfig.actionText,
      get isOpen() {
        return showLoginModal;
      },
      set isOpen($$value) {
        showLoginModal = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]-->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
