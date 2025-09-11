import { F as head, P as attr, D as pop, A as push } from "../../../../chunks/index2.js";
import "clsx";
function _page($$payload, $$props) {
  push();
  let email = "";
  let isLoading = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Forgot Password - PickNWin</title>`;
    $$payload2.out.push(`<meta name="description" content="Reset your PickNWin account password"/>`);
  });
  $$payload.out.push(`<div class="space-y-6">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center"><h2 class="text-2xl font-bold text-slate-900 mb-2">Forgot Password?</h2> <p class="text-slate-600">No worries, we'll send you reset instructions</p></div> <form class="space-y-4"><div class="space-y-2"><label for="email" class="text-sm font-medium text-slate-700">Email Address</label> <input id="email" type="email"${attr("value", email)} placeholder="Enter your email address"${attr("disabled", isLoading, true)} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"/></div> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <button type="submit"${attr("disabled", isLoading, true)} class="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">`);
    {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`Send Reset Instructions`);
    }
    $$payload.out.push(`<!--]--></button></form>`);
  }
  $$payload.out.push(`<!--]--> <div class="text-center space-y-4"><a href="/auth/login" class="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg> Back to Sign In</a></div></div>`);
  pop();
}
export {
  _page as default
};
