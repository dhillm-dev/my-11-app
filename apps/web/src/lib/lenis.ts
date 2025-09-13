import Lenis from 'lenis';

export type LenisHandle = InstanceType<typeof Lenis> | null;

export function createLenis(opts: ConstructorParameters<typeof Lenis>[0] = {}) {
	if (typeof window === 'undefined') return null;
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	// Disable smoothing for reduced motion users
	const lenis = new Lenis({
		// Ultra-smooth scrolling configuration
		smoothWheel: !prefersReduced,
		smoothTouch: !prefersReduced,
		duration: prefersReduced ? 0.0 : 1.8,
		lerp: prefersReduced ? 1 : 0.05,
		wheelMultiplier: prefersReduced ? 1 : 0.7,
		touchMultiplier: prefersReduced ? 1 : 1.2,
		easing: prefersReduced ? (t: number) => t : (t: number) => 1 - Math.pow(1 - t, 4),
		orientation: 'vertical',
		gestureOrientation: 'vertical',
		infinite: false,
		autoResize: true,
		syncTouch: true,
		syncTouchLerp: 0.08,
		touchInertiaMultiplier: 35,
		prevent: (node: Element) => {
			// Prevent smooth scroll on specific elements
			return node.classList.contains('no-lenis') || 
				   node.tagName === 'INPUT' || 
				   node.tagName === 'TEXTAREA' || 
				   node.tagName === 'SELECT';
		},
		...opts
	});
	return lenis;
}

export function startRaf(lenis: LenisHandle) {
	if (!lenis) return () => {};
	let rafId = 0;
	const raf = (t: number) => {
		lenis!.raf(t);
		rafId = requestAnimationFrame(raf);
	};
	rafId = requestAnimationFrame(raf);
	return () => cancelAnimationFrame(rafId);
}