

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/wallet/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/wallet/+page.ts";
export const imports = ["_app/immutable/nodes/20.CS1Epi73.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/6GZusgt_.js","_app/immutable/chunks/BxP-Bn-J.js","_app/immutable/chunks/8x6lrutn.js","_app/immutable/chunks/52Mq0XaK.js","_app/immutable/chunks/CHs-BGr5.js","_app/immutable/chunks/rXCQzQ71.js","_app/immutable/chunks/hoSVDtOQ.js","_app/immutable/chunks/B3R9TjWp.js","_app/immutable/chunks/DbKgpfrA.js","_app/immutable/chunks/gfEskGUc.js","_app/immutable/chunks/CvLP8CsF.js","_app/immutable/chunks/DgBB4vLp.js","_app/immutable/chunks/DVvRPRmo.js","_app/immutable/chunks/H-dD8ZBy.js"];
export const stylesheets = [];
export const fonts = [];
