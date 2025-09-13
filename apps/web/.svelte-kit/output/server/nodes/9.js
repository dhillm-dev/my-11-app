

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/button-demo/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/button-demo/+page.ts";
export const imports = ["_app/immutable/nodes/9.CtK9_W1E.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/ChqFZlOs.js","_app/immutable/chunks/sn2bgj-Z.js","_app/immutable/chunks/BNRu-KHi.js","_app/immutable/chunks/Bo52ZjNo.js","_app/immutable/chunks/DMbMFB8t.js","_app/immutable/chunks/BLn6UD4w.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/D3otL7Td.js","_app/immutable/chunks/BPbz0Njt.js","_app/immutable/chunks/DylqDdvv.js","_app/immutable/chunks/Bz204FB1.js","_app/immutable/chunks/BQeg1LcY.js","_app/immutable/chunks/9ek7rKyT.js"];
export const stylesheets = [];
export const fonts = [];
