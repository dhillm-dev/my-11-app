

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/reset/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/auth/reset/+page.ts";
export const imports = ["_app/immutable/nodes/8.MQao_9JM.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CJ-3rfMP.js","_app/immutable/chunks/n5ERcQ0h.js","_app/immutable/chunks/Bve3Vrih.js","_app/immutable/chunks/DAIsN1TV.js","_app/immutable/chunks/BHXr2KTW.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/Dnc5Dv7Q.js","_app/immutable/chunks/BukeOIT0.js","_app/immutable/chunks/DsQhxj-T.js","_app/immutable/chunks/DDTJIzx0.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/RfAd88sG.js","_app/immutable/chunks/CLrvx0kF.js","_app/immutable/chunks/D9nrvU43.js","_app/immutable/chunks/CJHvr4Vg.js"];
export const stylesheets = ["_app/immutable/assets/8.tn0RQdqM.css"];
export const fonts = [];
