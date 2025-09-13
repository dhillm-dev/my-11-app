

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/api-demo/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/api-demo/+page.ts";
export const imports = ["_app/immutable/nodes/4.D7vC2SRI.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/6GZusgt_.js","_app/immutable/chunks/BxP-Bn-J.js","_app/immutable/chunks/8x6lrutn.js","_app/immutable/chunks/52Mq0XaK.js","_app/immutable/chunks/CHs-BGr5.js","_app/immutable/chunks/rXCQzQ71.js","_app/immutable/chunks/hoSVDtOQ.js","_app/immutable/chunks/B3R9TjWp.js","_app/immutable/chunks/DbKgpfrA.js"];
export const stylesheets = ["_app/immutable/assets/4.1-veYPja.css"];
export const fonts = [];
