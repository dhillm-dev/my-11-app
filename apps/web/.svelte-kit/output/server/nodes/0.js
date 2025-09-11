import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BQiOAmnn.js","_app/immutable/chunks/CHmzRBH6.js","_app/immutable/chunks/d-9Q_JcI.js","_app/immutable/chunks/CC47Dqnt.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/C3K3qoHi.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/3oX9xRnt.js","_app/immutable/chunks/CC5kzxMM.js","_app/immutable/chunks/B-dksMZM.js","_app/immutable/chunks/DLEGmHds.js","_app/immutable/chunks/ICb-5blB.js","_app/immutable/chunks/b6JBECFY.js","_app/immutable/chunks/9ek7rKyT.js","_app/immutable/chunks/BSbMBcI1.js","_app/immutable/chunks/BgZjGsrQ.js","_app/immutable/chunks/D9Z9MdNV.js"];
export const stylesheets = ["_app/immutable/assets/0.CgNmLYxl.css"];
export const fonts = [];
