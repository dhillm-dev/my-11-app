

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/forgot/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/auth/forgot/+page.ts";
export const imports = ["_app/immutable/nodes/5.Dr2zwXeG.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CJ-3rfMP.js","_app/immutable/chunks/n5ERcQ0h.js","_app/immutable/chunks/DAIsN1TV.js","_app/immutable/chunks/CLrvx0kF.js","_app/immutable/chunks/BHXr2KTW.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/9ek7rKyT.js"];
export const stylesheets = [];
export const fonts = [];
