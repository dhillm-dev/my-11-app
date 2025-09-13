

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.cG9cyk8X.js","_app/immutable/chunks/BbgwE1SL.js","_app/immutable/chunks/Dpb-i6uF.js","_app/immutable/chunks/CVry2a8L.js","_app/immutable/chunks/C2qV-dvn.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cgd3HNF2.js","_app/immutable/chunks/CtW1WcXw.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/B21ZSewf.js","_app/immutable/chunks/0Rlou4_0.js","_app/immutable/chunks/D0VaxNBh.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/CxmOpBrn.js","_app/immutable/chunks/DHpzoda2.js","_app/immutable/chunks/D9Z9MdNV.js"];
export const stylesheets = ["_app/immutable/assets/0.vqmkpfPB.css"];
export const fonts = [];
