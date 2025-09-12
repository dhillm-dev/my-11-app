
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/contests" | "/admin/login" | "/admin/matches" | "/admin/players" | "/admin/unauthorized" | "/admin/users" | "/admin/wallet" | "/api-demo" | "/api" | "/api/rapidapi-test" | "/api/sofascore" | "/api/sofascore/live" | "/api/sofascore/search" | "/auth" | "/auth/forgot" | "/auth/login" | "/auth/register" | "/auth/reset" | "/contests" | "/dashboard" | "/how-to-play" | "/matches" | "/profile" | "/rapidapi-test" | "/team-builder" | "/wallet";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/contests": Record<string, never>;
			"/admin/login": Record<string, never>;
			"/admin/matches": Record<string, never>;
			"/admin/players": Record<string, never>;
			"/admin/unauthorized": Record<string, never>;
			"/admin/users": Record<string, never>;
			"/admin/wallet": Record<string, never>;
			"/api-demo": Record<string, never>;
			"/api": Record<string, never>;
			"/api/rapidapi-test": Record<string, never>;
			"/api/sofascore": Record<string, never>;
			"/api/sofascore/live": Record<string, never>;
			"/api/sofascore/search": Record<string, never>;
			"/auth": Record<string, never>;
			"/auth/forgot": Record<string, never>;
			"/auth/login": Record<string, never>;
			"/auth/register": Record<string, never>;
			"/auth/reset": Record<string, never>;
			"/contests": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/how-to-play": Record<string, never>;
			"/matches": Record<string, never>;
			"/profile": Record<string, never>;
			"/rapidapi-test": Record<string, never>;
			"/team-builder": Record<string, never>;
			"/wallet": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/contests" | "/admin/contests/" | "/admin/login" | "/admin/login/" | "/admin/matches" | "/admin/matches/" | "/admin/players" | "/admin/players/" | "/admin/unauthorized" | "/admin/unauthorized/" | "/admin/users" | "/admin/users/" | "/admin/wallet" | "/admin/wallet/" | "/api-demo" | "/api-demo/" | "/api" | "/api/" | "/api/rapidapi-test" | "/api/rapidapi-test/" | "/api/sofascore" | "/api/sofascore/" | "/api/sofascore/live" | "/api/sofascore/live/" | "/api/sofascore/search" | "/api/sofascore/search/" | "/auth" | "/auth/" | "/auth/forgot" | "/auth/forgot/" | "/auth/login" | "/auth/login/" | "/auth/register" | "/auth/register/" | "/auth/reset" | "/auth/reset/" | "/contests" | "/contests/" | "/dashboard" | "/dashboard/" | "/how-to-play" | "/how-to-play/" | "/matches" | "/matches/" | "/profile" | "/profile/" | "/rapidapi-test" | "/rapidapi-test/" | "/team-builder" | "/team-builder/" | "/wallet" | "/wallet/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}