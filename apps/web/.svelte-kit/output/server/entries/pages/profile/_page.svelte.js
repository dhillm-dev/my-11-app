import { O as ensure_array_like, F as head, G as escape_html, E as store_get, I as attr_class, J as stringify, K as unsubscribe_stores, D as pop, A as push, P as attr, Y as maybe_selected } from "../../../chunks/index2.js";
import { u as user, t as teamsStore } from "../../../chunks/teams.js";
import { g as goto } from "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let showEditProfile = false;
  let editForm = { name: "", email: "", phone: "", dateOfBirth: "", state: "" };
  const achievements = [
    {
      id: "first_team",
      title: "Team Creator",
      description: "Created your first team",
      icon: "⚽",
      unlocked: true
    },
    {
      id: "first_win",
      title: "First Victory",
      description: "Won your first contest",
      icon: "🏆",
      unlocked: true
    },
    {
      id: "big_win",
      title: "Big Winner",
      description: "Won €1000+ in a single contest",
      icon: "💰",
      unlocked: false
    },
    {
      id: "streak_5",
      title: "Hot Streak",
      description: "Won 5 contests in a row",
      icon: "🔥",
      unlocked: false
    },
    {
      id: "captain_master",
      title: "Captain Master",
      description: "Captain scored 100+ points",
      icon: "👑",
      unlocked: true
    },
    {
      id: "mega_contest",
      title: "Mega Player",
      description: "Joined a mega contest",
      icon: "🎯",
      unlocked: false
    }
  ];
  const menuItems = [
    {
      id: "edit_profile",
      title: "Edit Profile",
      icon: "👤",
      action: () => showEditProfile = true
    },
    {
      id: "kyc",
      title: "KYC Verification",
      icon: "📋",
      badge: "Pending",
      action: () => goto()
    },
    {
      id: "bank_details",
      title: "Bank Details",
      icon: "🏦",
      action: () => goto()
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "🔔",
      action: () => goto()
    },
    {
      id: "refer_earn",
      title: "Refer & Earn",
      icon: "🎁",
      badge: "€100",
      action: () => goto()
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "❓",
      action: () => goto()
    },
    {
      id: "about",
      title: "About PickNWin",
      icon: "ℹ️",
      action: () => goto()
    },
    { id: "logout", title: "Logout", icon: "🚪", action: logout }
  ];
  async function logout() {
    if (confirm("Are you sure you want to logout?")) {
      goto();
    }
  }
  function getInitials(name) {
    return name?.split(" ").map((n) => n.charAt(0)).join("").toUpperCase() || "U";
  }
  const each_array = ensure_array_like(achievements);
  const each_array_1 = ensure_array_like(menuItems);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Profile - PickNWin</title>`;
    $$payload2.out.push(`<meta name="description" content="Manage your profile and account settings"/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24"><div class="bg-gradient-to-br from-lime-400 via-lime-500 to-lime-600 text-white p-8 relative overflow-hidden"><div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div> <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div> <div class="relative z-10"><div class="flex items-center space-x-6"><div class="relative"><div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-900/20 border-2 border-white/30"><span class="text-2xl font-black">${escape_html(getInitials(store_get($$store_subs ??= {}, "$user", user)?.name || ""))}</span></div> <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-lime-400 to-green-400 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-400/25"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div></div> <div class="flex-1"><h1 class="text-3xl font-black mb-1">${escape_html(store_get($$store_subs ??= {}, "$user", user)?.name || "User")}</h1> <p class="text-emerald-100 font-medium mb-4">${escape_html(store_get($$store_subs ??= {}, "$user", user)?.email || "")}</p> <div class="flex items-center space-x-4"><div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30 shadow-lg shadow-emerald-900/10"><div class="flex items-center space-x-2"><div class="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center"><svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424z" clip-rule="evenodd"></path></svg></div> <span class="text-sm font-bold">Pro Level</span></div></div> <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30 shadow-lg shadow-emerald-900/10"><div class="flex items-center space-x-2"><div class="w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center"><svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg></div> <span class="text-sm font-bold">Rank #1,247</span></div></div></div></div></div></div></div> <div class="p-8 -mt-8 relative z-10"><div class="grid grid-cols-2 gap-6"><div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105"><div class="flex items-center space-x-4"><div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clip-rule="evenodd"></path></svg></div> <div><div class="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$teamsStore", teamsStore).userStats?.totalTeams || 0)}</div> <div class="text-sm font-semibold text-slate-600">Teams Created</div></div></div></div> <div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105"><div class="flex items-center space-x-4"><div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg></div> <div><div class="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$teamsStore", teamsStore).userStats?.contestsJoined || 0)}</div> <div class="text-sm font-semibold text-slate-600">Contests Joined</div></div></div></div> <div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105"><div class="flex items-center space-x-4"><div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clip-rule="evenodd"></path></svg></div> <div><div class="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$teamsStore", teamsStore).userStats?.contestsWon || 0)}</div> <div class="text-sm font-semibold text-slate-600">Contests Won</div></div></div></div> <div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105"><div class="flex items-center space-x-4"><div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path></svg></div> <div><div class="text-3xl font-black bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">€${escape_html(store_get($$store_subs ??= {}, "$teamsStore", teamsStore).userStats?.totalWinnings?.toLocaleString() || "0")}</div> <div class="text-sm font-semibold text-slate-600">Total Winnings</div></div></div></div></div></div> <div class="px-8 mb-8"><div class="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/50"><div class="flex items-center space-x-3 mb-6"><div class="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clip-rule="evenodd"></path></svg></div> <h2 class="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Achievements</h2></div> <div class="grid grid-cols-3 gap-4"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let achievement = each_array[$$index];
    $$payload.out.push(`<div${attr_class(`bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 text-center transition-all duration-300 hover:scale-105 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] ${stringify(achievement.unlocked ? "ring-2 ring-emerald-400/30" : "opacity-60")}`)}><div class="text-3xl mb-3">${escape_html(achievement.icon)}</div> <div class="text-sm font-bold text-slate-900 mb-1">${escape_html(achievement.title)}</div> <div class="text-xs text-slate-600 mb-3 leading-relaxed">${escape_html(achievement.description)}</div> `);
    if (achievement.unlocked) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex justify-center"><div class="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<div class="flex justify-center"><div class="w-6 h-6 bg-slate-300 rounded-xl flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="px-8 mb-8"><div class="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/50"><div class="flex items-center space-x-3 mb-6"><div class="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-600/25"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg></div> <h2 class="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Account &amp; Settings</h2></div> <div class="space-y-3"><!--[-->`);
  for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
    let item = each_array_1[index];
    $$payload.out.push(`<button${attr_class(`w-full bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-slate-200/30 border border-white/40 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:scale-[1.02] ${stringify(item.id === "logout" ? "hover:bg-red-50/80" : "hover:bg-white/80")}`)}><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div${attr_class(`w-10 h-10 ${stringify(item.id === "logout" ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-indigo-500 to-indigo-600")} rounded-2xl flex items-center justify-center shadow-lg ${stringify(item.id === "logout" ? "shadow-red-500/25" : "shadow-indigo-500/25")}`)}><span class="text-xl text-white">${escape_html(item.icon)}</span></div> <span${attr_class(`font-bold text-lg ${stringify(item.id === "logout" ? "text-red-600" : "text-slate-900")}`)}>${escape_html(item.title)}</span></div> <div class="flex items-center space-x-3">`);
    if (item.badge) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<span class="text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-2xl font-bold shadow-lg shadow-emerald-500/25">${escape_html(item.badge)}</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (item.id !== "logout") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="w-8 h-8 bg-slate-200 rounded-xl flex items-center justify-center"><svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></div></button>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="px-8 mb-8"><div class="bg-white/50 backdrop-blur-xl rounded-3xl p-6 shadow-lg shadow-slate-200/30 border border-white/40 text-center"><div class="flex items-center justify-center space-x-2 mb-2"><div class="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg></div> <p class="text-lg font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">PickNWin v1.0.0</p></div> <p class="text-sm text-slate-600 font-medium">Made with ❤️ for cricket fans</p></div></div></div> `);
  if (showEditProfile) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50"><div class="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl w-full rounded-t-3xl p-8 max-h-[80vh] overflow-y-auto shadow-2xl shadow-slate-900/20 border-t border-white/50"><div class="flex items-center justify-between mb-8"><div class="flex items-center space-x-3"><div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div> <h2 class="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Edit Profile</h2></div> <button class="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/30 border border-white/40 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:scale-105 text-slate-600 hover:text-slate-900"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <form class="space-y-6"><div><label class="block text-sm font-bold text-slate-800 mb-3">Full Name</label> <input type="text"${attr("value", editForm.name)} required class="w-full p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-xl focus:shadow-emerald-500/10 transition-all duration-300 font-medium text-slate-900 placeholder-slate-500"/></div> <div><label class="block text-sm font-bold text-slate-800 mb-3">Email</label> <input type="email"${attr("value", editForm.email)} required class="w-full p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-xl focus:shadow-emerald-500/10 transition-all duration-300 font-medium text-slate-900 placeholder-slate-500"/></div> <div><label class="block text-sm font-bold text-slate-800 mb-3">Phone Number</label> <input type="tel"${attr("value", editForm.phone)} class="w-full p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-xl focus:shadow-emerald-500/10 transition-all duration-300 font-medium text-slate-900 placeholder-slate-500"/></div> <div><label class="block text-sm font-bold text-slate-800 mb-3">Date of Birth</label> <input type="date"${attr("value", editForm.dateOfBirth)} class="w-full p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-xl focus:shadow-emerald-500/10 transition-all duration-300 font-medium text-slate-900 placeholder-slate-500"/></div> <div><label for="state-select" class="block text-sm font-bold text-slate-800 mb-3">State</label> <select id="state-select" class="w-full p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-xl focus:shadow-emerald-500/10 transition-all duration-300 font-medium text-slate-900">`);
    $$payload.select_value = editForm.state;
    $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Select State</option><option value="andhra-pradesh"${maybe_selected($$payload, "andhra-pradesh")}>Andhra Pradesh</option><option value="arunachal-pradesh"${maybe_selected($$payload, "arunachal-pradesh")}>Arunachal Pradesh</option><option value="assam"${maybe_selected($$payload, "assam")}>Assam</option><option value="bihar"${maybe_selected($$payload, "bihar")}>Bihar</option><option value="chhattisgarh"${maybe_selected($$payload, "chhattisgarh")}>Chhattisgarh</option><option value="goa"${maybe_selected($$payload, "goa")}>Goa</option><option value="gujarat"${maybe_selected($$payload, "gujarat")}>Gujarat</option><option value="haryana"${maybe_selected($$payload, "haryana")}>Haryana</option><option value="himachal-pradesh"${maybe_selected($$payload, "himachal-pradesh")}>Himachal Pradesh</option><option value="jharkhand"${maybe_selected($$payload, "jharkhand")}>Jharkhand</option><option value="karnataka"${maybe_selected($$payload, "karnataka")}>Karnataka</option><option value="kerala"${maybe_selected($$payload, "kerala")}>Kerala</option><option value="madhya-pradesh"${maybe_selected($$payload, "madhya-pradesh")}>Madhya Pradesh</option><option value="maharashtra"${maybe_selected($$payload, "maharashtra")}>Maharashtra</option><option value="manipur"${maybe_selected($$payload, "manipur")}>Manipur</option><option value="meghalaya"${maybe_selected($$payload, "meghalaya")}>Meghalaya</option><option value="mizoram"${maybe_selected($$payload, "mizoram")}>Mizoram</option><option value="nagaland"${maybe_selected($$payload, "nagaland")}>Nagaland</option><option value="odisha"${maybe_selected($$payload, "odisha")}>Odisha</option><option value="punjab"${maybe_selected($$payload, "punjab")}>Punjab</option><option value="rajasthan"${maybe_selected($$payload, "rajasthan")}>Rajasthan</option><option value="sikkim"${maybe_selected($$payload, "sikkim")}>Sikkim</option><option value="tamil-nadu"${maybe_selected($$payload, "tamil-nadu")}>Tamil Nadu</option><option value="telangana"${maybe_selected($$payload, "telangana")}>Telangana</option><option value="tripura"${maybe_selected($$payload, "tripura")}>Tripura</option><option value="uttar-pradesh"${maybe_selected($$payload, "uttar-pradesh")}>Uttar Pradesh</option><option value="uttarakhand"${maybe_selected($$payload, "uttarakhand")}>Uttarakhand</option><option value="west-bengal"${maybe_selected($$payload, "west-bengal")}>West Bengal</option><option value="delhi"${maybe_selected($$payload, "delhi")}>Delhi</option>`);
    $$payload.select_value = void 0;
    $$payload.out.push(`</select></div> <div class="flex space-x-4 pt-6"><button type="button" class="flex-1 py-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:scale-105 font-bold text-slate-700 hover:text-slate-900">Cancel</button> <button type="submit" class="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 font-bold">Save Changes</button></div></form></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
