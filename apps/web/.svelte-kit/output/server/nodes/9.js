

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/contests/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/contests/+page.ts";
export const imports = ["_app/immutable/nodes/9.DiqnKHuM.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CJ-3rfMP.js","_app/immutable/chunks/n5ERcQ0h.js","_app/immutable/chunks/Bve3Vrih.js","_app/immutable/chunks/DAIsN1TV.js","_app/immutable/chunks/DCAJFkIj.js","_app/immutable/chunks/CLrvx0kF.js","_app/immutable/chunks/BHXr2KTW.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/Dnc5Dv7Q.js","_app/immutable/chunks/BukeOIT0.js","_app/immutable/chunks/-dejb9jG.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/DDTJIzx0.js","_app/immutable/chunks/CNqowagr.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/D9nrvU43.js","_app/immutable/chunks/CJHvr4Vg.js"];
export const stylesheets = ["_app/immutable/assets/LoginModal.BolWeU3G.css"];
export const fonts = [];
