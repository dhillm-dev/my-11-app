

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.LnELmcwq.js","_app/immutable/chunks/H-dD8ZBy.js","_app/immutable/chunks/8x6lrutn.js","_app/immutable/chunks/BxP-Bn-J.js","_app/immutable/chunks/52Mq0XaK.js","_app/immutable/chunks/CvLP8CsF.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CHs-BGr5.js","_app/immutable/chunks/B3R9TjWp.js","_app/immutable/chunks/gfEskGUc.js","_app/immutable/chunks/CQTugc1a.js","_app/immutable/chunks/DgBB4vLp.js","_app/immutable/chunks/DVvRPRmo.js","_app/immutable/chunks/C2iNbuI3.js","_app/immutable/chunks/C7qw2ljF.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/DKtf60Sy.js"];
export const stylesheets = ["_app/immutable/assets/0.DZdXC6ms.css"];
export const fonts = [];
