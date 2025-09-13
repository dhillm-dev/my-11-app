import { E as store_get, F as head, G as escape_html, I as attr_class, J as stringify, K as unsubscribe_stores, D as pop, A as push } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
import { i as isAuthenticated, u as user } from "../../chunks/teams.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "clsx";
import "../../chunks/state.svelte.js";
import { $ as $isLoading, a as $format } from "../../chunks/runtime.js";
import "../../chunks/index3.js";
import "../../chunks/button.js";
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children, data } = $$props;
  let isAuthPage = store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/auth");
  store_get($$store_subs ??= {}, "$page", page).url.pathname === "/";
  let showMobileNavigation = store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && !isAuthPage;
  let showHeader = !isAuthPage;
  !store_get($$store_subs ??= {}, "$isLoading", $isLoading) ? [
    {
      path: "/dashboard",
      label: store_get($$store_subs ??= {}, "$_", $format)("nav.home") || "Home",
      icon: "home"
    },
    { path: "/matches", label: "Matches", icon: "calendar" },
    {
      path: "/contests",
      label: store_get($$store_subs ??= {}, "$_", $format)("nav.contests") || "Contests",
      icon: "trophy"
    },
    {
      path: "/my-teams",
      label: store_get($$store_subs ??= {}, "$_", $format)("nav.my_teams") || "My Teams",
      icon: "users"
    },
    {
      path: "/wallet",
      label: store_get($$store_subs ??= {}, "$_", $format)("nav.wallet") || "Wallet",
      icon: "wallet"
    },
    {
      path: "/profile",
      label: store_get($$store_subs ??= {}, "$_", $format)("nav.profile") || "Profile",
      icon: "user"
    }
  ] : [
    { path: "/dashboard", label: "Home", icon: "home" },
    { path: "/matches", label: "Matches", icon: "calendar" },
    { path: "/contests", label: "Contests", icon: "trophy" },
    { path: "/my-teams", label: "My Teams", icon: "users" },
    { path: "/wallet", label: "Wallet", icon: "wallet" },
    { path: "/profile", label: "Profile", icon: "user" }
  ];
  function isActiveRoute(path) {
    return store_get($$store_subs ??= {}, "$page", page).url.pathname === path || store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(path + "/");
  }
  head($$payload, ($$payload2) => {
    $$payload2.out.push(`<link rel="icon" href="/favicon.ico"/> <link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/> <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-white text-slate-900">`);
  if (showHeader) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><a href="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer"><div class="relative"><div class="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl shadow-lg shadow-lime-400/25 flex items-center justify-center hover:shadow-lime-400/40 transition-shadow duration-200"><span class="text-white font-black text-lg">P</span></div></div> <h1 class="text-xl font-black text-slate-900 tracking-tight hover:text-lime-600 transition-colors duration-200">PickNWin</h1></a> <nav class="hidden md:flex items-center space-x-8"><a href="/contests" class="text-slate-600 hover:text-slate-900 font-medium transition-colors">Contests</a> <a href="/how-to-play" class="text-slate-600 hover:text-slate-900 font-medium transition-colors">How to Play</a></nav> <button class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Toggle mobile menu"><svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
    {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`);
    }
    $$payload.out.push(`<!--]--></svg></button> <div class="hidden md:flex items-center space-x-4">`);
    if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$user", user)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<a href="/wallet" class="hidden sm:flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full px-4 py-2 transition-colors"><svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"></path></svg> <span class="text-emerald-700 font-semibold">€${escape_html(store_get($$store_subs ??= {}, "$user", user).balance.toLocaleString())}</span></a> <div class="relative"><button class="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-50 transition-colors"><div class="w-8 h-8 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center"><span class="text-white font-medium text-sm">${escape_html(store_get($$store_subs ??= {}, "$user", user).name.charAt(0).toUpperCase())}</span></div> <span class="hidden sm:block text-sm font-medium text-slate-700">${escape_html(store_get($$store_subs ??= {}, "$user", user).name)}</span> <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path></svg></button> `);
      {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<div class="flex items-center space-x-3"><a href="/auth/login" class="text-slate-600 hover:text-slate-900 font-medium transition-colors">Login</a> <a href="/auth/register" class="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">Register</a></div>`);
    }
    $$payload.out.push(`<!--]--></div></div></div></header> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <main${attr_class(`min-h-screen bg-white text-slate-900 ${stringify(showMobileNavigation ? "pb-20" : "")}`)}>`);
  children($$payload);
  $$payload.out.push(`<!----></main> `);
  if (showMobileNavigation) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg md:hidden"><div class="flex items-center justify-around py-2"><a href="/dashboard"${attr_class(`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${stringify(isActiveRoute("/dashboard") ? "text-lime-600" : "text-slate-500 hover:text-slate-700")}`)}><svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.25-8.25a1.125 1.125 0 0 1 1.59 0L20.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path></svg> <span class="text-xs font-medium">Home</span></a> <a href="/contests"${attr_class(`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${stringify(isActiveRoute("/contests") ? "text-lime-600" : "text-slate-500 hover:text-slate-700")}`)}><svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.5c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v4.127c0 2.49.824 4.916 2.343 6.75l.071.108c.054.082.12.15.196.196l.108.071c.497.497 1.042.625 1.407.625.365 0 .91-.128 1.407-.625l.108-.071A8.817 8.817 0 0 0 15.75 8.627V4.5Z"></path></svg> <span class="text-xs font-medium">Contests</span></a> <a href="/wallet"${attr_class(`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${stringify(isActiveRoute("/wallet") ? "text-lime-600" : "text-slate-500 hover:text-slate-700")}`)}><svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"></path></svg> <span class="text-xs font-medium">Wallet</span></a> <a href="/profile"${attr_class(`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${stringify(isActiveRoute("/profile") ? "text-lime-600" : "text-slate-500 hover:text-slate-700")}`)}><svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path></svg> <span class="text-xs font-medium">Profile</span></a></div></nav>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
