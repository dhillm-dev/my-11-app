<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { onMount } from "svelte";

	type $$Props = {
		value?: string;
		placeholder?: string;
		type?: string;
		disabled?: boolean;
		readonly?: boolean;
		class?: string;
		id?: string;
		name?: string;
		required?: boolean;
		autofocus?: boolean;
		autocomplete?: string | undefined;
		maxlength?: number;
		minlength?: number;
		pattern?: string;
		step?: string | number;
		min?: string | number;
		max?: string | number;
	};

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let placeholder: $$Props["placeholder"] = undefined;
	export let type: $$Props["type"] = "text";
	export let disabled: $$Props["disabled"] = undefined;
	export let readonly: $$Props["readonly"] = undefined;
	export let id: $$Props["id"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let required: $$Props["required"] = undefined;
	export let autofocus: $$Props["autofocus"] = undefined;
	export let autocomplete: $$Props["autocomplete"] = undefined;
	export let maxlength: $$Props["maxlength"] = undefined;
	export let minlength: $$Props["minlength"] = undefined;
	export let pattern: $$Props["pattern"] = undefined;
	export let step: $$Props["step"] = undefined;
	export let min: $$Props["min"] = undefined;
	export let max: $$Props["max"] = undefined;
	export { className as class };

	let inputElement: HTMLInputElement;

	onMount(() => {
		if (autofocus && inputElement) {
			inputElement.focus();
		}
	});
</script>

<input
	bind:this={inputElement}
	bind:value
	{placeholder}
	{type}
	{disabled}
	{readonly}
	{id}
	{name}
	{required}
	autocomplete={autocomplete as any}
	{maxlength}
	{minlength}
	{pattern}
	{step}
	{min}
	{max}
	class={cn(
		"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	on:blur
	on:change
	on:click
	on:focus
	on:focusin
	on:focusout
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	{...$$restProps}
/>