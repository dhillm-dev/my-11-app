import Lenis from 'lenis';

export type LenisHandle = InstanceType<typeof Lenis> | null;

export function createLenis(opts: ConstructorParameters<typeof Lenis>[0] = {}) {
	if (typeof window === 'undefined') return null;
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	
	// Enhanced ultra-smooth scrolling configuration for GitHub Pages
	const lenis = new Lenis({
		// Ultra-smooth scrolling configuration - optimized for web deployment
		smoothWheel: !prefersReduced,
		smoothTouch: !prefersReduced,
		duration: prefersReduced ? 0.0 : 2.5, // Increased for even smoother animations
		lerp: prefersReduced ? 1 : 0.035, // Lower for ultra-smooth interpolation
		wheelMultiplier: prefersReduced ? 1 : 0.5, // Gentler wheel response
		touchMultiplier: prefersReduced ? 1 : 1.5, // Enhanced touch responsiveness
		easing: prefersReduced ? (t: number) => t : (t: number) => {
			// Custom cubic-bezier easing for natural deceleration
			return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
		},
		orientation: 'vertical',
		gestureOrientation: 'vertical',
		infinite: false,
		autoResize: true,
		syncTouch: true,
		syncTouchLerp: 0.05, // Smoother touch sync
		touchInertiaMultiplier: 45, // Enhanced touch momentum
		// Advanced scroll behavior
		normalizeWheel: true,
		smoothing: 0.1, // Additional smoothing layer
		prevent: (node: Element) => {
			// Prevent smooth scroll on specific elements
			return node.classList.contains('no-lenis') || 
				   node.tagName === 'INPUT' || 
				   node.tagName === 'TEXTAREA' || 
				   node.tagName === 'SELECT' ||
				   node.closest('.no-smooth-scroll') !== null;
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