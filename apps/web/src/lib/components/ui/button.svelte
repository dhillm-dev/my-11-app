<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { buttonVariants, type Variant, type Size } from "./button.ts";

	type $$Props = {
		variant?: Variant;
		size?: Size;
		class?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
	};

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let type: $$Props["type"] = "button";
	export let disabled: $$Props["disabled"] = false;
	export { className as class };
</script>

<button
	{type}
	{disabled}
	class={cn(buttonVariants({ variant, size, className }))}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</button>