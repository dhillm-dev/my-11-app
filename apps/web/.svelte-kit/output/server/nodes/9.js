

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/button-demo/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/button-demo/+page.ts";
export const imports = ["_app/immutable/nodes/9.DOWzeOya.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/6GZusgt_.js","_app/immutable/chunks/BxP-Bn-J.js","_app/immutable/chunks/D8QE-3bL.js","_app/immutable/chunks/78Rk13Kj.js","_app/immutable/chunks/hoSVDtOQ.js","_app/immutable/chunks/B3R9TjWp.js","_app/immutable/chunks/C_aAuIeA.js","_app/immutable/chunks/J8J4SVFF.js","_app/immutable/chunks/gfEskGUc.js","_app/immutable/chunks/CvLP8CsF.js","_app/immutable/chunks/DVvRPRmo.js"];
export const stylesheets = [];
export const fonts = [];
