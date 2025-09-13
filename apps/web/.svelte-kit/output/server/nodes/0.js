

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.AecIUY6W.js","_app/immutable/chunks/CUwP_rfp.js","_app/immutable/chunks/CeyqlY7M.js","_app/immutable/chunks/BYwdtpf8.js","_app/immutable/chunks/D4e3NgJS.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/x2hlQoet.js","_app/immutable/chunks/B-ZH1xP9.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/DZx-2HU6.js","_app/immutable/chunks/VodBLl8-.js","_app/immutable/chunks/CJJjtxOk.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/CBJPUhe-.js","_app/immutable/chunks/BH1Je14V.js","_app/immutable/chunks/D9Z9MdNV.js"];
export const stylesheets = ["_app/immutable/assets/0.vqmkpfPB.css"];
export const fonts = [];
