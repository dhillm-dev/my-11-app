import { E as store_get, F as head, P as attr, K as unsubscribe_stores, D as pop, A as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { p as page } from "../../../../chunks/stores.js";
import { a as isLoading } from "../../../../chunks/teams.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let email = "demo@picknwin.com";
  let password = "demo123";
  store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("returnTo");
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Login - PickNWin</title>`;
    $$payload2.out.push(`<meta name="description" content="Login to your PickNWin account"/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4"><div class="w-full max-w-md"><div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 p-8 space-y-8"><div class="text-center space-y-3"><div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl shadow-lg shadow-lime-400/25 mb-4 animate-pulse"><svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div> <h1 class="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Welcome Back</h1> <p class="text-slate-500 font-medium">Sign in to continue your fantasy journey</p></div> <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100/60 rounded-2xl p-5 shadow-lg shadow-blue-100/50"><div class="flex items-start space-x-4"><div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-400/25"><svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg></div> <div class="flex-1"><h4 class="text-sm font-bold text-blue-800 mb-1">Demo Account Ready</h4> <p class="text-sm text-blue-700 leading-relaxed">Use <span class="font-bold bg-blue-100 px-2 py-0.5 rounded-lg">demo@picknwin.com</span> / <span class="font-bold bg-blue-100 px-2 py-0.5 rounded-lg">demo123</span></p></div></div></div> <form class="space-y-6"><div class="space-y-3"><label for="email" class="text-sm font-bold text-slate-700 flex items-center space-x-2"><svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg> <span>Email Address</span></label> <div class="relative"><input id="email" type="email"${attr("value", email)} placeholder="Enter your email address"${attr("disabled", store_get($$store_subs ??= {}, "$isLoading", isLoading), true)} class="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-400/20 focus:border-lime-400 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 placeholder-slate-400"/></div></div> <div class="space-y-3"><label for="password" class="text-sm font-bold text-slate-700 flex items-center space-x-2"><svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> <span>Password</span></label> <div class="relative"><input id="password" type="password"${attr("value", password)} placeholder="Enter your password"${attr("disabled", store_get($$store_subs ??= {}, "$isLoading", isLoading), true)} class="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-400/20 focus:border-lime-400 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 placeholder-slate-400"/></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <button type="submit"${attr("disabled", store_get($$store_subs ??= {}, "$isLoading", isLoading), true)} class="w-full px-6 py-4 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black font-bold rounded-2xl shadow-xl shadow-lime-400/30 hover:shadow-lime-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-blue-400/30">`);
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center justify-center space-x-3"><svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span class="text-lg">Signing In...</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<span class="text-lg">Sign In to Continue</span>`);
  }
  $$payload.out.push(`<!--]--></button></form> <div class="relative my-8"><div class="absolute inset-0 flex items-center"><div class="w-full border-t-2 border-slate-200/60"></div></div> <div class="relative flex justify-center"><span class="bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-slate-500 rounded-xl shadow-lg shadow-slate-200/50">or</span></div></div> <div class="text-center space-y-5"><p class="text-sm text-slate-600">Don't have an account? <a href="/auth/register" class="font-bold text-lime-600 hover:text-lime-700 transition-colors duration-200 ml-1">Create Account</a></p> <a href="/auth/forgot" class="inline-block text-sm text-slate-500 hover:text-lime-600 font-medium transition-colors duration-200 hover:scale-105 transform">Forgot your password?</a></div></div></div></div> `);
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
