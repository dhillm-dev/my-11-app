

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/how-to-play/_page.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/how-to-play/+page.ts";
export const imports = ["_app/immutable/nodes/12.DsnZlxxI.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BxP-Bn-J.js","_app/immutable/chunks/52Mq0XaK.js","_app/immutable/chunks/CHs-BGr5.js","_app/immutable/chunks/rXCQzQ71.js","_app/immutable/chunks/DQuT6H9s.js","_app/immutable/chunks/B3R9TjWp.js","_app/immutable/chunks/gfEskGUc.js","_app/immutable/chunks/CvLP8CsF.js","_app/immutable/chunks/H-dD8ZBy.js","_app/immutable/chunks/8x6lrutn.js","_app/immutable/chunks/DgBB4vLp.js","_app/immutable/chunks/DVvRPRmo.js"];
export const stylesheets = [];
export const fonts = [];
