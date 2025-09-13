

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api-demo/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/api-demo/+page.ts";
export const imports = ["_app/immutable/nodes/4.CcmKGVZz.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CJ-3rfMP.js","_app/immutable/chunks/n5ERcQ0h.js","_app/immutable/chunks/Bve3Vrih.js","_app/immutable/chunks/DAIsN1TV.js","_app/immutable/chunks/DCAJFkIj.js","_app/immutable/chunks/CLrvx0kF.js","_app/immutable/chunks/BHXr2KTW.js","_app/immutable/chunks/B-dksMZM.js"];
export const stylesheets = ["_app/immutable/assets/4.DDpDL8WN.css"];
export const fonts = [];
