

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/how-to-play/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/how-to-play/+page.ts";
export const imports = ["_app/immutable/nodes/11.91a7AudV.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/n5ERcQ0h.js","_app/immutable/chunks/DAIsN1TV.js","_app/immutable/chunks/DCAJFkIj.js","_app/immutable/chunks/Ddi1kZ5u.js","_app/immutable/chunks/BHXr2KTW.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/Dnc5Dv7Q.js","_app/immutable/chunks/BukeOIT0.js","_app/immutable/chunks/DDTJIzx0.js","_app/immutable/chunks/Bve3Vrih.js","_app/immutable/chunks/-dejb9jG.js","_app/immutable/chunks/9ek7rKyT.js"];
export const stylesheets = [];
export const fonts = [];
