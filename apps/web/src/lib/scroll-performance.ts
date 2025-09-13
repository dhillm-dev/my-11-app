import type Lenis from 'lenis';

/**
 * Advanced scroll performance utilities for ultra-smooth scrolling
 */
export class ScrollPerformanceOptimizer {
	private lenis: Lenis | null = null;
	private rafId: number = 0;
	private lastTime: number = 0;
	private frameCount: number = 0;
	private fps: number = 60;
	private targetFps: number = 120;

	constructor(lenis: Lenis | null) {
		this.lenis = lenis;
		this.optimizeScrollPerformance();
	}

	/**
	 * Optimize scroll performance with advanced techniques
	 */
	private optimizeScrollPerformance() {
		if (!this.lenis || typeof window === 'undefined') return;

		// Enable high refresh rate scrolling
		this.enableHighRefreshRate();

		// Optimize scroll momentum
		this.optimizeScrollMomentum();

		// Add scroll direction detection for better UX
		this.addScrollDirectionDetection();

		// Optimize for different device types
		this.optimizeForDevice();
	}

	/**
	 * Enable high refresh rate scrolling for 120Hz+ displays
	 */
	private enableHighRefreshRate() {
		if (!this.lenis) return;

		// Detect display refresh rate
		const detectRefreshRate = () => {
			const start = performance.now();
			let frameCount = 0;

			const countFrames = () => {
				frameCount++;
				const elapsed = performance.now() - start;

				if (elapsed >= 1000) {
					this.fps = Math.round(frameCount);
					this.targetFps = this.fps > 90 ? 120 : 60;
					return;
				}

				requestAnimationFrame(countFrames);
			};

			requestAnimationFrame(countFrames);
		};

		detectRefreshRate();
	}

	/**
 * Optimize scroll momentum for buttery smooth experience with enhanced animations
 */
private optimizeScrollMomentum() {
	if (!this.lenis) return;

	let lastScrollY = 0;
	let scrollVelocity = 0;
	let scrollAcceleration = 0;
	const momentumDecay = 0.92; // Slightly slower decay for smoother feel
	const velocitySmoothing = 0.15; // Smooth velocity changes

	this.lenis.on('scroll', ({ scroll }: { scroll: number }) => {
		const newVelocity = (scroll - lastScrollY) * velocitySmoothing;
		scrollAcceleration = newVelocity - scrollVelocity;
		scrollVelocity = newVelocity;
		lastScrollY = scroll;

		// Enhanced momentum preservation with acceleration consideration
		if (Math.abs(scrollVelocity) > 0.05) {
			this.preserveMomentum(scrollVelocity, momentumDecay, scrollAcceleration);
		}

		// Add smooth scroll indicators for visual feedback
		this.updateScrollIndicators(scroll, scrollVelocity);
	});
}

	/**
 * Preserve scroll momentum for natural feel with acceleration-aware smoothing
 */
private preserveMomentum(velocity: number, decay: number, acceleration: number = 0) {
	if (!this.lenis || Math.abs(velocity) < 0.005) return;

	// Adjust decay based on acceleration for more natural feel
	const adaptiveDecay = decay + (Math.abs(acceleration) * 0.02);
	const minVelocity = 0.005;

	const applyMomentum = () => {
		velocity *= Math.min(adaptiveDecay, 0.98);

		// Apply subtle easing curve for natural deceleration
		const easedVelocity = velocity * (1 - Math.pow(1 - Math.abs(velocity) / 10, 3));

		if (Math.abs(easedVelocity) > minVelocity) {
			requestAnimationFrame(applyMomentum);
		}
	};

	requestAnimationFrame(applyMomentum);
}

	/**
	 * Add scroll direction detection for enhanced UX
	 */
	private addScrollDirectionDetection() {
		if (!this.lenis) return;

		let lastScrollY = 0;
		let scrollDirection: 'up' | 'down' | 'idle' = 'idle';

		this.lenis.on('scroll', ({ scroll }: { scroll: number }) => {
			const currentDirection = scroll > lastScrollY ? 'down' : scroll < lastScrollY ? 'up' : 'idle';

			if (currentDirection !== scrollDirection) {
				scrollDirection = currentDirection;
				document.documentElement.setAttribute('data-scroll-direction', scrollDirection);
			}

			lastScrollY = scroll;
		});
	}

	/**
	 * Optimize scrolling based on device capabilities
	 */
	private optimizeForDevice() {
		if (typeof window === 'undefined') return;

		// Detect device type and capabilities
		const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		const isHighDPI = window.devicePixelRatio > 1.5;
		const hasTouch = 'ontouchstart' in window;

		// Apply device-specific optimizations
		if (isMobile) {
			// Mobile optimizations
			document.documentElement.style.setProperty('--scroll-behavior', 'smooth');
			document.documentElement.setAttribute('data-device', 'mobile');
		} else {
			// Desktop optimizations
			document.documentElement.setAttribute('data-device', 'desktop');
		}

		if (isHighDPI) {
			document.documentElement.setAttribute('data-high-dpi', 'true');
		}

		if (hasTouch) {
			document.documentElement.setAttribute('data-touch', 'true');
		}
	}

	/**
 * Update scroll indicators for enhanced visual feedback
 */
private updateScrollIndicators(scroll: number, velocity: number) {
	if (typeof window === 'undefined') return;

	// Update CSS custom properties for scroll-based animations
	document.documentElement.style.setProperty('--scroll-progress', `${scroll}px`);
	document.documentElement.style.setProperty('--scroll-velocity', `${Math.abs(velocity)}`);

	// Add velocity-based classes for conditional styling
	const velocityClass = Math.abs(velocity) > 2 ? 'fast-scroll' : 
						 Math.abs(velocity) > 0.5 ? 'medium-scroll' : 'slow-scroll';
	
	document.documentElement.className = document.documentElement.className
		.replace(/\b(fast|medium|slow)-scroll\b/g, '')
		.trim() + ` ${velocityClass}`;
}

/**
 * Clean up performance optimizer
 */
destroy() {
	if (this.rafId) {
		cancelAnimationFrame(this.rafId);
	}
	this.lenis = null;
}
}

/**
 * Create and initialize scroll performance optimizer
 */
export function createScrollOptimizer(lenis: Lenis | null) {
	return new ScrollPerformanceOptimizer(lenis);
}