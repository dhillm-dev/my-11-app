<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';

	// Props
	export let src: string;
	export let rows: number = 15;
	export let cols: number = 7;
	export let className: string = 'absolute bottom-0 h-[90vh] w-full';

	// Canvas binding
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let img: HTMLImageElement;

	// Types
	interface Peep {
		image: HTMLImageElement;
		rect: number;
		width: number;
		height: number;
		drawArgs: number[];
		x: number;
		y: number;
		anchorY: number;
		scaleX: number;
		walk: gsap.core.Timeline | null;
		setRect: (rect: number) => void;
		render: (ctx: CanvasRenderingContext2D) => void;
	}

	interface Stage {
		width: number;
		height: number;
	}

	// Data structures
	const stage: Stage = { width: 0, height: 0 };
	let allPeeps: Peep[] = [];
	let availablePeeps: Peep[] = [];
	let crowd: Peep[] = [];

	// Helper functions
	function randomRange(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	function randomIndex<T>(array: T[]): number {
		return Math.floor(Math.random() * array.length);
	}

	function removeFromArray<T>(array: T[], item: T): void {
		const index = array.indexOf(item);
		if (index > -1) {
			array.splice(index, 1);
		}
	}

	// Peep factory
	function createPeep(image: HTMLImageElement): Peep {
		const peep: Peep = {
			image,
			rect: 0,
			width: 0,
			height: 0,
			drawArgs: [],
			x: 0,
			y: 0,
			anchorY: 0,
			scaleX: 1,
			walk: null,
			setRect(rect: number) {
				this.rect = rect;
				const sw = this.image.naturalWidth / cols;
				const sh = this.image.naturalHeight / rows;
				const sx = (rect % cols) * sw;
				const sy = Math.floor(rect / cols) * sh;
				this.width = sw;
				this.height = sh;
				this.drawArgs = [sx, sy, sw, sh];
			},
			render(ctx: CanvasRenderingContext2D) {
				ctx.save();
				ctx.translate(this.x, this.y);
				ctx.scale(this.scaleX, 1);
				ctx.drawImage(
					this.image,
					...this.drawArgs,
					-this.width / 2,
					-this.height,
					this.width,
					this.height
				);
				ctx.restore();
			}
		};
		return peep;
	}

	// Create all peeps from sprite sheet
	function createPeeps(): void {
		allPeeps = [];
		for (let i = 0; i < rows * cols; i++) {
			const peep = createPeep(img);
			peep.setRect(i);
			allPeeps.push(peep);
		}
		availablePeeps = [...allPeeps];
	}

	// Tween factories
	function resetPeep({ stage, peep }: { stage: Stage; peep: Peep }): void {
		const direction = Math.random() > 0.5 ? 1 : -1;
		const offsetY = stage.height - randomRange(peep.height * 0.9, peep.height * 0.4);
		
		peep.scaleX = direction;
		peep.x = direction === 1 ? -peep.width : stage.width + peep.width;
		peep.y = offsetY;
		peep.anchorY = offsetY;
	}

	function normalWalk({ peep, props }: { peep: Peep; props: { stage: Stage } }): gsap.core.Timeline {
		const direction = peep.scaleX;
		const endX = direction === 1 ? props.stage.width + peep.width : -peep.width;
		
		const tl = gsap.timeline();
		tl.to(peep, {
			x: endX,
			duration: 10,
			ease: 'none'
		});
		tl.to(peep, {
			y: peep.anchorY + randomRange(-10, 10),
			duration: 0.25,
			repeat: -1,
			yoyo: true,
			ease: 'power2.inOut'
		}, 0);
		
		return tl;
	}

	// Crowd management
	function addPeepToCrowd(): void {
		if (availablePeeps.length === 0) return;
		
		const peepIndex = randomIndex(availablePeeps);
		const peep = availablePeeps[peepIndex];
		removeFromArray(availablePeeps, peep);
		
		resetPeep({ stage, peep });
		peep.walk = normalWalk({ peep, props: { stage } });
		
		peep.walk.eventCallback('onComplete', () => {
			removePeepFromCrowd(peep);
		});
		
		crowd.push(peep);
	}

	function removePeepFromCrowd(peep: Peep): void {
		removeFromArray(crowd, peep);
		availablePeeps.push(peep);
		if (peep.walk) {
			peep.walk.kill();
			peep.walk = null;
		}
	}

	// Initialize crowd
	function initCrowd(): void {
		// Clear existing crowd
		crowd.forEach(peep => {
			if (peep.walk) {
				peep.walk.kill();
				peep.walk = null;
			}
		});
		crowd = [];
		availablePeeps = [...allPeeps];
		
		// Add initial peeps with staggered timing
		const numPeeps = Math.min(12, allPeeps.length);
		for (let i = 0; i < numPeeps; i++) {
			setTimeout(() => {
				addPeepToCrowd();
			}, i * randomRange(100, 1000));
		}
		
		// Continue adding peeps periodically
		const addMorePeeps = () => {
			if (crowd.length < 8) {
				addPeepToCrowd();
			}
			setTimeout(addMorePeeps, randomRange(1000, 3000));
		};
		setTimeout(addMorePeeps, 2000);
	}

	// Render function
	function render(): void {
		if (!ctx || !canvas) return;
		
		const dpr = window.devicePixelRatio || 1;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.scale(dpr, dpr);
		
		// Sort by anchorY for depth ordering
		const sortedCrowd = [...crowd].sort((a, b) => a.anchorY - b.anchorY);
		
		sortedCrowd.forEach(peep => {
			peep.render(ctx);
		});
		
		ctx.restore();
	}

	// Resize function
	function resize(): void {
		if (!canvas) return;
		
		const rect = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		
		stage.width = rect.width;
		stage.height = rect.height;
		
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		canvas.style.width = rect.width + 'px';
		canvas.style.height = rect.height + 'px';
		
		// Reinitialize crowd with new dimensions
		if (allPeeps.length > 0) {
			initCrowd();
		}
	}

	// Lifecycle management
	let resizeHandler: () => void;
	
	onMount(() => {
		if (!canvas) return;
		
		ctx = canvas.getContext('2d')!;
		img = new Image();
		
		img.onload = () => {
			createPeeps();
			resize();
			initCrowd();
			gsap.ticker.add(render);
		};
		
		img.src = src;
		
		// Add resize listener
		resizeHandler = () => {
			resize();
		};
		window.addEventListener('resize', resizeHandler);
	});

	onDestroy(() => {
		// Remove resize listener
		if (resizeHandler) {
			window.removeEventListener('resize', resizeHandler);
		}
		
		// Remove GSAP ticker
		gsap.ticker.remove(render);
		
		// Kill all walk timelines
		crowd.forEach(peep => {
			if (peep.walk) {
				peep.walk.kill();
				peep.walk = null;
			}
		});
		
		// Clear arrays
		crowd = [];
		availablePeeps = [];
		allPeeps = [];
	});
</script>

<canvas bind:this={canvas} class={className}></canvas>

<style>
	canvas {
		pointer-events: none;
		z-index: 1;
	}
</style>