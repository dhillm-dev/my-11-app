

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/forgot/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/auth/forgot/+page.ts";
export const imports = ["_app/immutable/nodes/5.Db9rO283.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/ChqFZlOs.js","_app/immutable/chunks/sn2bgj-Z.js","_app/immutable/chunks/Cs-2xr4_.js","_app/immutable/chunks/DJXJUQSZ.js","_app/immutable/chunks/DMbMFB8t.js","_app/immutable/chunks/BLn6UD4w.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/DzVJhIJV.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/D3otL7Td.js","_app/immutable/chunks/9ek7rKyT.js"];
export const stylesheets = [];
export const fonts = [];
