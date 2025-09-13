

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BZTWMHZm.js","_app/immutable/chunks/BKmK1l5b.js","_app/immutable/chunks/DMB6SNds.js","_app/immutable/chunks/sn2bgj-Z.js","_app/immutable/chunks/Cs-2xr4_.js","_app/immutable/chunks/BQeg1LcY.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DJXJUQSZ.js","_app/immutable/chunks/BLn6UD4w.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/Bz204FB1.js","_app/immutable/chunks/6gNuyx6S.js","_app/immutable/chunks/CLBNl_2r.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/Cmt67XBB.js","_app/immutable/chunks/CB2z_4Ok.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/ChqFZlOs.js","_app/immutable/chunks/DKtf60Sy.js"];
export const stylesheets = ["_app/immutable/assets/0.DhefNaaF.css"];
export const fonts = [];
