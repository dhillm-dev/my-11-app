import { U as sanitize_props, V as rest_props, N as fallback, W as spread_attributes, X as clsx, R as slot, S as bind_props, D as pop, A as push } from "./index2.js";
import { c as cn } from "./utils2.js";
import { b as buttonVariants } from "./button.js";
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
    }
  )}><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></button>`);
  bind_props($$props, { class: className, variant, size, type, disabled });
  pop();
}
export {
  Button as B
};
