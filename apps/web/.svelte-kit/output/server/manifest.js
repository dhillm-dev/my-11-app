export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".nojekyll","images/peeps/all-peeps.svg","robots.txt"]),
	mimeTypes: {".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.P_sn6F2w.js",app:"_app/immutable/entry/app.BZzXYmV3.js",imports:["_app/immutable/entry/start.P_sn6F2w.js","_app/immutable/chunks/B_vfh-un.js","_app/immutable/chunks/DMB6SNds.js","_app/immutable/chunks/sn2bgj-Z.js","_app/immutable/chunks/Cs-2xr4_.js","_app/immutable/chunks/BQeg1LcY.js","_app/immutable/entry/app.BZzXYmV3.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/sn2bgj-Z.js","_app/immutable/chunks/Cs-2xr4_.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DMB6SNds.js","_app/immutable/chunks/DJXJUQSZ.js","_app/immutable/chunks/CJm2gSzS.js","_app/immutable/chunks/DylqDdvv.js","_app/immutable/chunks/Bz204FB1.js","_app/immutable/chunks/BQeg1LcY.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/api/rapidapi-test",
				pattern: /^\/api\/rapidapi-test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/rapidapi-test/_server.ts.js'))
			},
			{
				id: "/api/sofascore/live",
				pattern: /^\/api\/sofascore\/live\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/sofascore/live/_server.ts.js'))
			},
			{
				id: "/api/sofascore/search",
				pattern: /^\/api\/sofascore\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/sofascore/search/_server.ts.js'))
			}
		],
		prerendered_routes: new Set(["/","/api-demo","/auth/forgot","/auth/login","/auth/register","/auth/reset","/button-demo","/contests","/dashboard","/how-to-play","/matches","/neo-svelte-demo","/neumorphic-demo","/profile","/rapidapi-test","/team-builder","/wallet"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
