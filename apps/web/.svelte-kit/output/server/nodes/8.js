

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/reset/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/auth/reset/+page.ts";
export const imports = ["_app/immutable/nodes/8.DDUHPs84.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cki9lcfI.js","_app/immutable/chunks/-7ji5h5c.js","_app/immutable/chunks/BYnp55xC.js","_app/immutable/chunks/By3v3tMv.js","_app/immutable/chunks/U3M1nOa8.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/CdEA5IGF.js","_app/immutable/chunks/CBgjW_LK.js","_app/immutable/chunks/DhZ9dMgW.js","_app/immutable/chunks/CUyTfC05.js","_app/immutable/chunks/CEukAdJd.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/CZMqfpn4.js","_app/immutable/chunks/fM1JLal-.js","_app/immutable/chunks/DOH89e_f.js","_app/immutable/chunks/8dQCmbNc.js"];
export const stylesheets = ["_app/immutable/assets/8.tn0RQdqM.css"];
export const fonts = [];
