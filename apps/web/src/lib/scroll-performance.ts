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
			let start = performance.now();
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
	 * Optimize scroll momentum for buttery smooth experience
	 */
	private optimizeScrollMomentum() {
		if (!this.lenis) return;

		let lastScrollY = 0;
		let scrollVelocity = 0;
		let momentumDecay = 0.95;

		this.lenis.on('scroll', ({ scroll }: { scroll: number }) => {
			scrollVelocity = (scroll - lastScrollY) * 0.1;
			lastScrollY = scroll;

			// Apply momentum preservation
			if (Math.abs(scrollVelocity) > 0.1) {
				this.preserveMomentum(scrollVelocity, momentumDecay);
			}
		});
	}

	/**
	 * Preserve scroll momentum for natural feel
	 */
	private preserveMomentum(velocity: number, decay: number) {
		if (!this.lenis || Math.abs(velocity) < 0.01) return;

		const applyMomentum = () => {
			velocity *= decay;

			if (Math.abs(velocity) > 0.01) {
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