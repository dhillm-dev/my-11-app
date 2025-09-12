export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25')
];

export const server_loads = [];

export const dictionary = {
		"/": [4],
		"/admin": [5,[2]],
		"/admin/contests": [6,[2]],
		"/admin/login": [7,[2]],
		"/admin/matches": [8,[2]],
		"/admin/players": [9,[2]],
		"/admin/unauthorized": [10,[2]],
		"/admin/users": [11,[2]],
		"/admin/wallet": [12,[2]],
		"/api-demo": [13],
		"/auth/forgot": [14,[3]],
		"/auth/login": [15,[3]],
		"/auth/register": [16,[3]],
		"/auth/reset": [17,[3]],
		"/contests": [18],
		"/dashboard": [19],
		"/how-to-play": [20],
		"/matches": [21],
		"/profile": [22],
		"/rapidapi-test": [23],
		"/team-builder": [24],
		"/wallet": [25]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';