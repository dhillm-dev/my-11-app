

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.De0zFDAs.js","_app/immutable/chunks/C4eMpk_W.js","_app/immutable/chunks/BYnp55xC.js","_app/immutable/chunks/-7ji5h5c.js","_app/immutable/chunks/DhZ9dMgW.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/By3v3tMv.js","_app/immutable/chunks/U3M1nOa8.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/CBgjW_LK.js","_app/immutable/chunks/BoB6t1Th.js","_app/immutable/chunks/hyRILVxy.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/BUU1WB-X.js","_app/immutable/chunks/bPJzaUme.js","_app/immutable/chunks/D9Z9MdNV.js"];
export const stylesheets = ["_app/immutable/assets/0.vqmkpfPB.css"];
export const fonts = [];
