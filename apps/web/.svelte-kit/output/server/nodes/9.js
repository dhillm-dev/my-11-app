

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/contests/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/contests/+page.ts";
export const imports = ["_app/immutable/nodes/9.STZkrTX0.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BQ5TAxPT.js","_app/immutable/chunks/CVry2a8L.js","_app/immutable/chunks/Dpb-i6uF.js","_app/immutable/chunks/Cgd3HNF2.js","_app/immutable/chunks/DUfWvYOm.js","_app/immutable/chunks/DXEbly8j.js","_app/immutable/chunks/CtW1WcXw.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/B21ZSewf.js","_app/immutable/chunks/C2qV-dvn.js","_app/immutable/chunks/D0VaxNBh.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/BbgwE1SL.js","_app/immutable/chunks/BmiRxpBm.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/CiE2pS4o.js","_app/immutable/chunks/DYxpIxoy.js"];
export const stylesheets = ["_app/immutable/assets/LoginModal.BolWeU3G.css"];
export const fonts = [];
