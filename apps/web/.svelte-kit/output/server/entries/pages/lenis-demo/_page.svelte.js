import { O as ensure_array_like, F as head, G as escape_html, D as pop, A as push } from "../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  const each_array = ensure_array_like(Array(6));
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Lenis Smooth Scroll Demo</title>`;
    $$payload2.out.push(`<meta name="description" content="Demonstration of Lenis smooth scroll with GSAP ScrollTrigger integration"/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"><section class="min-h-screen flex items-center justify-center px-4"><div class="text-center max-w-4xl mx-auto"><h1 class="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-tight">Lenis Smooth <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Scroll Demo</span></h1> <p class="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">Experience buttery smooth scrolling with GSAP ScrollTrigger integration</p> <div class="flex flex-col items-center space-y-4"><button class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">Scroll to Explore</button> <div class="animate-bounce"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div></div></div></section> <!--[-->`);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    each_array[i];
    $$payload.out.push(`<section class="min-h-screen flex items-center justify-center px-4 py-20"><div class="max-w-4xl mx-auto text-center"><div class="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20"><div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center"><span class="text-3xl font-bold text-white">${escape_html(i + 1)}</span></div> <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">`);
    if (i === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`SSR-Safe Setup`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (i === 1) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`GSAP Integration`);
      } else {
        $$payload.out.push("<!--[!-->");
        if (i === 2) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`Custom RAF Loop`);
        } else {
          $$payload.out.push("<!--[!-->");
          if (i === 3) {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`Reduced Motion`);
          } else {
            $$payload.out.push("<!--[!-->");
            if (i === 4) {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`Proper Cleanup`);
            } else {
              $$payload.out.push("<!--[!-->");
              $$payload.out.push(`Performant Scrolling`);
            }
            $$payload.out.push(`<!--]-->`);
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></h2> <p class="text-lg md:text-xl text-gray-600 leading-relaxed">`);
    if (i === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`Lenis only initializes in the browser, preventing SSR hydration issues and ensuring smooth client-side rendering.`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (i === 1) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`Seamless GSAP ScrollTrigger synchronization for precise scroll-based animations and interactions.`);
      } else {
        $$payload.out.push("<!--[!-->");
        if (i === 2) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`Custom requestAnimationFrame loop provides optimal performance and prevents animation drift.`);
        } else {
          $$payload.out.push("<!--[!-->");
          if (i === 3) {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`Respects user preferences by disabling smooth scrolling when reduced motion is preferred.`);
          } else {
            $$payload.out.push("<!--[!-->");
            if (i === 4) {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`Proper cleanup on route changes prevents memory leaks and ensures optimal performance.`);
            } else {
              $$payload.out.push("<!--[!-->");
              $$payload.out.push(`Buttery smooth scrolling experience with configurable easing and momentum for all devices.`);
            }
            $$payload.out.push(`<!--]-->`);
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></p></div></div></section>`);
  }
  $$payload.out.push(`<!--]--> <footer class="bg-gray-900 text-white py-20"><div class="max-w-4xl mx-auto text-center px-4"><h3 class="text-3xl font-bold mb-4">Lenis Integration Complete</h3> <p class="text-gray-300 mb-8">Smooth scrolling is now active across your entire SvelteKit application</p> <div class="flex justify-center space-x-4"><a href="/" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">Back to Home</a> <a href="/neo-svelte-demo" class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">Neo Svelte Demo</a></div></div></footer></div>`);
  pop();
}
export {
  _page as default
};
