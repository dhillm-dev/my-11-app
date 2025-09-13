import { F as head, I as attr_class, P as attr, G as escape_html, D as pop, A as push, J as stringify } from "../../../chunks/index2.js";
import "../../../chunks/sofascoreAdapter.js";
import "../../../chunks/unifiedFeedService.js";
function _page($$payload, $$props) {
  push();
  let searchQuery = "messi";
  let loading = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>SofaScore API Demo - PickNWin</title>`;
    $$payload2.out.push(`<meta name="description" content="Demo of SofaScore API integration for real sports data" class="svelte-11r88ol"/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 svelte-11r88ol"><div class="container mx-auto px-4 max-w-6xl svelte-11r88ol"><div class="text-center mb-8 svelte-11r88ol"><h1 class="text-4xl font-bold text-gray-900 mb-2 svelte-11r88ol">SofaScore API Demo</h1> <p class="text-lg text-gray-600 svelte-11r88ol">Real sports data integration for PickNWin fantasy platform</p></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="bg-white rounded-lg shadow-md mb-8 svelte-11r88ol"><div class="border-b border-gray-200 svelte-11r88ol"><nav class="flex space-x-8 px-6 svelte-11r88ol"><button${attr_class(
    `py-4 px-1 border-b-2 font-medium text-sm ${stringify(
      "border-blue-500 text-blue-600"
    )}`,
    "svelte-11r88ol"
  )}>Player Search</button> <button${attr_class(
    `py-4 px-1 border-b-2 font-medium text-sm ${stringify("border-transparent text-gray-500 hover:text-gray-700")}`,
    "svelte-11r88ol"
  )}>Live Matches</button> <button${attr_class(
    `py-4 px-1 border-b-2 font-medium text-sm ${stringify("border-transparent text-gray-500 hover:text-gray-700")}`,
    "svelte-11r88ol"
  )}>Popular Players</button></nav></div> <div class="p-6 svelte-11r88ol">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="space-y-6 svelte-11r88ol"><div class="flex space-x-4 svelte-11r88ol"><input${attr("value", searchQuery)} placeholder="Search for players or teams..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent svelte-11r88ol"/> <button${attr("disabled", loading, true)} class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed svelte-11r88ol">${escape_html("Search")}</button></div> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 svelte-11r88ol"><h3 class="text-lg font-semibold text-blue-900 mb-3 svelte-11r88ol">About This Demo</h3> <div class="text-sm text-blue-800 space-y-2 svelte-11r88ol"><p class="svelte-11r88ol">This demo showcases the integration of the SofaScore API with the PickNWin fantasy sports platform.</p> <p class="svelte-11r88ol"><strong class="svelte-11r88ol">Features demonstrated:</strong></p> <ul class="list-disc list-inside ml-4 space-y-1 svelte-11r88ol"><li class="svelte-11r88ol">Real-time player and team search</li> <li class="svelte-11r88ol">Live match data integration</li> <li class="svelte-11r88ol">Intelligent caching and fallback systems</li> <li class="svelte-11r88ol">Service monitoring and statistics</li> <li class="svelte-11r88ol">Hybrid data sources (mock + real API)</li></ul> <p class="mt-3 svelte-11r88ol"><strong class="svelte-11r88ol">API Source:</strong> SofaScore via RapidAPI</p></div></div></div></div>`);
  pop();
}
export {
  _page as default
};
