

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/forgot/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/auth/forgot/+page.ts";
export const imports = ["_app/immutable/nodes/5.DIDbgcqx.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/6GZusgt_.js","_app/immutable/chunks/BxP-Bn-J.js","_app/immutable/chunks/52Mq0XaK.js","_app/immutable/chunks/CHs-BGr5.js","_app/immutable/chunks/hoSVDtOQ.js","_app/immutable/chunks/B3R9TjWp.js","_app/immutable/chunks/DbKgpfrA.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/DVvRPRmo.js"];
export const stylesheets = [];
export const fonts = [];
