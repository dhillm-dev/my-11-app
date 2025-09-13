import { O as ensure_array_like, E as store_get, F as head, G as escape_html, I as attr_class, J as stringify, K as unsubscribe_stores, D as pop, A as push } from "../../../chunks/index2.js";
import { w as walletStore } from "../../../chunks/teams.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "clsx";
import "../../../chunks/state.svelte.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  function getTransactionIcon(type) {
    switch (type) {
      case "add_money":
        return "💰";
      case "contest_entry":
        return "🎯";
      case "contest_win":
        return "🏆";
      case "refund":
        return "↩️";
      case "bonus":
        return "🎁";
      default:
        return "💳";
    }
  }
  function getTransactionColor(type) {
    switch (type) {
      case "add_money":
      case "contest_win":
      case "refund":
      case "bonus":
        return "text-emerald-600";
      case "contest_entry":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  }
  function formatTransactionTitle(transaction) {
    switch (transaction.type) {
      case "add_money":
        return "Money Added";
      case "contest_entry":
        return `Contest Entry - ${transaction.description}`;
      case "contest_win":
        return `Contest Win - ${transaction.description}`;
      case "refund":
        return `Refund - ${transaction.description}`;
      case "bonus":
        return `Bonus - ${transaction.description}`;
      default:
        return transaction.description;
    }
  }
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$walletStore", walletStore).transactions || []);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Wallet - PickNWin</title>`;
    $$payload2.out.push(`<meta name="description" content="Manage your wallet balance and transactions"/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 pb-20"><div class="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 p-4 shadow-lg shadow-slate-200/50"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-400/25"><svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"></path></svg></div> <h1 class="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">My Wallet</h1></div> <button aria-label="Go to profile" class="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:shadow-slate-300/60 transition-all duration-300 hover:scale-105"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></button></div></div> <div class="p-4"><div class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02]">relative overflow-hidden"> <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lime-400/20 to-lime-500/20 rounded-full -translate-y-16 translate-x-16"></div> <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-lime-400/20 to-emerald-500/20 rounded-full translate-y-12 -translate-x-12"></div> <div class="relative z-10"><div class="flex items-center justify-between mb-6"><div><div class="flex items-center space-x-2 mb-2"><div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div> <p class="text-slate-600 text-sm font-bold">Available Balance</p></div> <p class="text-4xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">€${escape_html(store_get($$store_subs ??= {}, "$walletStore", walletStore).balance?.toLocaleString() || "0")}</p></div> <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-400/25"><svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"></path></svg></div></div> <div class="grid grid-cols-2 gap-4"><div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30"><div class="flex items-center space-x-2 mb-2"><svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <p class="text-slate-600 text-xs font-bold">Bonus Cash</p></div> <p class="text-xl font-black text-slate-900">€${escape_html(store_get($$store_subs ??= {}, "$walletStore", walletStore).bonusBalance?.toLocaleString() || "0")}</p></div> <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30"><div class="flex items-center space-x-2 mb-2"><svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> <p class="text-slate-600 text-xs font-bold">Winnings</p></div> <p class="text-xl font-black text-slate-900">€${escape_html(store_get($$store_subs ??= {}, "$walletStore", walletStore).winningsBalance?.toLocaleString() || "0")}</p></div></div></div></div></div> <div class="px-4 mb-6"><div class="grid grid-cols-2 gap-4"><button class="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105 group relative overflow-hidden"><div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div> <div class="relative z-10"><div class="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-lime-400/25 group-hover:scale-110 transition-transform duration-300"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path></svg></div> <div class="text-lg font-black text-slate-900 mb-1">Add Money</div> <div class="text-sm font-bold text-slate-600">Instant &amp; Secure</div></div></button> <button class="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105 group relative overflow-hidden"><div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div> <div class="relative z-10"><div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-400/25 group-hover:scale-110 transition-transform duration-300"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg></div> <div class="text-lg font-black text-slate-900 mb-1">Withdraw</div> <div class="text-sm font-bold text-slate-600">To Bank Account</div></div></button></div></div> <div class="px-4"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">Recent Transactions</h2> <button class="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 text-emerald-600 text-sm font-bold hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-105">View All</button></div> <div class="space-y-4"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let transaction = each_array[$$index];
    $$payload.out.push(`<div class="bg-white/60 backdrop-blur-sm p-5 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"><div${attr_class(`absolute top-0 right-0 w-20 h-20 ${stringify(transaction.type === "contest_entry" ? "bg-gradient-to-br from-red-400/20 to-red-600/20" : "bg-gradient-to-br from-emerald-400/20 to-emerald-600/20")} rounded-full -translate-y-10 translate-x-10`)}></div> <div class="relative z-10 flex items-center justify-between"><div class="flex items-center space-x-4"><div${attr_class(`w-12 h-12 ${stringify(transaction.type === "contest_entry" ? "bg-gradient-to-br from-red-400 to-red-600" : "bg-gradient-to-br from-emerald-400 to-emerald-600")} rounded-2xl flex items-center justify-center shadow-lg ${stringify(transaction.type === "contest_entry" ? "shadow-red-400/25" : "shadow-emerald-400/25")}`)}><span class="text-lg">${escape_html(getTransactionIcon(transaction.type))}</span></div> <div><h3 class="font-black text-slate-900 text-lg">${escape_html(formatTransactionTitle(transaction))}</h3> <div class="flex items-center space-x-2"><div class="w-2 h-2 bg-slate-400 rounded-full"></div> <p class="text-sm font-bold text-slate-600">${escape_html(new Date(transaction.createdAt).toLocaleDateString())}</p></div></div></div> <div class="text-right"><div${attr_class(`text-xl font-black ${stringify(getTransactionColor(transaction.type))}`)}>${escape_html(transaction.type === "contest_entry" ? "-" : "+")}€${escape_html(Math.abs(transaction.amount).toLocaleString())}</div> <div class="text-xs font-bold text-slate-500 capitalize bg-slate-100 px-2 py-1 rounded-full mt-1">${escape_html(transaction.status)}</div></div></div></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  if (!store_get($$store_subs ??= {}, "$walletStore", walletStore).transactions || store_get($$store_subs ??= {}, "$walletStore", walletStore).transactions.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] border border-slate-100/30 text-center relative overflow-hidden"><div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-full -translate-y-12 translate-x-12"></div> <div class="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-slate-300/20 to-slate-500/20 rounded-full translate-y-10 -translate-x-10"></div> <div class="relative z-10"><div class="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-slate-400/25"><svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path></svg></div> <h3 class="text-xl font-black text-slate-900 mb-2">No transactions yet</h3> <p class="text-slate-600 font-bold mb-6">Your transaction history will appear here</p> <button class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105">Add Money Now</button></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
