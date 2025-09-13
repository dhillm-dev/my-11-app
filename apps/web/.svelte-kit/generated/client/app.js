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
	() => import('./nodes/20')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/api-demo": [4],
		"/auth/forgot": [5,[2]],
		"/auth/login": [6,[2]],
		"/auth/register": [7,[2]],
		"/auth/reset": [8,[2]],
		"/button-demo": [9],
		"/contests": [10],
		"/dashboard": [11],
		"/how-to-play": [12],
		"/lenis-demo": [13],
		"/matches": [14],
		"/neo-svelte-demo": [15],
		"/neumorphic-demo": [16],
		"/profile": [17],
		"/rapidapi-test": [18],
		"/team-builder": [19],
		"/wallet": [20]
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