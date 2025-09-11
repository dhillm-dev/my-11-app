import { F as head, I as attr_class, O as ensure_array_like, G as escape_html, E as store_get, K as unsubscribe_stores, D as pop, A as push, J as stringify } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "clsx";
import "../../../chunks/state.svelte.js";
import { i as isAuthenticated } from "../../../chunks/teams.js";
import { h as html } from "../../../chunks/html.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const gameSteps = [
    {
      step: 1,
      title: "Select a Match",
      description: "Choose from upcoming cricket, football, or basketball matches. Each match has different contest types and prize pools.",
      icon: "calendar",
      tips: [
        "Check match timing",
        "Review team news",
        "Consider weather conditions"
      ]
    },
    {
      step: 2,
      title: "Build Your Team",
      description: "Select 11 players within the 100 credit budget. Pick maximum 6 players from one team and 5 from the other team.",
      icon: "users",
      tips: [
        "Balance your budget wisely",
        "Max 6 from one team, 5 from other",
        "Consider recent form"
      ]
    },
    {
      step: 3,
      title: "Choose Captain & Vice-Captain",
      description: "Your captain gets 2x points and vice-captain gets 1.5x points. Choose wisely as they can make or break your team.",
      icon: "crown",
      tips: [
        "Captain gets 2x points",
        "Vice-captain gets 1.5x points",
        "Pick consistent performers"
      ]
    },
    {
      step: 4,
      title: "Join Contest",
      description: "Enter contests with different entry fees and prize structures. From free contests to high-stakes tournaments.",
      icon: "trophy",
      tips: [
        "Start with free contests",
        "Check prize distribution",
        "Read contest rules"
      ]
    },
    {
      step: 5,
      title: "Track & Win",
      description: "Follow live scores and leaderboard updates. Winnings are credited instantly after match completion.",
      icon: "chart",
      tips: [
        "Monitor live scores",
        "Check leaderboard",
        "Instant payouts"
      ]
    }
  ];
  function getIconSvg(icon) {
    const icons = {
      calendar: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />',
      users: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />',
      crown: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.5c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v4.127c0 2.49.824 4.916 2.343 6.75l.071.108c.054.082.12.15.196.196l.108.071c.497.497 1.042.625 1.407.625.365 0 .91-.128 1.407-.625l.108-.071A8.817 8.817 0 0 0 15.75 8.627V4.5Z" />',
      trophy: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.5c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v4.127c0 2.49.824 4.916 2.343 6.75l.071.108c.054.082.12.15.196.196l.108.071c.497.497 1.042.625 1.407.625.365 0 .91-.128 1.407-.625l.108-.071A8.817 8.817 0 0 0 15.75 8.627V4.5Z" />',
      chart: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />',
      "academic-cap": '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />',
      "user-group": '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />',
      "magnifying-glass": '<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />',
      "chart-bar": '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />',
      star: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />',
      "currency-euro": '<path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
      "arrow-trending-up": '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />'
    };
    return icons[icon] || icons.users;
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>How to Play - PickNWin Fantasy Sports</title>`;
    $$payload2.out.push(`<meta name="description" content="Learn how to play fantasy sports on PickNWin. Complete guide with rules, scoring system, and winning strategies."/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"><section class="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-16"><div class="max-w-6xl mx-auto px-4 text-center"><h1 class="text-4xl md:text-5xl font-black mb-4">How to Play Fantasy Sports</h1> <p class="text-xl md:text-2xl text-lime-100 mb-8 max-w-3xl mx-auto">Master the art of fantasy sports with our comprehensive guide. From team building to winning strategies.</p> <div class="flex flex-wrap justify-center gap-4"><button${attr_class(`px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 ${stringify("bg-white/30 ring-2 ring-white/50")}`)}>Game Overview</button> <button${attr_class(`px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 ${stringify("")}`)}>Scoring Rules</button> <button${attr_class(`px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 ${stringify("")}`)}>Contest Types</button> <button${attr_class(`px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 ${stringify("")}`)}>Pro Tips</button></div></div></section> <section class="max-w-6xl mx-auto px-4 py-16">`);
  {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(gameSteps);
    $$payload.out.push(`<div class="space-y-12"><div class="text-center mb-12"><h2 class="text-3xl font-bold text-slate-900 mb-4">5 Simple Steps to Start Winning</h2> <p class="text-lg text-slate-600 max-w-2xl mx-auto">Fantasy sports is easy to learn but takes skill to master. Follow these steps to get started.</p></div> <div class="grid gap-8"><!--[-->`);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let step = each_array[index];
      const each_array_1 = ensure_array_like(step.tips);
      $$payload.out.push(`<div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"><div class="flex flex-col md:flex-row"><div class="bg-gradient-to-br from-lime-400 to-lime-500 p-8 md:w-64 flex flex-col items-center justify-center text-center"><div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">${html(getIconSvg(step.icon))}</svg></div> <div class="text-3xl font-black text-white mb-2">Step ${escape_html(step.step)}</div> <div class="text-lg font-semibold text-white">${escape_html(step.title)}</div></div> <div class="p-8 flex-1"><p class="text-lg text-slate-700 mb-6 leading-relaxed">${escape_html(step.description)}</p> <div class="space-y-3"><h4 class="font-semibold text-slate-900 mb-3">💡 Pro Tips:</h4> <!--[-->`);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let tip = each_array_1[$$index];
        $$payload.out.push(`<div class="flex items-center space-x-3"><div class="w-2 h-2 bg-lime-500 rounded-full"></div> <span class="text-slate-600">${escape_html(tip)}</span></div>`);
      }
      $$payload.out.push(`<!--]--></div></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div> <div class="bg-gradient-to-r from-lime-500 to-lime-600 rounded-2xl p-8 text-center text-white"><h3 class="text-2xl font-bold mb-4">Ready to Start Playing?</h3> <p class="text-lime-100 mb-6">Join thousands of players and start winning real money today!</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
    if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="px-8 py-3 bg-white text-lime-600 font-bold rounded-xl hover:bg-lime-50 transition-colors">Browse Contests</button> <button class="px-8 py-3 bg-lime-400 text-lime-900 font-bold rounded-xl hover:bg-lime-300 transition-colors">View Matches</button>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<button class="px-8 py-3 bg-white text-lime-600 font-bold rounded-xl hover:bg-lime-50 transition-colors">Sign Up Free</button> <button class="px-8 py-3 bg-lime-400 text-lime-900 font-bold rounded-xl hover:bg-lime-300 transition-colors">Login</button>`);
    }
    $$payload.out.push(`<!--]--></div></div></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></section> <section class="bg-slate-900 text-white py-16"><div class="max-w-4xl mx-auto px-4 text-center"><h2 class="text-3xl font-bold mb-4">Ready to Put Your Skills to the Test?</h2> <p class="text-xl text-slate-300 mb-8">Join millions of fantasy sports players and start your winning journey today!</p> <div class="flex flex-col sm:flex-row gap-4 justify-center">`);
  if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="px-8 py-4 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition-colors shadow-lg">Start Playing Now</button> <button class="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600">View Live Matches</button>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<button class="px-8 py-4 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition-colors shadow-lg">Sign Up Free</button> <button class="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600">Login to Play</button>`);
  }
  $$payload.out.push(`<!--]--></div></div></section></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
