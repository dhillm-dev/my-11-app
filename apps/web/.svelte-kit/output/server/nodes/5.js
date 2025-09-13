

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/forgot/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/auth/forgot/+page.ts";
export const imports = ["_app/immutable/nodes/5.DVxK1Usa.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cki9lcfI.js","_app/immutable/chunks/-7ji5h5c.js","_app/immutable/chunks/By3v3tMv.js","_app/immutable/chunks/fM1JLal-.js","_app/immutable/chunks/U3M1nOa8.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/9ek7rKyT.js"];
export const stylesheets = [];
export const fonts = [];
