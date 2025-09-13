

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/how-to-play/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/how-to-play/+page.ts";
export const imports = ["_app/immutable/nodes/12.BX8pvNHZ.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/sn2bgj-Z.js","_app/immutable/chunks/Cs-2xr4_.js","_app/immutable/chunks/DJXJUQSZ.js","_app/immutable/chunks/DBzOBDMn.js","_app/immutable/chunks/7BdgQHkD.js","_app/immutable/chunks/BLn6UD4w.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/Bz204FB1.js","_app/immutable/chunks/BQeg1LcY.js","_app/immutable/chunks/B_vfh-un.js","_app/immutable/chunks/DMB6SNds.js","_app/immutable/chunks/CLBNl_2r.js","_app/immutable/chunks/9ek7rKyT.js"];
export const stylesheets = [];
export const fonts = [];
