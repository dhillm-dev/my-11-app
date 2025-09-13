export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "my-11-app/_app",
	assets: new Set([".nojekyll","images/peeps/all-peeps.svg","robots.txt"]),
	mimeTypes: {".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.HxPyK0Z6.js",app:"_app/immutable/entry/app.BNnlidTX.js",imports:["_app/immutable/entry/start.HxPyK0Z6.js","_app/immutable/chunks/DDTJIzx0.js","_app/immutable/chunks/Bve3Vrih.js","_app/immutable/chunks/n5ERcQ0h.js","_app/immutable/chunks/BukeOIT0.js","_app/immutable/entry/app.BNnlidTX.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/n5ERcQ0h.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Bve3Vrih.js","_app/immutable/chunks/DAIsN1TV.js","_app/immutable/chunks/CJHvr4Vg.js","_app/immutable/chunks/Dnc5Dv7Q.js","_app/immutable/chunks/BukeOIT0.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
		prerendered_routes: new Set(["/my-11-app/","/my-11-app/api-demo","/my-11-app/auth/forgot","/my-11-app/auth/login","/my-11-app/auth/register","/my-11-app/auth/reset","/my-11-app/contests","/my-11-app/dashboard","/my-11-app/how-to-play","/my-11-app/matches","/my-11-app/profile","/my-11-app/rapidapi-test","/my-11-app/team-builder","/my-11-app/wallet"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
