import { A as push, S as fallback, G as escape_html, V as bind_props, D as pop } from "./index2.js";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "clsx";
import "./state.svelte.js";
function LoginModal($$payload, $$props) {
  push();
  let isOpen = fallback($$props["isOpen"], false);
  let title = fallback($$props["title"], "Login Required");
  let message = fallback($$props["message"], "Please login to continue with this action.");
  let actionText = fallback($$props["actionText"], "Join Contest");
  if (isOpen) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="button" tabindex="0" aria-label="Close modal" aria-modal="true"><div class="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-slate-900/25 border-2 border-slate-200/60 transform transition-all duration-300 scale-100"><button type="button" aria-label="Close modal" class="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors duration-200"><svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button> <div class="w-16 h-16 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lime-400/25"><svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg></div> <div class="text-center mb-8"><h2 class="text-2xl font-black text-slate-900 mb-3">${escape_html(title)}</h2> <p class="text-slate-600 font-medium mb-2">${escape_html(message)}</p> <p class="text-sm text-slate-500">Create an account or login to ${escape_html(actionText.toLowerCase())}.</p></div> <div class="space-y-3"><button type="button" aria-label="Create account and get €1200 bonus" class="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-lime-400/25 hover:shadow-lime-500/30 hover:scale-[1.02] flex items-center justify-center space-x-2"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg> <span>Create Account &amp; Get €1200 Bonus</span></button> <button type="button" aria-label="Login to existing account" class="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 hover:border-slate-300/60 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/60 hover:scale-[1.02] flex items-center justify-center space-x-2"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span>Login to Existing Account</span></button></div> <div class="mt-6 p-4 bg-gradient-to-r from-lime-50 to-emerald-50 rounded-2xl border border-lime-200/50"><h3 class="text-sm font-bold text-slate-700 mb-2 flex items-center space-x-2"><svg class="w-4 h-4 text-lime-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> <span>Why Join PickNWin?</span></h3> <ul class="text-xs text-slate-600 space-y-1"><li class="flex items-center space-x-2"><div class="w-1.5 h-1.5 bg-lime-500 rounded-full"></div> <span>€1200 welcome bonus for new users</span></li> <li class="flex items-center space-x-2"><div class="w-1.5 h-1.5 bg-lime-500 rounded-full"></div> <span>Join contests with millions in prizes</span></li> <li class="flex items-center space-x-2"><div class="w-1.5 h-1.5 bg-lime-500 rounded-full"></div> <span>Instant withdrawals &amp; secure payments</span></li></ul></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { isOpen, title, message, actionText });
  pop();
}
export {
  LoginModal as L
};
