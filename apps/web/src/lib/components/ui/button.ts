import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Button as ButtonPrimitive } from "bits-ui";
import { cn } from "$lib/utils.js";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				// Neumorphic variants inspired by ui-neumorphism
				neumorphic: "neu-btn",
				"neumorphic-primary": "neu-btn neu-btn-primary",
				"neumorphic-success": "neu-btn neu-btn-success",
				"neumorphic-warning": "neu-btn neu-btn-warning",
				"neumorphic-danger": "neu-btn neu-btn-danger",
				"neumorphic-flat": "neu-btn neu-flat",
				"neumorphic-raised": "neu-btn neu-raised",
				"neumorphic-pressed": "neu-btn neu-pressed"
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3 neu-btn-sm",
				lg: "h-11 rounded-md px-8 neu-btn-lg",
				xl: "h-14 rounded-lg px-10 neu-btn-xl",
				icon: "h-10 w-10"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	}
);

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

import Root from "./button.svelte";

export {
	buttonVariants,
	type Variant,
	type Size,
	//
	Root as Button
};