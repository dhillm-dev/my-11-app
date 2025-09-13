import type Lenis from 'lenis';

export function lenisPause(el: HTMLElement, opts: { lenis: Lenis; paused?: boolean }) {
	const { lenis } = opts;
	if (!lenis) return { destroy() {} };
	if (opts.paused) lenis.stop();
	return {
		update(newOpts: { lenis: Lenis; paused?: boolean }) {
			newOpts.paused ? lenis.stop() : lenis.start();
		},
		destroy() {
			lenis.start();
		}
	};
}