import { Q as sanitize_props, R as rest_props, S as fallback, T as spread_attributes, U as clsx, N as slot, V as bind_props, D as pop, A as push } from "./index2.js";
import { c as cn } from "./utils2.js";
import { cva } from "class-variance-authority";
import "clsx";
function Button($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "variant", "size", "type", "disabled"]);
  push();
  let className = fallback($$props["class"], void 0);
  let variant = fallback($$props["variant"], "default");
  let size = fallback($$props["size"], "default");
  let type = fallback($$props["type"], "button");
  let disabled = fallback($$props["disabled"], false);
  $$payload.out.push(`<button${spread_attributes(
    {
      type,
      disabled,
      class: clsx(cn(buttonVariants({ variant, size, className }))),
      ...$$restProps
    },
    null
  )}><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></button>`);
  bind_props($$props, { class: className, variant, size, type, disabled });
  pop();
}
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
export {
  Button as B
};
