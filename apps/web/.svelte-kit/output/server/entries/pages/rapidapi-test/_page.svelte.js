import { O as ensure_array_like, F as head, P as attr, Y as maybe_selected, G as escape_html, I as attr_class, J as stringify, D as pop, A as push } from "../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  let testResults = [];
  let isLoading = false;
  let searchQuery = "messi";
  let selectedTest = "search";
  const testTypes = [
    {
      value: "search",
      label: "Search Players/Teams",
      description: "Search for players or teams by name"
    },
    {
      value: "live",
      label: "Live Matches",
      description: "Get currently live matches"
    },
    {
      value: "popular",
      label: "Popular Players",
      description: "Get trending/popular players"
    },
    {
      value: "today",
      label: "Today's Matches",
      description: "Get matches scheduled for today"
    }
  ];
  function formatJson(obj) {
    return JSON.stringify(obj, null, 2);
  }
  function getStatusColor(success) {
    return success ? "text-green-600" : "text-red-600";
  }
  function getStatusBg(success) {
    return success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  }
  const each_array = ensure_array_like(testTypes);
  const each_array_1 = ensure_array_like(testTypes);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>RapidAPI SofaScore Test - PickNWin</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gray-50 py-8"><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-8"><h1 class="text-3xl font-bold text-gray-900 mb-2">RapidAPI SofaScore Integration Test</h1> <p class="text-gray-600">Test the SofaScore API integration with your RapidAPI credentials</p></div> <div class="bg-white rounded-lg shadow-md p-6 mb-8"><h2 class="text-xl font-semibold mb-4">Run API Tests</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div><label for="testType" class="block text-sm font-medium text-gray-700 mb-2">Test Type</label> <select id="testType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">`);
  $$payload.select_value = selectedTest;
  $$payload.out.push(`<!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let test = each_array[$$index];
    $$payload.out.push(`<option${attr("value", test.value)}${maybe_selected($$payload, test.value)}>${escape_html(test.label)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div${attr_class("", void 0, { "opacity-50": selectedTest !== "search" })}><label for="searchQuery" class="block text-sm font-medium text-gray-700 mb-2">Search Query</label> <input id="searchQuery" type="text"${attr("value", searchQuery)}${attr("disabled", selectedTest !== "search", true)} placeholder="e.g., messi, ronaldo, barcelona" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"/></div> <div class="flex items-end"><button${attr("disabled", isLoading, true)} class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">`);
  {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`Run Test`);
  }
  $$payload.out.push(`<!--]--></button></div></div> <!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let test = each_array_1[$$index_1];
    if (test.value === selectedTest) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="bg-blue-50 border border-blue-200 rounded-md p-3"><p class="text-blue-800 text-sm"><strong>${escape_html(test.label)}:</strong> ${escape_html(test.description)}</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-6">`);
  if (testResults.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-white rounded-lg shadow-md p-8 text-center"><p class="text-gray-500">No test results yet. Run a test to see results here.</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array_2 = ensure_array_like(testResults);
    $$payload.out.push(`<!--[-->`);
    for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
      let result = each_array_2[index];
      $$payload.out.push(`<div class="bg-white rounded-lg shadow-md overflow-hidden"><div${attr_class(`px-6 py-4 border-b border-gray-200 ${stringify(getStatusBg(result.success))}`)}><div class="flex items-center justify-between"><div><h3${attr_class(`text-lg font-semibold ${stringify(getStatusColor(result.success))}`)}>${escape_html(result.success ? "✅" : "❌")} ${escape_html(result.testDescription)}</h3> <p class="text-sm text-gray-600 mt-1">${escape_html(result.meta.timestamp)} • ${escape_html(result.meta.responseTime)}ms • ${escape_html(result.meta.apiProvider)}</p></div> <div class="text-right">`);
      if (result.meta.resultCount !== void 0) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${escape_html(result.meta.resultCount)} results</span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div></div></div> <div class="px-6 py-4">`);
      if (result.success) {
        $$payload.out.push("<!--[-->");
        if (result.testType === "search" && result.result?.results) {
          $$payload.out.push("<!--[-->");
          const each_array_3 = ensure_array_like(result.result.results.slice(0, 5));
          $$payload.out.push(`<div class="space-y-3"><h4 class="font-medium text-gray-900">Search Results:</h4> <!--[-->`);
          for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
            let item = each_array_3[$$index_2];
            $$payload.out.push(`<div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"><span${attr_class(`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stringify(item.type === "player" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800")}`)}>${escape_html(item.type)}</span> <div class="flex-1"><p class="font-medium text-gray-900">${escape_html(item.entity.name)}</p> `);
            if (item.entity.team) {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`<p class="text-sm text-gray-600">${escape_html(item.entity.team.name)}</p>`);
            } else {
              $$payload.out.push("<!--[!-->");
            }
            $$payload.out.push(`<!--]--></div> <span class="text-sm text-gray-500">Score: ${escape_html(item.score)}</span></div>`);
          }
          $$payload.out.push(`<!--]--></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
          $$payload.out.push(`<div><h4 class="font-medium text-gray-900 mb-2">API Response:</h4> <pre class="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto max-h-96 svelte-1aysd6i">${escape_html(formatJson(result.result))}</pre></div>`);
        }
        $$payload.out.push(`<!--]-->`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<div class="space-y-3"><div class="bg-red-50 border border-red-200 rounded-md p-4"><h4 class="font-medium text-red-800 mb-2">Error Details:</h4> <p class="text-red-700"><strong>Type:</strong> ${escape_html(result.error?.type)}</p> <p class="text-red-700"><strong>Message:</strong> ${escape_html(result.error?.message)}</p> `);
        if (result.error?.stack) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<details class="mt-2"><summary class="cursor-pointer text-red-600 hover:text-red-800">Stack Trace</summary> <pre class="mt-2 text-xs text-red-600 whitespace-pre-wrap svelte-1aysd6i">${escape_html(result.error.stack)}</pre></details>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div></div>`);
      }
      $$payload.out.push(`<!--]--></div></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div> <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"><h3 class="text-lg font-semibold text-blue-900 mb-3">RapidAPI Configuration</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><p class="text-blue-800"><strong>API Provider:</strong> SofaScore via RapidAPI</p> <p class="text-blue-800"><strong>Base URL:</strong> https://sofascore.p.rapidapi.com</p></div> <div><p class="text-blue-800"><strong>Rate Limit:</strong> 100 requests/minute</p> <p class="text-blue-800"><strong>Cache TTL:</strong> 5 minutes</p></div></div></div></div></div>`);
  pop();
}
export {
  _page as default
};
