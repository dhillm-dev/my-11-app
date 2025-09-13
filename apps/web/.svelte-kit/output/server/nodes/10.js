

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/contests/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/contests/+page.ts";
export const imports = ["_app/immutable/nodes/10.0S5zmH2a.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/ChqFZlOs.js","_app/immutable/chunks/sn2bgj-Z.js","_app/immutable/chunks/DMB6SNds.js","_app/immutable/chunks/Cs-2xr4_.js","_app/immutable/chunks/DJXJUQSZ.js","_app/immutable/chunks/DBzOBDMn.js","_app/immutable/chunks/DMbMFB8t.js","_app/immutable/chunks/BLn6UD4w.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/DzVJhIJV.js","_app/immutable/chunks/D3otL7Td.js","_app/immutable/chunks/Bz204FB1.js","_app/immutable/chunks/BQeg1LcY.js","_app/immutable/chunks/CLBNl_2r.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/BKmK1l5b.js","_app/immutable/chunks/B8QDw3vX.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/BPbz0Njt.js","_app/immutable/chunks/DylqDdvv.js"];
export const stylesheets = ["_app/immutable/assets/LoginModal.BolWeU3G.css"];
export const fonts = [];
