import { _ as current_component, Q as sanitize_props, A as push, T as spread_attributes, P as attr, D as pop, J as stringify, V as bind_props, $ as element, a0 as spread_props, G as escape_html, I as attr_class, W as copy_payload, X as assign_payload, Z as attr_style, M as getContext, O as ensure_array_like, B as setContext, a1 as run, F as head } from "../../../chunks/index2.js";
import { clamp } from "@dvcol/common-utils/common/math";
import "clsx";
import { debounce } from "@dvcol/common-utils/common/debounce";
import "@dvcol/common-utils/common/element";
import { getUUID } from "@dvcol/common-utils/common/string";
import { ProxyLogger, LogLevel, toLogLevel } from "@dvcol/common-utils/common/logger";
import "@dvcol/common-utils/common/cursor";
import "@dvcol/common-utils/common/browser";
import "@dvcol/common-utils/common/mobile";
import "@dvcol/common-utils/common/touch";
import { percent, round } from "@dvcol/common-utils";
import { toStyle } from "@dvcol/common-utils/common/class";
import "@dvcol/common-utils/common/object";
import { wait } from "@dvcol/common-utils/common/promise";
import { computePosition, flip, offset } from "@floating-ui/dom";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
async function tick() {
}
function cubic_out(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function slide(node, { delay = 0, duration = 400, easing = cubic_out, axis = "y" } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = parseFloat(style[primary_property]);
  const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map(
    (e) => (
      /** @type {'Left' | 'Right' | 'Top' | 'Bottom'} */
      `${e[0].toUpperCase()}${e.slice(1)}`
    )
  );
  const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
  const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
  const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
  const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
  const border_width_start_value = parseFloat(
    style[`border${capitalized_secondary_properties[0]}Width`]
  );
  const border_width_end_value = parseFloat(
    style[`border${capitalized_secondary_properties[1]}Width`]
  );
  return {
    delay,
    duration,
    easing,
    css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;min-${primary_property}: 0`
  };
}
const emptyTransition = () => () => ({});
const parseCSSString = (node, css) => {
  if (!node)
    return 0;
  let value = getComputedStyle(node)[css];
  if (typeof value === "number")
    return value;
  if (typeof value !== "string")
    return 0;
  if (!value)
    return 0;
  value = parseFloat(value);
  if (Number.isNaN(value))
    return 0;
  return value;
};
const evaluateFn = (value, node) => {
  if (typeof value === "function")
    return value(node);
  return value;
};
const opacityRegex = /opacity: [0-9.]+;/;
const replaceOpacity = (css, min = false, value) => {
  if (min === false)
    return css.replace(opacityRegex, "");
  return css.replace(opacityRegex, `opacity: ${clamp(value, typeof min === "number" ? min : 0, 1)};`);
};
function width(node, { easing = (x) => x, freeze = true, skip = false, css, opacity, transform = (_css) => _css, ...params } = {}, { direction } = {}) {
  const { delay, duration, css: widthCss } = slide(node, { axis: "x", easing, ...params });
  const _height = parseCSSString(node, "height");
  const _opacity = +getComputedStyle(node).opacity;
  const { minimum = 0, easing: opacityEasing = easing } = typeof opacity === "object" ? opacity : {};
  return {
    delay,
    duration,
    easing,
    css: (t, u) => {
      if (evaluateFn(skip, node))
        return "";
      let _css = css?.length ? `${css};
` : "";
      if (widthCss)
        _css += widthCss(t, u);
      if (opacity)
        _css = replaceOpacity(_css, minimum, opacityEasing(t) * _opacity);
      if (!evaluateFn(freeze, node) || direction === "in")
        return transform(_css, t, u);
      return transform(`${_css};
height: ${_height}px`, t, u);
    }
  };
}
function debounced(getter, delay = 0, cb) {
  let current = void 0;
  debounce(
    (v) => {
      current = v;
    },
    delay
  );
  return () => current;
}
function IconAlert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: $$sanitized_props.size ?? "1em",
      height: $$sanitized_props.size ?? "1em",
      viewBox: "0 0 24 24",
      ...$$sanitized_props,
      scale: void 0
    },
    null,
    void 0,
    { scale: $$sanitized_props.scale },
    3
  )}><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", $$sanitized_props.stroke ?? 1.5)}><path stroke-dasharray="64" stroke-dashoffset="64" d="M5.64 5.64c3.51 -3.51 9.21 -3.51 12.73 0c3.51 3.51 3.51 9.21 0 12.73c-3.51 3.51 -9.21 3.51 -12.73 0c-3.51 -3.51 -3.51 -9.21 -0 -12.73Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M6 6l12 12"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="20;0"></animate></path></g></svg>`);
  pop();
}
function IconCircleLoading($$payload, $$props) {
  const {
    size = "1em",
    scale,
    stroke = 1.5,
    animate = true,
    speed = 1.2,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      ...rest
    },
    null,
    void 0,
    { scale },
    3
  )}><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", stroke)}><path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset"${attr("dur", `${stringify(speed / 4)}s`)} values="16;0"></animate><animateTransform attributeName="transform"${attr("dur", `${stringify(speed * 1.25)}s`)} repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></path><path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity="0.3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset"${attr("dur", animate ? `${speed}s` : 0)}${attr("values", animate ? "64;0" : "0;64")}></animate></path></g></svg>`);
  bind_props($$props, { size, scale, stroke, animate, speed, rest });
}
function IconClear($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: $$sanitized_props.size ?? "1em",
      height: $$sanitized_props.size ?? "1em",
      viewBox: "0 0 24 24",
      ...$$sanitized_props,
      scale: void 0
    },
    null,
    void 0,
    { scale: $$sanitized_props.scale },
    3
  )}><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", $$sanitized_props.stroke ?? 1.5)}><path d="M7 7l10 10"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0"></animate></path><path d="M17 7l-10 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="16;0"></animate></path></g></svg>`);
  pop();
}
function IconConfirm($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: $$sanitized_props.size ?? "1em",
      height: $$sanitized_props.size ?? "1em",
      viewBox: "0 0 24 24",
      ...$$sanitized_props,
      scale: void 0
    },
    null,
    void 0,
    { scale: $$sanitized_props.scale },
    3
  )}><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", $$sanitized_props.stroke ?? 1.5)}><path stroke-dasharray="64" stroke-dashoffset="64" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12l3 3l5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0"></animate></path></g></svg>`);
  pop();
}
const emptyUse = () => ({});
function isTransitionWithProps(transition) {
  return "use" in transition && transition.use !== void 0;
}
function toFunction(transition) {
  if (!transition)
    return;
  if (isTransitionWithProps(transition))
    return transition.use;
  return transition;
}
function toTransition(transition, fallback = emptyTransition) {
  return toFunction(transition) ?? fallback;
}
function toTransitionProps(transition, fallback) {
  if (!transition)
    return fallback;
  if (isTransitionWithProps(transition))
    return transition.props;
  return fallback;
}
function isActionWithProps(action) {
  return "use" in action && action.use !== void 0;
}
function toAction(action) {
  if (!action)
    return emptyUse;
  if (isActionWithProps(action))
    return action.use;
  return action;
}
function toActionProps(action) {
  if (!action)
    return;
  if (isActionWithProps(action))
    return action.props;
}
const quickDuration = 200;
const quickDurationProps = { duration: quickDuration };
function NeoAffix($$payload, $$props) {
  push();
  let {
    // Snippets
    reset,
    loader,
    validation,
    // States
    tag = "span",
    ref = void 0,
    loading,
    close,
    valid,
    skeleton = false,
    disabled,
    readonly,
    // Styles
    size,
    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Other props
    closeProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const clear = debounced(() => close && !disabled && !readonly, 100)();
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  element(
    $$payload,
    tag,
    () => {
      $$payload.out.push(`${spread_attributes({ ...rest }, "svelte-1tpszhp", { "neo-affix-container": true, "neo-skeleton": skeleton }, { "--neo-affix-size": size })}`);
    },
    () => {
      if (loading) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span class="neo-affix-loading svelte-1tpszhp">`);
        if (loader) {
          $$payload.out.push("<!--[-->");
          loader($$payload, { size });
          $$payload.out.push(`<!---->`);
        } else {
          $$payload.out.push("<!--[!-->");
          IconCircleLoading($$payload, {});
        }
        $$payload.out.push(`<!--]--></span>`);
      } else {
        $$payload.out.push("<!--[!-->");
        if (clear) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button${spread_attributes(
            {
              type: "button",
              disabled,
              "aria-label": "clear",
              ...closeProps
            },
            "svelte-1tpszhp",
            { "neo-affix-clear": true }
          )}>`);
          if (reset) {
            $$payload.out.push("<!--[-->");
            reset($$payload, { size });
            $$payload.out.push(`<!---->`);
          } else {
            $$payload.out.push("<!--[!-->");
            IconClear($$payload, {});
          }
          $$payload.out.push(`<!--]--></button>`);
        } else {
          $$payload.out.push("<!--[!-->");
          $$payload.out.push(`<span class="neo-affix-validation svelte-1tpszhp"${attr("data-valid", valid)}>`);
          if (valid !== void 0) {
            $$payload.out.push("<!--[-->");
            if (validation) {
              $$payload.out.push("<!--[-->");
              validation($$payload, { size, valid });
              $$payload.out.push(`<!---->`);
            } else {
              $$payload.out.push("<!--[!-->");
              if (valid) {
                $$payload.out.push("<!--[-->");
                IconConfirm($$payload, {});
              } else {
                $$payload.out.push("<!--[!-->");
                IconAlert($$payload, {});
              }
              $$payload.out.push(`<!--]-->`);
            }
            $$payload.out.push(`<!--]-->`);
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]--></span>`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
  );
  bind_props($$props, { ref });
  pop();
}
const Colors = {
  Primary: "primary",
  Secondary: "secondary",
  Success: "success",
  Warning: "warning",
  Error: "error",
  Default: "default"
};
const ColorVariables = {
  [Colors.Primary]: "--neo-color-primary",
  [Colors.Secondary]: "--neo-color-secondary",
  [Colors.Success]: "--neo-color-success",
  [Colors.Warning]: "--neo-color-warning",
  [Colors.Error]: "--neo-color-error",
  [Colors.Default]: "--neo-color-default"
};
function getColorVariable(color) {
  if (!color || !ColorVariables[color])
    return color;
  return `var(${ColorVariables[color]})`;
}
const NeoFlatButton = {
  elevation: 0,
  hover: -1,
  active: -2,
  pressed: false
};
const NeoTextButton = {
  ...NeoFlatButton,
  borderless: true
};
const MaxShadowElevation = 5;
const MinShadowElevation = -5;
const MaxShallowShadowElevation = 3;
const MinShallowShadowElevation = -3;
const DefaultShallowMinMaxElevation = {
  max: MaxShallowShadowElevation,
  min: MinShallowShadowElevation
};
const DefaultShadowElevation = 3;
const DefaultShadowActiveElevation = -2;
const DefaultShadowPressedElevation = -2;
const DefaultShadowHoverElevation = -1;
const DefaultShadowHoverPressedElevation = 0;
const DefaultShadowShallowElevation = 2;
const ShadowFlatRegex = /^.*flat\)?;?$/;
const DefaultSaturation = 3;
function getDefaultElevation(pressed, fallback = DefaultShadowElevation) {
  return pressed ? DefaultShadowPressedElevation : fallback;
}
function getDefaultHoverElevation(pressed, fallback = DefaultShadowHoverElevation) {
  return pressed ? DefaultShadowHoverPressedElevation : fallback;
}
function coerce(elevation, { min, max } = {}) {
  if (elevation === void 0 || elevation === null)
    return elevation;
  const _elevation = Number(elevation);
  if (min !== void 0 && _elevation < min)
    return min;
  if (max !== void 0 && _elevation > max)
    return max;
  return _elevation;
}
function parseBlur(blur, elevation, minMax = { min: 1, max: 5 }) {
  if (!blur || elevation === void 0)
    return minMax.min ?? 1;
  return coerce(blur ?? elevation, minMax);
}
const isShadowFlat = (shadow) => ShadowFlatRegex.test(shadow);
function computeElevation(elevation, { min = MinShadowElevation, max = MaxShadowElevation } = {}) {
  if (elevation < min)
    return min;
  if (elevation > max)
    return max;
  return elevation;
}
function computeShadowElevation(elevation, { glass, convex, pressed, active } = {}, minMax = {}) {
  const raided = convex ? "convex" : "raised";
  let inset = "inset";
  if (pressed)
    inset = "pressed";
  if (active)
    inset = "active";
  let shadow = `var(--neo-${glass ? "glass-" : ""}box-shadow-`;
  const level = computeElevation(elevation, minMax);
  if (!level)
    return `${shadow}flat)`;
  shadow += level < 0 ? inset : raided;
  return `${shadow}-${Math.trunc(Math.abs(level))})`;
}
function computeHoverShadowElevation(elevation, hover, options, minMax = {}) {
  if (!hover)
    return;
  return computeShadowElevation(elevation + hover, options, minMax);
}
function computeGlassFilter(elevation, glass, { min = 1, max = MaxShadowElevation, saturation = DefaultSaturation } = {}) {
  if (!glass)
    return;
  return `var(--neo-blur-${clamp(Math.abs(elevation), min, max)}) var(--neo-saturate-${saturation})`;
}
function NeoPill($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    // States
    tag = "div",
    close,
    color,
    loading,
    disabled,
    skeleton = false,
    size,
    // Styles
    borderless,
    rounded = true,
    pressed,
    glass,
    tinted,
    filled,
    start,
    // Shadow
    elevation: _elevation = pressed ? -1 : 1,
    hover: _hover = 0,
    blur: _blur,
    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Actions
    use,
    // Events
    onClose,
    // Other props
    affixProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const elevation = coerce(_elevation);
  const hover = coerce(_hover);
  const blur = parseBlur(_blur, elevation);
  const filter = computeGlassFilter(blur, glass);
  const boxShadow = computeShadowElevation(elevation, { glass, pressed }, DefaultShallowMinMaxElevation);
  const hoverShadow = computeHoverShadowElevation(elevation, hover, { glass, pressed }, DefaultShallowMinMaxElevation) ?? boxShadow;
  const hoverFlat = isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow);
  const flatHover = isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow);
  const context = {
    close,
    color,
    loading,
    disabled,
    skeleton,
    elevation,
    borderless,
    rounded,
    pressed,
    glass,
    tinted,
    filled,
    start
  };
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  toAction(use);
  toActionProps(use);
  element(
    $$payload,
    tag,
    () => {
      $$payload.out.push(`${spread_attributes(
        { "data-type": size, ...rest },
        "svelte-m6qbjv",
        {
          "neo-pill": true,
          "neo-borderless": borderless,
          "neo-rounded": rounded,
          "neo-disabled": disabled,
          "neo-skeleton": skeleton,
          "neo-pressed": pressed,
          "neo-glass": glass,
          "neo-tinted": tinted,
          "neo-filled": filled,
          "neo-start": start,
          "neo-hover": hover,
          "neo-hover-flat": hoverFlat,
          "neo-flat-hover": flatHover,
          "neo-flat": !elevation,
          "neo-inset": elevation < 0,
          "neo-inset-hover": elevation + hover < 0
        },
        {
          "--neo-pill-glass-blur": filter,
          "--neo-pill-box-shadow": boxShadow,
          "--neo-pill-box-shadow-hover": hoverShadow,
          "--neo-pill-text-color": getColorVariable(color)
        }
      )}`);
    },
    () => {
      children?.($$payload, context);
      $$payload.out.push(`<!----> `);
      if (close && !disabled || loading) {
        $$payload.out.push("<!--[-->");
        NeoAffix($$payload, spread_props([
          {
            loading,
            skeleton,
            disabled,
            close,
            transition: { use: width, props: quickDurationProps }
          },
          affixProps,
          {
            closeProps: {
              "aria-label": "close",
              "onclick": onClose,
              ...affixProps?.closeProps
            },
            class: ["neo-pill-affix", affixProps?.class]
          }
        ]));
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
  );
  pop();
}
function NeoBadge($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    value,
    // States
    offset: _offset,
    placement = "top-right",
    // Other props
    containerProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: containerTag = "div", ...containerRest } = containerProps ?? {};
  const offset2 = (() => {
    if (typeof _offset === "string") {
      return { x: _offset, y: _offset };
    }
    if (typeof _offset === "number") {
      return { x: `${_offset}px`, y: `${_offset}px` };
    }
    return {
      x: typeof _offset?.x === "number" ? `${_offset.x}px` : _offset?.x,
      y: typeof _offset?.y === "number" ? `${_offset.y}px` : _offset?.y
    };
  })();
  element(
    $$payload,
    containerTag,
    () => {
      $$payload.out.push(`${spread_attributes({ "data-placement": placement, ...containerRest }, "svelte-1jvcnx8", { "neo-badge-container": true }, {
        "--neo-badge-offset-x": offset2?.x,
        "--neo-badge-offset-y": offset2?.y
      })}`);
    },
    () => {
      NeoPill($$payload, spread_props([
        {
          class: "neo-badge-pill",
          size: "medium",
          glass: true,
          elevation: "2",
          tinted: true
        },
        rest,
        {
          children: ($$payload2) => {
            if (typeof value === "function") {
              $$payload2.out.push("<!--[-->");
              value($$payload2, { placement, offset: offset2 });
              $$payload2.out.push(`<!---->`);
            } else {
              $$payload2.out.push("<!--[!-->");
              $$payload2.out.push(`${escape_html(value)}`);
            }
            $$payload2.out.push(`<!--]-->`);
          },
          $$slots: { default: true }
        }
      ]));
      $$payload.out.push(`<!----> `);
      children?.($$payload, { placement, offset: offset2 });
      $$payload.out.push(`<!---->`);
    }
  );
  pop();
}
function NeoButton($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    label,
    icon,
    // States
    ref = void 0,
    tag,
    href,
    loading,
    skeleton = false,
    disabled,
    empty: only,
    toggle,
    readonly,
    checked = false,
    hovered = false,
    focused = false,
    // Styles
    start,
    color,
    text,
    glass,
    filled,
    tinted,
    rounded,
    container,
    borderless = text || container,
    reverse,
    coalesce,
    pulse,
    scale = true,
    ratio,
    // Flex
    justify,
    align,
    flex,
    // Events
    onchecked,
    onclick,
    onkeydown,
    onkeyup,
    onfocus,
    onblur,
    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Actions
    use,
    $$slots,
    $$events,
    // Other props
    ..._rest
  } = $$props;
  const {
    elevation: _elevation = DefaultShadowElevation,
    hover: _hover = DefaultShadowHoverElevation,
    active: _active = DefaultShadowActiveElevation,
    pressed: _pressed,
    blur: _blur,
    ...rest
  } = (() => {
    if (text || container) return { ...NeoTextButton, ..._rest };
    return {
      ..._rest,
      elevation: _rest.elevation ?? getDefaultElevation(_rest.pressed)
    };
  })();
  const elevation = coerce(_elevation);
  const hover = coerce(_hover);
  const active = coerce(_active);
  const hoverElevation = elevation + hover;
  const activePressed = _pressed ?? hoverElevation > 0;
  const blur = parseBlur(_blur, elevation);
  const filter = computeGlassFilter(blur, glass);
  const boxShadow = computeShadowElevation(elevation, { glass });
  const hoverShadow = computeHoverShadowElevation(elevation, hover, { glass }) ?? boxShadow;
  const activeShadow = computeShadowElevation(active, {
    glass,
    pressed: !glass && activePressed,
    active: glass && activePressed
  }) ?? boxShadow;
  const activeFlat = isShadowFlat(activeShadow);
  const hoverFlat = isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow);
  const flatHover = isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow);
  const pressed = checked;
  const empty = only || !children && label === void 0;
  const scalePressed = typeof scale === "boolean" ? void 0 : scale;
  const element$1 = tag ?? (href ? "a" : "button");
  const role = !["button", "a"].includes(element$1) ? "button" : void 0;
  const type = element$1 === "button" ? "button" : void 0;
  const tabindex = (() => {
    if (readonly) return -1;
    if (!disabled && role) return 0;
  })();
  const context = {
    ref,
    href,
    loading,
    disabled,
    readonly,
    skeleton,
    hovered,
    focused,
    empty,
    toggle,
    checked,
    pressed
  };
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  toAction(use);
  toActionProps(use);
  element(
    $$payload,
    element$1,
    () => {
      $$payload.out.push(`${spread_attributes(
        {
          href: loading || disabled || readonly ? void 0 : href,
          "aria-disabled": readonly && !disabled,
          type,
          role,
          tabindex,
          disabled,
          ...rest
        },
        "svelte-1fhtemq",
        {
          "neo-button": true,
          "neo-readonly": readonly,
          "neo-pulse": pulse,
          "neo-coalesce": coalesce,
          "neo-pressed": pressed,
          "neo-toggle": toggle,
          "neo-loading": loading,
          "neo-skeleton": skeleton,
          "neo-start": start,
          "neo-glass": glass,
          "neo-scale": scale,
          "neo-tinted": tinted,
          "neo-filled": filled,
          "neo-flat": !elevation,
          "neo-hover": hover,
          "neo-hover-flat": hoverFlat,
          "neo-flat-hover": flatHover,
          "neo-flat-active": activeFlat,
          "neo-container": container,
          "neo-borderless": borderless,
          "neo-inset": elevation < 0,
          "neo-inset-hover": hoverElevation < 0,
          "neo-rounded": rounded,
          "neo-empty": empty
        },
        {
          "--neo-btn-text-color": getColorVariable(color),
          "--neo-btn-backdrop-filter": filter,
          "--neo-btn-box-shadow": boxShadow,
          "--neo-btn-box-shadow-hover": hoverShadow,
          "--neo-btn-box-shadow-active": activeShadow,
          "--neo-btn-scale-pressed": scalePressed,
          "justify-content": justify,
          "align-items": align,
          flex,
          "aspect-ratio": ratio
        }
      )}`);
    },
    () => {
      $$payload.out.push(`<div${attr_class("neo-content svelte-1fhtemq", void 0, { "neo-reverse": reverse })}>`);
      if (loading || icon) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span${attr_class("neo-icon svelte-1fhtemq", void 0, { "neo-only": empty })}>`);
        if (loading) {
          $$payload.out.push("<!--[-->");
          IconCircleLoading($$payload, {});
        } else {
          $$payload.out.push("<!--[!-->");
          icon?.($$payload, context);
          $$payload.out.push(`<!---->`);
        }
        $$payload.out.push(`<!--]--></span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> `);
      if (!empty) {
        $$payload.out.push("<!--[-->");
        if (typeof label === "function") {
          $$payload.out.push("<!--[-->");
          label?.($$payload, context);
          $$payload.out.push(`<!---->`);
        } else {
          $$payload.out.push("<!--[!-->");
          if (label !== void 0) {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`${escape_html(label)}`);
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]--> `);
        children?.($$payload, context);
        $$payload.out.push(`<!---->`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    }
  );
  bind_props($$props, { ref, checked, hovered, focused });
  pop();
}
function toPixel(value) {
  if (!value)
    return;
  return typeof value === "number" ? `${value}px` : value;
}
function toSize(size) {
  if (!size)
    return;
  if (typeof size === "number")
    return { absolute: toPixel(size) };
  if (typeof size === "string")
    return { absolute: size };
  return Object.entries(size).reduce((acc, [key, value]) => {
    return { ...acc, [key]: toPixel(value) };
  }, {});
}
function IconCheckbox($$payload, $$props) {
  const {
    box = 1.25,
    check = 2,
    size = "1em",
    scale = 1.6,
    border = false,
    circle = false,
    draw = false,
    enter = true,
    checked = false,
    indeterminate = false,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const circlePath = "M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z";
  const squarePath = "M4 12v-7c0 -0.55 0.45 -1 1 -1h14c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1Z";
  $$payload.out.push(`<!---->`);
  {
    $$payload.out.push(`<svg${spread_attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: size ?? "1em",
        height: size ?? "1em",
        viewBox: "0 0 24 24",
        ...rest
      },
      null,
      void 0,
      { scale },
      3
    )}><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", box)}>`);
    if (border) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<path stroke-opacity="0.5" stroke-dasharray="64"${attr("stroke-dashoffset", !checked || !draw ? 0 : 64)}${attr("d", circle ? circlePath : squarePath)}>`);
      if (draw) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<animate fill="freeze" attributeName="stroke-dashoffset"${attr("begin", checked || indeterminate ? 0 : "0.2s")}${attr("dur", enter && draw ? "0.6s" : 0)}${attr("values", checked || indeterminate ? "64;0" : "0;64")}></animate>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></path>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
    if (indeterminate) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<path stroke-dasharray="12" stroke-dashoffset="12" d="M7 12h10"><animate fill="freeze" attributeName="stroke-dashoffset"${attr("begin", !draw || !border || !enter ? 0 : "0.6s")}${attr("dur", enter ? "0.2s" : 0)}${attr("values", enter ? "12;0" : "0;12")}></animate></path>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<path${attr("stroke-dasharray", !enter && checked ? 0 : 14)} stroke-dashoffset="14" d="M8 12l3 3l5 -5"${attr("stroke-width", check)}><animate fill="freeze" attributeName="stroke-dashoffset"${attr("begin", !checked || !draw || !border || !enter ? 0 : "0.6s")}${attr("dur", enter ? "0.2s" : 0)}${attr("values", checked || !enter ? "14;0" : "0;14")}></animate></path>`);
    }
    $$payload.out.push(`<!--]--></g></svg>`);
  }
  $$payload.out.push(`<!---->`);
}
function NeoCheckboxButton($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    // State
    checked = false,
    indeterminate = false,
    touched = false,
    disabled,
    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,
    // Styles
    start,
    glass,
    color,
    tinted,
    rounded,
    skeleton = false,
    $$slots,
    $$events,
    // Other props
    ...rest
  } = $$props;
  const elevation = coerce(_elevation);
  const boxShadow = computeShadowElevation(elevation, { glass, active: glass }, DefaultShallowMinMaxElevation);
  const checkedShadow = computeShadowElevation(-Math.abs(elevation), { glass, active: glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation);
  $$payload.out.push(`<button${spread_attributes(
    {
      type: "button",
      class: "neo-checkbox-button",
      role: "checkbox",
      "aria-checked": indeterminate ? "mixed" : checked,
      ...rest
    },
    "svelte-h9hqkw",
    {
      "neo-checked": checked || indeterminate,
      "neo-rounded": rounded,
      "neo-start": start,
      "neo-glass": glass,
      "neo-tinted": tinted,
      "neo-disabled": disabled,
      "neo-skeleton": skeleton,
      "neo-flat": !elevation,
      "neo-inset": elevation <= 0
    },
    {
      "--neo-checkbox-color": getColorVariable(color),
      "--neo-checkbox-box-shadow": boxShadow,
      "--neo-checkbox-checked-shadow": checkedShadow
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----> `);
  IconCheckbox($$payload, {
    circle: rounded,
    indeterminate: !!indeterminate,
    checked: !!checked,
    enter: touched
  });
  $$payload.out.push(`<!----></button>`);
  bind_props($$props, { checked, indeterminate, touched });
  pop();
}
function IconClose($$payload, $$props) {
  const {
    size = "1em",
    scale = 1,
    stroke = 1.5,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      ...rest
    },
    null,
    void 0,
    { scale },
    3
  )}><path fill="none" stroke="currentColor" stroke-dasharray="12" stroke-dashoffset="12" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", stroke)} d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0"></animate></path></svg>`);
}
function NeoCloseButton($$payload, $$props) {
  push();
  let {
    // Button props
    ref = void 0,
    checked = false,
    hovered = false,
    focused = false,
    // Other Props
    iconProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  function icon($$payload2) {
    IconClose($$payload2, spread_props([{ size: "0.875rem" }, iconProps]));
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<div class="neo-close-button svelte-b5vnrp">`);
    NeoButton($$payload2, spread_props([
      { icon },
      rest,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        get checked() {
          return checked;
        },
        set checked($$value) {
          checked = $$value;
          $$settled = false;
        },
        get hovered() {
          return hovered;
        },
        set hovered($$value) {
          hovered = $$value;
          $$settled = false;
        },
        get focused() {
          return focused;
        },
        set focused($$value) {
          focused = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!----></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref, checked, hovered, focused });
  pop();
}
function IconRadio($$payload, $$props) {
  const {
    scale = 1,
    size = "1em",
    checked = false,
    circle = false,
    enter = true,
    stroke = 2,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const circlePath = "M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z";
  const squarePath = "m 3 12 v -4 c 0 -3 1 -5 4 -5 H 16 c 3 0 5 2 5 5 V 16 C 21 19 19 21 16 21 h -8 C 5 21 3 19 3 16 Z";
  $$payload.out.push(`<!---->`);
  {
    $$payload.out.push(`<svg${spread_attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: size ?? "1em",
        height: size ?? "1em",
        viewBox: "0 0 24 24",
        ...rest
      },
      null,
      void 0,
      { scale },
      3
    )}><g stroke="none" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", stroke)}><path fill="currentColor"${attr("fill-opacity", !enter && checked ? 1 : 0)} stroke-dasharray="64"${attr("d", circle ? circlePath : squarePath)}>`);
    if (enter) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<animate fill="freeze" attributeName="fill-opacity" dur="0.2s"${attr("values", checked ? "0;1" : "1;0")}></animate>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></path></g></svg>`);
  }
  $$payload.out.push(`<!---->`);
}
function NeoRadioButton($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    // State
    checked = false,
    touched = false,
    disabled,
    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,
    // Styles
    start,
    glass,
    color,
    tinted,
    rounded = true,
    skeleton = false,
    $$slots,
    $$events,
    // Other props
    ...rest
  } = $$props;
  const elevation = coerce(_elevation);
  const boxShadow = computeShadowElevation(elevation, { glass, active: glass }, DefaultShallowMinMaxElevation);
  const checkedShadow = computeShadowElevation(-Math.abs(elevation), { glass, active: glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation);
  $$payload.out.push(`<button${spread_attributes(
    {
      type: "button",
      role: "radio",
      "aria-checked": checked,
      ...rest
    },
    "svelte-1wyan4a",
    {
      "neo-radio-button": true,
      "neo-checked": checked,
      "neo-rounded": rounded,
      "neo-start": start,
      "neo-glass": glass,
      "neo-tinted": tinted,
      "neo-disabled": disabled,
      "neo-skeleton": skeleton,
      "neo-flat": !elevation,
      "neo-inset": elevation <= 0
    },
    {
      "--neo-radio-color": getColorVariable(color),
      "--neo-radio-box-shadow": boxShadow,
      "--neo-radio-checked-shadow": checkedShadow
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----> `);
  IconRadio($$payload, {
    circle: rounded,
    scale: rounded ? 0.75 : 0.9,
    checked: !!checked,
    enter: touched
  });
  $$payload.out.push(`<!----></button>`);
  bind_props($$props, { checked, touched });
  pop();
}
function NeoSwitchButton($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    handle,
    on,
    off,
    // State
    checked = false,
    indeterminate = false,
    valid,
    disabled,
    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,
    // Styles
    start,
    glass,
    color,
    tinted,
    rounded = true,
    skeleton = false,
    $$slots,
    $$events,
    // Other props
    ...rest
  } = $$props;
  const elevation = coerce(_elevation);
  const boxShadow = computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation);
  const context = { checked, indeterminate, disabled };
  let toggleWidth = void 0;
  function label($$payload2, content) {
    if (content && typeof content === "function") {
      $$payload2.out.push("<!--[-->");
      content?.($$payload2, context);
      $$payload2.out.push(`<!---->`);
    } else {
      $$payload2.out.push("<!--[!-->");
      if (content !== void 0) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`${escape_html(content)}`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]-->`);
    }
    $$payload2.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<button${spread_attributes(
    {
      type: "button",
      role: "switch",
      "aria-checked": indeterminate ? "mixed" : checked,
      ...rest
    },
    "svelte-1h59c05",
    {
      "neo-switch-button": true,
      "neo-checked": checked,
      "neo-indeterminate": indeterminate,
      "neo-rounded": rounded,
      "neo-start": start,
      "neo-glass": glass,
      "neo-tinted": tinted,
      "neo-disabled": disabled,
      "neo-skeleton": skeleton,
      "neo-flat": !elevation,
      "neo-valid": valid === true,
      "neo-invalid": valid === false
    },
    {
      "--neo-switch-color": getColorVariable(color),
      "--neo-switch-box-shadow": boxShadow,
      "--neo-switch-toggle-width": `${stringify(toggleWidth)}px`
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----> <span class="neo-switch-rail svelte-1h59c05"><span${attr_class("neo-switch-on svelte-1h59c05", void 0, { "neo-visible": checked })}>`);
  label($$payload, on);
  $$payload.out.push(`<!----></span> <span class="neo-switch-toggle svelte-1h59c05">`);
  label($$payload, handle);
  $$payload.out.push(`<!----></span> <span${attr_class("neo-switch-off svelte-1h59c05", void 0, { "neo-visible": !checked })}>`);
  label($$payload, off);
  $$payload.out.push(`<!----></span></span></button>`);
  bind_props($$props, { checked, indeterminate });
  pop();
}
function NeoDivider($$payload, $$props) {
  push();
  const {
    // State
    vertical = false,
    skeleton = false,
    // Shadow
    elevation: _elevation = 0,
    // Styles
    margin,
    height,
    width: width2,
    flex,
    glass,
    rounded = true,
    $$slots,
    $$events,
    // Other props
    ...rest
  } = $$props;
  const elevation = coerce(_elevation);
  const boxShadow = computeShadowElevation(elevation);
  const minimum = (() => {
    if (elevation <= -5) return "24px";
    if (elevation <= -4) return "16px";
    if (elevation <= -3) return "12px";
    if (elevation <= -2) return "10px";
    if (elevation <= -1) return "8px";
    if (elevation <= 1) return "1px";
    if (elevation <= 2) return "4px";
    if (elevation <= 3) return "6px";
    if (elevation <= 4) return "12px";
    return "16px";
  })();
  $$payload.out.push(`<div${spread_attributes(
    {
      role: "separator",
      "aria-orientation": vertical ? "vertical" : "horizontal",
      "data-elevation": elevation,
      ...rest
    },
    "svelte-t6rruz",
    {
      "neo-divider": true,
      "neo-vertical": vertical,
      "neo-flat": !elevation,
      "neo-glass": glass,
      "neo-rounded": rounded,
      "neo-skeleton": skeleton
    },
    {
      flex,
      "--neo-divider-height": height,
      "--neo-divider-width": width2,
      "--neo-divider-margin": margin,
      "--neo-divider-minimum": minimum,
      "--neo-divider-box-shadow": boxShadow
    }
  )}> </div>`);
  pop();
}
function NeoCard($$payload, $$props) {
  push();
  let {
    // Snippets
    children: content,
    header,
    action,
    footer,
    media,
    // States
    ref = void 0,
    hovered = false,
    focused = false,
    tag = "div",
    close,
    disabled,
    // Styles
    pressed,
    convex,
    spacing,
    borderless,
    rounded,
    color,
    glass,
    tinted,
    segmented,
    cover,
    start,
    skeleton = false,
    horizontal,
    scrollbar,
    // Shadow
    elevation: _elevation = getDefaultElevation(pressed),
    hover: _hover = 0,
    blur: _blur,
    // Flex
    justify,
    align,
    flex,
    // Size
    width: _width,
    height: _height,
    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Actions
    use,
    // Events
    onClose,
    // Other props
    contentProps,
    headerProps,
    footerProps,
    actionProps,
    mediaProps,
    dividerProps,
    closeProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: contentTag = "div", ...contentRest } = contentProps ?? {};
  const { tag: headerTag = "div", ...headerRest } = headerProps ?? {};
  const { tag: footerTag = "div", ...footerRest } = footerProps ?? {};
  const { tag: actionTag = "div", ...actionRest } = actionProps ?? {};
  const { tag: mediaTag = "div", ...mediaRest } = mediaProps ?? {};
  const elevation = coerce(_elevation);
  const hover = coerce(_hover);
  const hoverElevation = elevation + hover;
  const blur = parseBlur(_blur, elevation);
  const filter = computeGlassFilter(blur, glass);
  const boxShadow = computeShadowElevation(elevation, { glass, pressed, convex });
  const hoverShadow = computeHoverShadowElevation(elevation, hover, { glass, pressed, convex }) ?? boxShadow;
  const hoverFlat = isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow);
  const flatHover = isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow);
  const segments = [content, header, action, footer, media, close].filter(Boolean).length > 1;
  const context = {
    elevation,
    hover,
    hovered,
    disabled,
    borderless,
    rounded,
    glass,
    tinted,
    segmented,
    cover,
    start,
    color,
    convex,
    pressed,
    focused,
    spacing,
    skeleton,
    horizontal,
    close,
    onClose
  };
  const width2 = toSize(_width);
  const height = toSize(_height);
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  toAction(use);
  toActionProps(use);
  function closeBtn($$payload2) {
    if (close) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="neo-card-close svelte-lor6jk">`);
      NeoCloseButton($$payload2, spread_props([
        {
          "aria-label": "Close card",
          rounded: true,
          text: true,
          onclick: onClose
        },
        closeProps,
        { iconProps: { size: "1rem", ...closeProps?.iconProps } }
      ]));
      $$payload2.out.push(`<!----></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]-->`);
  }
  function divider($$payload2) {
    if (segments && typeof segmented === "number") {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="neo-card-divider svelte-lor6jk">`);
      NeoDivider($$payload2, spread_props([
        {
          vertical: horizontal,
          elevation: segmented,
          rounded,
          glass,
          skeleton
        },
        dividerProps
      ]));
      $$payload2.out.push(`<!----></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]-->`);
  }
  element(
    $$payload,
    tag,
    () => {
      $$payload.out.push(`${spread_attributes(
        { role: "none", ...rest },
        "svelte-lor6jk",
        {
          "neo-card": true,
          "neo-scroll": scrollbar,
          "neo-horizontal": horizontal,
          "neo-borderless": borderless,
          "neo-segmented": segmented === true,
          "neo-segments": segments,
          "neo-image": media && !segments,
          "neo-rounded": rounded,
          "neo-disabled": disabled,
          "neo-skeleton": skeleton,
          "neo-pressed": pressed,
          "neo-convex": convex,
          "neo-hover": hover,
          "neo-hovered": hovered,
          "neo-start": start,
          "neo-raised": elevation > 3 || hoverElevation > 3,
          "neo-inset": elevation < 0,
          "neo-inset-hover": hoverElevation < 0,
          "neo-deep": elevation < -3 || hoverElevation < -3,
          "neo-flat": !elevation,
          "neo-hover-flat": hoverFlat,
          "neo-flat-hover": flatHover,
          "neo-glass": glass,
          "neo-tinted": tinted
        },
        {
          "--neo-card-text-color": getColorVariable(color),
          "--neo-card-box-shadow-hover": hoverShadow,
          "--neo-card-box-shadow": boxShadow,
          "--neo-card-glass-blur": filter,
          "--neo-card-spacing": spacing,
          "justify-content": justify,
          "align-items": align,
          flex,
          width: width2?.absolute,
          "min-width": width2?.min,
          "max-width": width2?.max,
          height: height?.absolute,
          "min-height": height?.min,
          "max-height": height?.max
        }
      )}`);
    },
    () => {
      if (media) {
        $$payload.out.push("<!--[-->");
        element(
          $$payload,
          mediaTag,
          () => {
            $$payload.out.push(`${spread_attributes({ ...mediaRest }, "svelte-lor6jk", {
              "neo-card-segment": true,
              "neo-card-media": true,
              "neo-scroll": scrollbar,
              "neo-cover": cover,
              "neo-inset": elevation < 0 || hoverElevation < 0
            })}`);
          },
          () => {
            media?.($$payload, context);
            $$payload.out.push(`<!---->`);
          }
        );
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> `);
      if (header) {
        $$payload.out.push("<!--[-->");
        element(
          $$payload,
          headerTag,
          () => {
            $$payload.out.push(`${spread_attributes({ ...headerRest }, "svelte-lor6jk", {
              "neo-card-segment": true,
              "neo-card-header": true,
              "neo-scroll": scrollbar
            })}`);
          },
          () => {
            header?.($$payload, context);
            $$payload.out.push(`<!----> `);
            if (!horizontal) {
              $$payload.out.push("<!--[-->");
              closeBtn($$payload);
            } else {
              $$payload.out.push("<!--[!-->");
            }
            $$payload.out.push(`<!--]-->`);
          }
        );
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> `);
      if (segments || scrollbar) {
        $$payload.out.push("<!--[-->");
        divider($$payload);
        $$payload.out.push(`<!----> `);
        if (content) {
          $$payload.out.push("<!--[-->");
          element(
            $$payload,
            contentTag,
            () => {
              $$payload.out.push(`${spread_attributes({ ...contentRest }, "svelte-lor6jk", {
                "neo-card-segment": true,
                "neo-card-content": true,
                "neo-scroll": scrollbar
              })}`);
            },
            () => {
              if (horizontal && !action || !horizontal && !header) {
                $$payload.out.push("<!--[-->");
                closeBtn($$payload);
              } else {
                $$payload.out.push("<!--[!-->");
              }
              $$payload.out.push(`<!--]--> `);
              content?.($$payload, context);
              $$payload.out.push(`<!---->`);
            }
          );
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]-->`);
      } else {
        $$payload.out.push("<!--[!-->");
        content?.($$payload, context);
        $$payload.out.push(`<!---->`);
      }
      $$payload.out.push(`<!--]--> `);
      if (footer) {
        $$payload.out.push("<!--[-->");
        divider($$payload);
        $$payload.out.push(`<!----> `);
        element(
          $$payload,
          footerTag,
          () => {
            $$payload.out.push(`${spread_attributes({ ...footerRest }, "svelte-lor6jk", {
              "neo-card-segment": true,
              "neo-card-footer": true,
              "neo-scroll": scrollbar
            })}`);
          },
          () => {
            footer?.($$payload, context);
            $$payload.out.push(`<!---->`);
          }
        );
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> `);
      if (action) {
        $$payload.out.push("<!--[-->");
        divider($$payload);
        $$payload.out.push(`<!----> `);
        element(
          $$payload,
          actionTag,
          () => {
            $$payload.out.push(`${spread_attributes({ ...actionRest }, "svelte-lor6jk", {
              "neo-card-segment": true,
              "neo-card-action": true,
              "neo-scroll": scrollbar
            })}`);
          },
          () => {
            if (horizontal) {
              $$payload.out.push("<!--[-->");
              closeBtn($$payload);
            } else {
              $$payload.out.push("<!--[!-->");
            }
            $$payload.out.push(`<!--]--> `);
            action?.($$payload, context);
            $$payload.out.push(`<!---->`);
          }
        );
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
  );
  bind_props($$props, { ref, hovered, focused });
  pop();
}
const NeoErrorType = {
  NeoError: "NeoError",
  NeoThemeProvider: "NeoThemeProvider"
};
const NeoErrorName = {
  TargetNotFound: "Target not found",
  InvalidTarget: "Target is not a valid HTMLElement or ShadowRoot"
};
class NeoError extends Error {
  type;
  constructor(message, type = NeoErrorType.NeoError) {
    super(`[${type}]: ${message}`);
    this.type = type;
  }
}
class NeoErrorThemeProvider extends NeoError {
  constructor(message) {
    super(message, NeoErrorType.NeoThemeProvider);
  }
}
class NeoErrorThemeTargetNotFound extends NeoErrorThemeProvider {
  constructor() {
    super(NeoErrorName.TargetNotFound);
  }
}
class NeoErrorThemeInvalidTarget extends NeoErrorThemeProvider {
  constructor() {
    super(NeoErrorName.InvalidTarget);
  }
}
class Logger {
  static logger = new ProxyLogger({ logLevel: LogLevel.Warn });
  static colorize = ProxyLogger.colorize;
  static setLogLevel(logLevel) {
    if (typeof logLevel === "string")
      this.logger.logLevel = toLogLevel(logLevel);
    else
      this.logger.logLevel = logLevel;
  }
  static get timestamp() {
    return ProxyLogger.timestamp();
  }
  static get trace() {
    return this.logger.trace;
  }
  static get debug() {
    return this.logger.debug;
  }
  static get info() {
    return this.logger.info;
  }
  static get warn() {
    return this.logger.warn;
  }
  static get error() {
    return this.logger.error;
  }
}
const NeoProgressStatus = {
  Active: "active",
  Idle: "idle",
  Paused: "paused",
  Completed: "completed",
  Indeterminate: "indeterminate"
};
const NeoProgressDirection = {
  Right: "right"
};
function NeoProgress($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    // State
    tag = "div",
    ref = void 0,
    status = void 0,
    // active, finished, paused, indeterminate, idle
    value = 0,
    buffer = 0,
    min = 0,
    max = 100,
    indeterminate = false,
    step = 1,
    tick: tick2 = 500,
    timeout,
    // Styles
    low,
    // threshold for tinting
    high,
    // threshold for tinting
    flex,
    width: _width,
    height: _height,
    track = true,
    color,
    direction = NeoProgressDirection.Right,
    $$slots,
    $$events,
    // Other Props
    ...rest
  } = $$props;
  const buffered = (buffer ?? 0) > value ? buffer : value;
  const valueProgress = value ? `${percent(clamp(value, min, max), 100)}%` : "-0.125rem";
  const bufferProgress = buffered ? `${percent(clamp(buffered, min, max), 100)}%` : "-0.125rem";
  const colorArray = Array.isArray(color) ? color.map(getColorVariable) : [getColorVariable(color)];
  const background = (() => {
    if (colorArray.length === 1) return colorArray[0];
    if (colorArray.length === 3) {
      if (value <= (low ?? min)) return colorArray[0];
      if (value >= (high ?? max)) return colorArray[2];
      return colorArray[1];
    }
    if (colorArray.length === 2 && low !== void 0) {
      if (value <= low) return colorArray[0];
      return colorArray[1];
    }
    if (colorArray.length === 2 && high !== void 0) {
      if (value >= high) return colorArray[1];
      return colorArray[0];
    }
  })();
  const controlled = status && [NeoProgressStatus.Active, NeoProgressStatus.Indeterminate].includes(status);
  let intervalId;
  let timeoutId;
  const clear = () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };
  const change = (newValue, newBuffer = buffer) => {
    if (newValue === void 0 && newBuffer === void 0) return;
    clear();
    if (newValue !== void 0) value = newValue;
    if (newBuffer !== void 0) buffer = newBuffer;
    status = NeoProgressStatus.Idle;
  };
  const stop = () => {
    clear();
    status = NeoProgressStatus.Paused;
  };
  const complete = (pending = indeterminate) => {
    clear();
    value = max ?? 100;
    buffer = max ?? 100;
    status = pending ? NeoProgressStatus.Indeterminate : NeoProgressStatus.Completed;
  };
  const start = (pending = indeterminate, expire = timeout) => {
    status = NeoProgressStatus.Active;
    clear();
    intervalId = setInterval(
      () => {
        if (value < max) value += step;
        else complete(pending);
      },
      tick2
    );
    if (expire) timeoutId = setTimeout(() => complete(), expire);
  };
  const reset = (restart = status === NeoProgressStatus.Active) => {
    clear();
    value = min ?? 0;
    buffer = min ?? 0;
    if (restart) start();
    else status = NeoProgressStatus.Idle;
  };
  const cancel = () => {
    clear();
    reset(false);
  };
  const width2 = toSize(_width);
  const height = toSize(_height);
  const context = {
    status,
    value,
    buffer,
    min,
    max,
    indeterminate,
    step,
    tick: tick2,
    timeout,
    color,
    direction
  };
  element(
    $$payload,
    tag,
    () => {
      $$payload.out.push(`${spread_attributes(
        {
          role: "progressbar",
          "data-direction": direction,
          "data-indeterminate": indeterminate,
          "data-status": status,
          "data-min": min,
          "data-max": max,
          "data-low": low,
          "data-high": high,
          "data-value": value,
          ...rest
        },
        "svelte-1m8dcqv",
        {
          "neo-progress": true,
          "neo-indeterminate": indeterminate || status === NeoProgressStatus.Indeterminate,
          "neo-controlled": controlled,
          "neo-track": track
        },
        {
          flex,
          width: width2?.absolute,
          "min-width": width2?.min,
          "max-width": width2?.max,
          height: height?.absolute,
          "min-height": height?.min,
          "max-height": height?.max,
          "--neo-progress-background": background
        }
      )}`);
    },
    () => {
      $$payload.out.push(`<span class="neo-progress-value svelte-1m8dcqv"${attr_style("", { "--neo-progress-value": valueProgress })}></span> <span class="neo-progress-buffer svelte-1m8dcqv"${attr_style("", { "--neo-progress-buffer": bufferProgress })}></span> `);
      children?.($$payload, context);
      $$payload.out.push(`<!---->`);
    }
  );
  bind_props($$props, {
    ref,
    status,
    value,
    buffer,
    change,
    stop,
    complete,
    start,
    reset,
    cancel
  });
  pop();
}
let count = 0;
function useId() {
  return Math.random().toString(36).substring(2, 9) + count++;
}
function styleObjectToString(styleObject) {
  return Object.entries(styleObject).map(([key, value]) => `${key}: ${value};`).join(" ");
}
function createPubSub() {
  const map = /* @__PURE__ */ new Map();
  return {
    emit(event, data) {
      const handlers = map.get(event);
      if (!handlers) {
        return;
      }
      for (const handler of handlers) {
        handler(data);
      }
    },
    on(event, listener) {
      map.set(event, [...map.get(event) || [], listener]);
    },
    off(event, listener) {
      map.set(event, map.get(event)?.filter((l) => l !== listener) || []);
    }
  };
}
function getDPR(element2) {
  if (typeof window === "undefined") {
    return 1;
  }
  const win = element2.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element2, value) {
  const dpr = getDPR(element2);
  return Math.round(value * dpr) / dpr;
}
function noop() {
}
function useFloating(options = {}) {
  const elements = options.elements ?? {};
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    transform = true,
    open = true,
    onOpenChange: unstableOnOpenChange = noop,
    whileElementsMounted,
    nodeId
  } = options;
  const floatingStyles = (() => {
    const initialStyles = { position: strategy, left: "0px", top: "0px" };
    if (!elements.floating) {
      return styleObjectToString(initialStyles);
    }
    const x = roundByDPR(elements.floating, state.x);
    const y = roundByDPR(elements.floating, state.y);
    if (transform) {
      return styleObjectToString({
        ...initialStyles,
        transform: `translate(${x}px, ${y}px)`,
        ...getDPR(elements.floating) >= 1.5 && { willChange: "transform" }
      });
    }
    return styleObjectToString({ position: strategy, left: `${x}px`, top: `${y}px` });
  })();
  const events = createPubSub();
  const data = {};
  const onOpenChange = (open2, event, reason) => {
    data.openEvent = open2 ? event : void 0;
    events.emit("openchange", { open: open2, event, reason });
    unstableOnOpenChange(open2, event, reason);
  };
  const state = {
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  };
  const context = {
    data,
    events,
    elements,
    onOpenChange,
    floatingId: useId(),
    get nodeId() {
      return nodeId;
    },
    get x() {
      return state.x;
    },
    get y() {
      return state.y;
    },
    get placement() {
      return state.placement;
    },
    get strategy() {
      return state.strategy;
    },
    get middlewareData() {
      return state.middlewareData;
    },
    get isPositioned() {
      return state.isPositioned;
    },
    get open() {
      return open;
    }
  };
  const update = async () => {
    if (!elements.floating || !elements.reference) {
      return;
    }
    const config = { placement, strategy, middleware };
    const position = await computePosition(elements.reference, elements.floating, config);
    state.x = position.x;
    state.y = position.y;
    state.placement = position.placement;
    state.strategy = position.strategy;
    state.middlewareData = position.middlewareData;
    state.isPositioned = true;
  };
  return {
    update,
    context,
    elements,
    get x() {
      return state.x;
    },
    get y() {
      return state.y;
    },
    get placement() {
      return state.placement;
    },
    get strategy() {
      return state.strategy;
    },
    get middlewareData() {
      return state.middlewareData;
    },
    get isPositioned() {
      return state.isPositioned;
    },
    get open() {
      return open;
    },
    get floatingStyles() {
      return floatingStyles;
    }
  };
}
const NeoInputLabelPlacement = {
  Inside: "inside"
};
function NeoBaseInput_1($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    display,
    // States
    id,
    ref = void 0,
    files = void 0,
    // type="file"
    value = void 0,
    group = void 0,
    // type="radio"
    checked = void 0,
    // type="checkbox"
    indeterminate = void 0,
    // type="checkbox"
    initial = void 0,
    touched = false,
    valid = void 0,
    dirty = false,
    focused = false,
    disabled,
    readonly,
    nullable = true,
    dirtyOnInput,
    dirtyOnBlur,
    validateOnInput,
    validateOnBlur,
    validationMessage = void 0,
    // Size
    width: _width,
    height: _height,
    fitContent,
    // Styles
    before,
    after,
    hide,
    // Actions
    use,
    // Events
    onblur,
    onfocus,
    oninput,
    onchange,
    oninvalid,
    onclear,
    onmark,
    // Other props
    displayProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: displayTag = "span", ...displayRest } = displayProps ?? {};
  const getValue = () => {
    if (rest.type === "file") return files;
    if (rest.type === "checkbox" || rest.type === "radio") return checked;
    return value;
  };
  const typedValue = getValue();
  const reset = () => {
    if (rest.type === "checkbox" || rest.type === "radio") {
      checked = rest?.defaultChecked ?? rest?.defaultValue ?? false;
      if (rest.type === "checkbox") indeterminate = false;
      return;
    }
    value = nullable ? "" : rest?.defaultValue ?? "";
    if (rest.type === "file") files = new DataTransfer().files;
  };
  const currentState = { touched, dirty, valid, value: typedValue, initial };
  const validate = (update = { dirty: true, valid: true }) => {
    if (update.dirty) dirty = !Object.is(typedValue, initial);
    if (!update.valid) return { ...currentState };
    if (readonly) ref?.removeAttribute("readonly");
    valid = ref?.checkValidity();
    validationMessage = ref?.validationMessage;
    if (readonly) ref?.setAttribute("readonly", "");
    return { ...currentState };
  };
  const mark = (state) => {
    if (state.touched !== void 0) touched = state.touched;
    if (state.valid !== void 0) valid = state.valid;
    if (state.dirty === void 0) return onmark?.({ ...currentState });
    dirty = state.dirty;
    if (!dirty) initial = typedValue;
    return onmark?.({ ...currentState });
  };
  const focus = () => {
    if (focused || disabled || readonly) return;
    ref?.focus();
  };
  const clear = async (state, event) => {
    reset();
    await tick();
    focus();
    if (state) mark({ touched: false, dirty: false, ...state });
    else validate();
    onclear?.({ ...currentState }, event);
    if (event) return ref?.dispatchEvent(event);
    const _event = {
      bubbles: true,
      cancelable: false,
      data: value,
      inputType: "clear"
    };
    oninput?.(new InputEvent("input", _event));
  };
  const change = async (_value, event) => {
    if (rest.type === "checkbox" || rest.type === "radio") {
      checked = !!_value;
    } else {
      value = _value?.toString();
    }
    focus();
    await tick();
    if (event) ref?.dispatchEvent(event);
    return validate();
  };
  toAction(use);
  toActionProps(use);
  const width2 = toSize(_width);
  const height = toSize(_height);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (display !== void 0) {
      $$payload2.out.push("<!--[-->");
      NeoBaseInput_1($$payload2, spread_props([
        {
          hidden: true,
          "aria-hidden": true,
          tabindex: -1,
          children,
          id,
          disabled,
          readonly,
          nullable,
          dirtyOnInput,
          dirtyOnBlur,
          validateOnInput,
          validateOnBlur,
          onblur,
          onfocus,
          oninput,
          onchange,
          oninvalid,
          onclear,
          onmark
        },
        rest,
        {
          class: ["neo-input-display-input", rest.class],
          hide: true,
          get ref() {
            return ref;
          },
          set ref($$value) {
            ref = $$value;
            $$settled = false;
          },
          get files() {
            return files;
          },
          set files($$value) {
            files = $$value;
            $$settled = false;
          },
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          },
          get group() {
            return group;
          },
          set group($$value) {
            group = $$value;
            $$settled = false;
          },
          get checked() {
            return checked;
          },
          set checked($$value) {
            checked = $$value;
            $$settled = false;
          },
          get indeterminate() {
            return indeterminate;
          },
          set indeterminate($$value) {
            indeterminate = $$value;
            $$settled = false;
          },
          get initial() {
            return initial;
          },
          set initial($$value) {
            initial = $$value;
            $$settled = false;
          },
          get touched() {
            return touched;
          },
          set touched($$value) {
            touched = $$value;
            $$settled = false;
          },
          get valid() {
            return valid;
          },
          set valid($$value) {
            valid = $$value;
            $$settled = false;
          },
          get dirty() {
            return dirty;
          },
          set dirty($$value) {
            dirty = $$value;
            $$settled = false;
          },
          get focused() {
            return focused;
          },
          set focused($$value) {
            focused = $$value;
            $$settled = false;
          },
          get validationMessage() {
            return validationMessage;
          },
          set validationMessage($$value) {
            validationMessage = $$value;
            $$settled = false;
          }
        }
      ]));
      $$payload2.out.push(`<!----> `);
      element(
        $$payload2,
        displayTag,
        () => {
          $$payload2.out.push(`${spread_attributes(
            { ...displayRest },
            "svelte-1ecn6if",
            {
              "neo-input": true,
              "neo-after": after,
              "neo-before": before,
              "neo-fit-content": fitContent
            },
            {
              width: width2?.absolute,
              "min-width": width2?.min,
              "max-width": width2?.max,
              height: height?.absolute,
              "min-height": height?.min,
              "max-height": height?.max
            }
          )}`);
        },
        () => {
          if (typeof display === "function") {
            $$payload2.out.push("<!--[-->");
            display($$payload2, currentState);
            $$payload2.out.push(`<!---->`);
          } else {
            $$payload2.out.push("<!--[!-->");
            $$payload2.out.push(`<input inert tabindex="-1" class="neo-input-display-content svelte-1ecn6if" readonly${attr("value", display)}${attr("placeholder", rest?.placeholder)}${attr("size", rest?.size)}/>`);
          }
          $$payload2.out.push(`<!--]-->`);
        }
      );
    } else {
      $$payload2.out.push("<!--[!-->");
      if (rest.type === "select") {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<select${spread_attributes(
          {
            "aria-invalid": valid === void 0 ? void 0 : !valid,
            id,
            disabled,
            focused,
            ...rest
          },
          "svelte-1ecn6if",
          {
            "neo-input": true,
            "neo-hide": hide,
            "neo-after": after,
            "neo-before": before,
            "neo-fit-content": fitContent
          },
          {
            width: width2?.absolute,
            "min-width": width2?.min,
            "max-width": width2?.max,
            height: height?.absolute,
            "min-height": height?.min,
            "max-height": height?.max
          }
        )}>`);
        $$payload2.select_value = {
          value,
          ...rest
        }?.value;
        children?.($$payload2);
        $$payload2.out.push(`<!---->`);
        $$payload2.select_value = void 0;
        $$payload2.out.push(`</select>`);
      } else {
        $$payload2.out.push("<!--[!-->");
        if (rest.type === "file") {
          $$payload2.out.push("<!--[-->");
          $$payload2.out.push(`<input${spread_attributes(
            {
              "aria-invalid": valid === void 0 ? void 0 : !valid,
              type: "file",
              id,
              disabled,
              readonly,
              focused,
              ...rest
            },
            "svelte-1ecn6if",
            {
              "neo-input": true,
              "neo-hide": hide,
              "neo-after": after,
              "neo-before": before,
              "neo-fit-content": fitContent
            },
            {
              width: width2?.absolute,
              "min-width": width2?.min,
              "max-width": width2?.max,
              height: height?.absolute,
              "min-height": height?.min,
              "max-height": height?.max
            }
          )}/> `);
          children?.($$payload2);
          $$payload2.out.push(`<!---->`);
        } else {
          $$payload2.out.push("<!--[!-->");
          if (rest.type === "checkbox") {
            $$payload2.out.push("<!--[-->");
            $$payload2.out.push(`<input${spread_attributes(
              {
                "aria-invalid": valid === void 0 ? void 0 : !valid,
                type: "checkbox",
                id,
                disabled,
                readonly,
                value,
                checked: group.includes(value),
                focused,
                checked,
                ...rest
              },
              "svelte-1ecn6if",
              {
                "neo-input": true,
                "neo-hide": hide,
                "neo-after": after,
                "neo-before": before,
                "neo-fit-content": fitContent
              },
              {
                width: width2?.absolute,
                "min-width": width2?.min,
                "max-width": width2?.max,
                height: height?.absolute,
                "min-height": height?.min,
                "max-height": height?.max
              }
            )}/> `);
            children?.($$payload2);
            $$payload2.out.push(`<!---->`);
          } else {
            $$payload2.out.push("<!--[!-->");
            if (rest.type === "radio") {
              $$payload2.out.push("<!--[-->");
              $$payload2.out.push(`<input${spread_attributes(
                {
                  type: "radio",
                  id,
                  disabled,
                  readonly,
                  value,
                  checked: group === value,
                  focused,
                  ...rest
                },
                "svelte-1ecn6if",
                {
                  "neo-input": true,
                  "neo-hide": hide,
                  "neo-after": after,
                  "neo-before": before,
                  "neo-fit-content": fitContent
                },
                {
                  width: width2?.absolute,
                  "min-width": width2?.min,
                  "max-width": width2?.max,
                  height: height?.absolute,
                  "min-height": height?.min,
                  "max-height": height?.max
                }
              )}/> `);
              children?.($$payload2);
              $$payload2.out.push(`<!---->`);
            } else {
              $$payload2.out.push("<!--[!-->");
              $$payload2.out.push(`<input${spread_attributes(
                {
                  "aria-invalid": valid === void 0 ? void 0 : !valid,
                  id,
                  disabled,
                  readonly,
                  value,
                  focused,
                  ...rest
                },
                "svelte-1ecn6if",
                {
                  "neo-input": true,
                  "neo-hide": hide,
                  "neo-after": after,
                  "neo-before": before,
                  "neo-fit-content": fitContent
                },
                {
                  width: width2?.absolute,
                  "min-width": width2?.min,
                  "max-width": width2?.max,
                  height: height?.absolute,
                  "min-height": height?.min,
                  "max-height": height?.max
                }
              )}/> `);
              children?.($$payload2);
              $$payload2.out.push(`<!---->`);
            }
            $$payload2.out.push(`<!--]-->`);
          }
          $$payload2.out.push(`<!--]-->`);
        }
        $$payload2.out.push(`<!--]-->`);
      }
      $$payload2.out.push(`<!--]-->`);
    }
    $$payload2.out.push(`<!--]-->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    ref,
    files,
    value,
    group,
    checked,
    indeterminate,
    initial,
    touched,
    valid,
    dirty,
    focused,
    validationMessage,
    validate,
    mark,
    clear,
    change
  });
  pop();
}
const NeoFormContextSymbol = Symbol("NeoFormContext");
function getNeoFormContext() {
  return getContext(NeoFormContextSymbol);
}
function NeoValidation($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    message,
    error,
    // States
    ref = void 0,
    tag = "div",
    context,
    disabled,
    // Size
    flex,
    width: _width,
    height: _height,
    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Other props
    messageProps,
    messageId = messageProps?.id ?? `neo-validation-message-${getUUID()}`,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: messageTag = "div", ...messageRest } = messageProps ?? {};
  const innerContext = { disabled, messageId, message, error };
  const width2 = toSize(_width);
  const height = toSize(_height);
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  if (disabled) {
    $$payload.out.push("<!--[-->");
    children?.($$payload, innerContext);
    $$payload.out.push(`<!---->`);
  } else {
    $$payload.out.push("<!--[!-->");
    element(
      $$payload,
      tag,
      () => {
        $$payload.out.push(`${spread_attributes({ ...rest }, "svelte-dhfl6f", { "neo-validation-group-wrapper": true }, {
          flex,
          width: width2?.absolute,
          "min-width": width2?.min,
          "max-width": width2?.max,
          height: height?.absolute,
          "min-height": height?.min,
          "max-height": height?.max
        })}`);
      },
      () => {
        children?.($$payload, innerContext);
        $$payload.out.push(`<!----> <div class="neo-validation-message svelte-dhfl6f">`);
        if (error) {
          $$payload.out.push("<!--[-->");
          element(
            $$payload,
            messageTag,
            () => {
              $$payload.out.push(`${spread_attributes({ id: messageId, ...messageRest }, "svelte-dhfl6f", { "neo-validation-error": true })}`);
            },
            () => {
              if (typeof error === "function") {
                $$payload.out.push("<!--[-->");
                error($$payload, context);
                $$payload.out.push(`<!---->`);
              } else {
                $$payload.out.push("<!--[!-->");
                $$payload.out.push(`${escape_html(error)}`);
              }
              $$payload.out.push(`<!--]-->`);
            }
          );
        } else {
          $$payload.out.push("<!--[!-->");
          if (message) {
            $$payload.out.push("<!--[-->");
            element(
              $$payload,
              messageTag,
              () => {
                $$payload.out.push(`${spread_attributes({ id: messageId, ...messageRest }, "svelte-dhfl6f", { "neo-validation-description": true })}`);
              },
              () => {
                if (typeof message === "function") {
                  $$payload.out.push("<!--[-->");
                  message($$payload, context);
                  $$payload.out.push(`<!---->`);
                } else {
                  $$payload.out.push("<!--[!-->");
                  $$payload.out.push(`${escape_html(message)}`);
                }
                $$payload.out.push(`<!--]-->`);
              }
            );
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]--></div>`);
      }
    );
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { ref, messageId });
  pop();
}
function NeoInputValidation($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    error,
    message,
    // States
    ref = void 0,
    visible = false,
    valid,
    validation,
    validationMessage,
    input,
    register,
    // Other props
    messageProps,
    messageId = messageProps?.id ?? `neo-validation-message-${getUUID()}`,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const errorMessage = (() => {
    if (!validation || validation === "success" || valid !== false) return;
    return error ?? validationMessage;
  })();
  const disabled = !validation && !(message || errorMessage);
  getNeoFormContext();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    NeoValidation($$payload2, spread_props([
      {
        disabled,
        error: errorMessage,
        message,
        messageProps,
        children
      },
      rest,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        get messageId() {
          return messageId;
        },
        set messageId($$value) {
          messageId = $$value;
          $$settled = false;
        }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref, visible, messageId });
  pop();
}
function NeoLabel($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    label,
    // States
    ref = void 0,
    valid,
    required,
    disabled,
    // Actions
    use,
    // Other props
    containerRef = void 0,
    containerProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: containerTag = "div", ...containerRest } = containerProps ?? {};
  const context = { ref, valid, required, disabled };
  toAction(use);
  toActionProps(use);
  element(
    $$payload,
    containerTag,
    () => {
      $$payload.out.push(`${spread_attributes({ ...containerRest }, "svelte-1xddlb8", { "neo-label-container": true })}`);
    },
    () => {
      $$payload.out.push(`<label${spread_attributes({ ...rest }, "svelte-1xddlb8", {
        "neo-label": true,
        "neo-disabled": disabled,
        "neo-valid": valid === true,
        "neo-invalid": valid === false,
        "neo-required": required
      })}>`);
      if (typeof label === "function") {
        $$payload.out.push("<!--[-->");
        label?.($$payload, context);
        $$payload.out.push(`<!---->`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`${escape_html(label)}`);
      }
      $$payload.out.push(`<!--]--></label> `);
      children?.($$payload, context);
      $$payload.out.push(`<!---->`);
    }
  );
  bind_props($$props, { ref, containerRef });
  pop();
}
function NeoInput($$payload, $$props) {
  push();
  let {
    // Snippets
    label,
    before,
    after,
    inner,
    message,
    error,
    children,
    // States
    id = `neo-input-${getUUID()}`,
    ref = void 0,
    files = void 0,
    // type="file"
    value = void 0,
    group = void 0,
    // type="radio"
    checked = void 0,
    // type="checkbox"
    indeterminate = void 0,
    // type="checkbox"
    valid = void 0,
    dirty = false,
    touched = false,
    hovered = false,
    focused = false,
    focusin = false,
    disabled,
    readonly,
    loading,
    clearable,
    placement = NeoInputLabelPlacement.Inside,
    // Size
    flex: _flex,
    width: _width,
    height: _height,
    // Styles
    borderless,
    pressed,
    rounded,
    glass,
    color,
    tinted,
    start,
    floating = true,
    skeleton = false,
    validation,
    validationIcon,
    register,
    // Shadow
    elevation: _elevation = getDefaultElevation(pressed),
    hover: _hover = getDefaultHoverElevation(pressed),
    blur: _blur,
    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Other props
    labelRef = void 0,
    labelProps,
    afterRef = void 0,
    afterProps,
    affixRef = void 0,
    affixProps,
    beforeRef = void 0,
    beforeProps,
    containerRef = void 0,
    containerProps,
    validationRef = void 0,
    validationProps,
    messageProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: afterTag = "span", ...afterRest } = afterProps ?? {};
  const { tag: beforeTag = "span", ...beforeRest } = beforeProps ?? {};
  const { tag: containerTag = "div", ...containerRest } = containerProps ?? {};
  const elevation = coerce(_elevation);
  const hover = coerce(_hover);
  const hoverElevation = elevation + hover;
  const blur = parseBlur(_blur, elevation);
  const filter = computeGlassFilter(blur, glass);
  const boxShadow = computeShadowElevation(elevation, { glass, pressed });
  const hoverShadow = computeHoverShadowElevation(elevation, hover, { glass, pressed }) ?? boxShadow;
  const hoverFlat = isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow);
  const flatHover = isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow);
  const getValue = () => {
    if (rest?.type === "file") return files;
    if (rest?.type === "checkbox" || rest?.type === "radio") return checked;
    return value;
  };
  let initial = getValue();
  let validationMessage = ref?.validationMessage ?? "";
  const typedValue = getValue();
  const hasValue = (() => {
    if (rest?.type === "file") return !!files?.length;
    if (rest?.type === "checkbox" || rest?.type === "radio") return checked !== void 0;
    if (typeof value === "string") return !!value.length;
    if (rest?.multiple && Array.isArray(value)) return !!value.length;
    return value !== void 0 && value !== null;
  })();
  const showAffixValidation = validation && validationIcon;
  const showInputValidation = validation === true || validation === "success" && valid || validation === "error" && !valid;
  const affix = clearable || loading !== void 0 || showAffixValidation;
  const close = clearable && (focusin || focused || hovered) && hasValue;
  const isFloating = floating && !hasValue && (!focused || disabled || readonly);
  const inside = placement === NeoInputLabelPlacement.Inside && label;
  const onClear = () => {
    if (disabled || readonly) return;
    ref?.clear?.();
  };
  const onFocus = () => {
    if (focused || disabled || readonly || rest?.hidden) return;
    ref?.focus();
  };
  const onLabelClick = () => {
    if (disabled || readonly || rest?.hidden || rest.type !== "select") return;
    ref?.showPicker?.();
  };
  let affixWidth = void 0;
  let afterWidth = void 0;
  let beforeWidth = void 0;
  let labelContainerRef = void 0;
  let labelContainerHeight = void 0;
  let labelHeight = void 0;
  let labelWidth = void 0;
  let visible = false;
  let messageId = `neo-textarea-message-${getUUID()}`;
  const context = {
    // Ref
    ref,
    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,
    // State
    initial,
    value: typedValue,
    touched,
    dirty,
    valid,
    readonly,
    disabled,
    // Styles
    elevation,
    hover,
    pressed,
    borderless,
    rounded,
    glass,
    color,
    tinted,
    start,
    skeleton
  };
  const inputForm = {
    id,
    ref,
    name: rest?.name,
    form: rest?.form,
    type: rest.type,
    state: { valid, dirty, touched, value: typedValue, initial }
  };
  const flex = visible ? void 0 : _flex;
  const width2 = visible ? void 0 : toSize(_width);
  const height = visible ? void 0 : toSize(_height);
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  function prefix($$payload2) {
    if (before) {
      $$payload2.out.push("<!--[-->");
      element(
        $$payload2,
        beforeTag,
        () => {
          $$payload2.out.push(`${spread_attributes({ disabled, readonly, ...beforeRest }, "svelte-n0ci60", {
            "neo-input-before": true,
            "neo-inside": inside,
            "neo-pressed": pressed,
            "neo-inset": elevation < 0,
            "neo-deep": elevation < -3
          })}`);
        },
        () => {
          before($$payload2, context);
          $$payload2.out.push(`<!---->`);
        }
      );
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]-->`);
  }
  function suffix($$payload2) {
    if (affix) {
      $$payload2.out.push("<!--[-->");
      NeoAffix($$payload2, spread_props([
        {
          role: "none",
          loading,
          close,
          disabled,
          readonly,
          skeleton,
          valid: showAffixValidation ? valid : void 0,
          onclick: onFocus
        },
        affixProps,
        {
          class: [
            after ? "neo-after" : void 0,
            rest.type === "select" ? "neo-select" : void 0,
            rest.multiple ? "neo-multiple" : void 0,
            affixProps?.class
          ],
          closeProps: { onclick: onClear, ...affixProps?.closeProps },
          get ref() {
            return affixRef;
          },
          set ref($$value) {
            affixRef = $$value;
            $$settled = false;
          }
        }
      ]));
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> `);
    if (after) {
      $$payload2.out.push("<!--[-->");
      element(
        $$payload2,
        afterTag,
        () => {
          $$payload2.out.push(`${spread_attributes({ disabled, readonly, ...afterRest }, "svelte-n0ci60", {
            "neo-input-after": true,
            "neo-inside": inside,
            "neo-pressed": pressed,
            "neo-inset": elevation < 0,
            "neo-deep": elevation < -3
          })}`);
        },
        () => {
          after($$payload2, context);
          $$payload2.out.push(`<!---->`);
        }
      );
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]-->`);
  }
  function input($$payload2) {
    NeoBaseInput_1($$payload2, spread_props([
      {
        "aria-invalid": valid === void 0 ? void 0 : !valid,
        "aria-describedby": visible ? messageId : void 0,
        id,
        disabled,
        readonly,
        after: !!(after || affix),
        before: !!before
      },
      rest,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        get files() {
          return files;
        },
        set files($$value) {
          files = $$value;
          $$settled = false;
        },
        get initial() {
          return initial;
        },
        set initial($$value) {
          initial = $$value;
          $$settled = false;
        },
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
          $$settled = false;
        },
        get group() {
          return group;
        },
        set group($$value) {
          group = $$value;
          $$settled = false;
        },
        get checked() {
          return checked;
        },
        set checked($$value) {
          checked = $$value;
          $$settled = false;
        },
        get indeterminate() {
          return indeterminate;
        },
        set indeterminate($$value) {
          indeterminate = $$value;
          $$settled = false;
        },
        get valid() {
          return valid;
        },
        set valid($$value) {
          valid = $$value;
          $$settled = false;
        },
        get dirty() {
          return dirty;
        },
        set dirty($$value) {
          dirty = $$value;
          $$settled = false;
        },
        get touched() {
          return touched;
        },
        set touched($$value) {
          touched = $$value;
          $$settled = false;
        },
        get focused() {
          return focused;
        },
        set focused($$value) {
          focused = $$value;
          $$settled = false;
        },
        get validationMessage() {
          return validationMessage;
        },
        set validationMessage($$value) {
          validationMessage = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          children?.($$payload3, context);
          $$payload3.out.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  }
  function labelGroup($$payload2) {
    if (typeof label === "function") {
      $$payload2.out.push("<!--[-->");
      label($$payload2, context);
      $$payload2.out.push(`<!---->`);
    } else {
      $$payload2.out.push("<!--[!-->");
      if (label !== void 0) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`${escape_html(label)}`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]-->`);
    }
    $$payload2.out.push(`<!--]-->`);
  }
  function inputGroup($$payload2) {
    element(
      $$payload2,
      containerTag,
      () => {
        $$payload2.out.push(`${spread_attributes(
          {
            role: "none",
            "data-placement": placement,
            "data-touched": touched,
            "data-dirty": dirty,
            "data-valid": valid,
            ...containerRest
          },
          "svelte-n0ci60",
          {
            "neo-input-group": true,
            "neo-readonly": readonly,
            "neo-pressed": pressed,
            "neo-borderless": borderless,
            "neo-rounded": rounded,
            "neo-glass": glass,
            "neo-tinted": tinted,
            "neo-hover": hover,
            "neo-hovered": hovered,
            "neo-floating": floating,
            "neo-start": start,
            "neo-skeleton": skeleton,
            "neo-validation": showInputValidation,
            "neo-disabled": disabled,
            "neo-raised": elevation > 3 || hoverElevation > 3,
            "neo-inset": elevation < 0,
            "neo-inset-hover": hoverElevation < 0,
            "neo-deep": elevation < -3 || hoverElevation < -3,
            "neo-flat": !elevation,
            "neo-hover-flat": hoverFlat,
            "neo-flat-hover": flatHover
          },
          {
            flex,
            width: width2?.absolute,
            "min-width": width2?.min,
            "max-width": width2?.max,
            height: height?.absolute,
            "min-height": height?.min,
            "max-height": height?.max,
            "--neo-input-text-color": getColorVariable(color),
            "--neo-input-glass-blur": filter,
            "--neo-input-box-shadow": boxShadow,
            "--neo-input-box-shadow-hover": hoverShadow,
            "--neo-input-label-container-height": labelContainerHeight,
            "--neo-input-label-height": labelHeight,
            "--neo-input-label-width": labelWidth,
            "--neo-input-before-width": beforeWidth,
            "--neo-input-after-width": afterWidth,
            "--neo-input-affix-width": affixWidth
          }
        )}`);
      },
      () => {
        prefix($$payload2);
        $$payload2.out.push(`<!----> `);
        if (label) {
          $$payload2.out.push("<!--[-->");
          NeoLabel($$payload2, spread_props([
            {
              for: id,
              containerProps: {
                class: [
                  "neo-first",
                  before ? "neo-before" : void 0,
                  after ? "neo-after" : void 0,
                  rounded ? "neo-rounded" : void 0,
                  isFloating ? "neo-floating" : void 0
                ].filter(Boolean).join(" "),
                onclick: onFocus
              },
              label: labelGroup,
              required: rest.required,
              disabled,
              onclick: onLabelClick
            },
            labelProps,
            {
              get ref() {
                return labelRef;
              },
              set ref($$value) {
                labelRef = $$value;
                $$settled = false;
              },
              get containerRef() {
                return labelContainerRef;
              },
              set containerRef($$value) {
                labelContainerRef = $$value;
                $$settled = false;
              },
              children: ($$payload3) => {
                input($$payload3);
              },
              $$slots: { default: true }
            }
          ]));
        } else {
          $$payload2.out.push("<!--[!-->");
          input($$payload2);
        }
        $$payload2.out.push(`<!--]--> `);
        suffix($$payload2);
        $$payload2.out.push(`<!----> `);
        inner?.($$payload2, context);
        $$payload2.out.push(`<!---->`);
      }
    );
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    NeoInputValidation($$payload2, spread_props([
      {
        input: inputForm,
        register,
        valid,
        validation,
        validationMessage,
        error,
        rounded,
        context,
        message,
        messageProps,
        flex: _flex,
        width: _width,
        height: _height,
        in: inAction,
        out: outAction,
        transition: transitionAction
      },
      validationProps,
      {
        get ref() {
          return validationRef;
        },
        set ref($$value) {
          validationRef = $$value;
          $$settled = false;
        },
        get visible() {
          return visible;
        },
        set visible($$value) {
          visible = $$value;
          $$settled = false;
        },
        get messageId() {
          return messageId;
        },
        set messageId($$value) {
          messageId = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          inputGroup($$payload3);
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    ref,
    files,
    value,
    group,
    checked,
    indeterminate,
    valid,
    dirty,
    touched,
    hovered,
    focused,
    focusin,
    labelRef,
    afterRef,
    affixRef,
    beforeRef,
    containerRef,
    validationRef
  });
  pop();
}
function NeoCheckbox($$payload, $$props) {
  push();
  let {
    // Snippets
    label,
    message,
    error,
    // State
    type = "checkbox",
    id = `neo-checkbox-${getUUID()}`,
    ref = void 0,
    group = void 0,
    checked = false,
    indeterminate = false,
    valid = void 0,
    dirty = false,
    touched = false,
    focused = false,
    hovered = false,
    disabled,
    required,
    loading,
    validation,
    register,
    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,
    // Styles
    start,
    glass,
    color,
    tinted,
    rounded,
    skeleton = false,
    // Size
    flex: _flex,
    width: _width,
    height: _height,
    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Other props
    labelRef = void 0,
    labelProps,
    buttonProps,
    messageProps,
    containerRef = void 0,
    containerProps,
    validationRef = void 0,
    validationProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: containerTag = "div", ...containerRest } = containerProps ?? {};
  const elevation = coerce(_elevation);
  const labelId = label ? `neo-checkbox-label-${getUUID()}` : void 0;
  let initial = checked;
  let validationMessage = ref?.validationMessage ?? "";
  let visible = false;
  let messageId = `neo-checkbox-message-${getUUID()}`;
  const context = {
    // Ref
    ref,
    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,
    // State
    value: checked,
    initial,
    touched,
    dirty,
    valid,
    readonly: rest.readonly,
    disabled,
    // Styles
    rounded,
    glass,
    color,
    tinted,
    start,
    skeleton,
    elevation
  };
  const inputForm = {
    id,
    ref,
    name: rest?.name,
    form: rest?.form,
    type,
    state: { valid, dirty, touched, value: checked, initial }
  };
  const flex = visible ? void 0 : _flex;
  const width2 = visible ? void 0 : toSize(_width);
  const height = visible ? void 0 : toSize(_height);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    NeoInputValidation($$payload2, spread_props([
      {
        input: inputForm,
        register,
        valid,
        validation,
        validationMessage,
        error,
        rounded,
        context,
        message,
        messageProps,
        flex: _flex,
        width: _width,
        height: _height,
        in: inAction,
        out: outAction,
        transition: transitionAction
      },
      validationProps,
      {
        style: toStyle("--neo-validation-padding: 0", validationProps?.style),
        get ref() {
          return validationRef;
        },
        set ref($$value) {
          validationRef = $$value;
          $$settled = false;
        },
        get visible() {
          return visible;
        },
        set visible($$value) {
          visible = $$value;
          $$settled = false;
        },
        get messageId() {
          return messageId;
        },
        set messageId($$value) {
          messageId = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          element(
            $$payload3,
            containerTag,
            () => {
              $$payload3.out.push(`${spread_attributes(
                { ...containerRest },
                "svelte-1lj4t1a",
                {
                  "neo-checkbox-container": true,
                  "neo-rounded": rounded,
                  "neo-flat": !elevation
                },
                {
                  flex,
                  width: width2?.absolute,
                  "min-width": width2?.min,
                  "max-width": width2?.max,
                  height: height?.absolute,
                  "min-height": height?.min,
                  "max-height": height?.max
                }
              )}`);
            },
            () => {
              NeoBaseInput_1($$payload3, spread_props([
                {
                  "aria-invalid": valid === void 0 ? void 0 : !valid,
                  "aria-describedby": visible ? messageId : void 0,
                  id,
                  type,
                  disabled,
                  required
                },
                rest,
                {
                  hide: true,
                  hidden: true,
                  "aria-hidden": true,
                  tabindex: -1,
                  class: ["neo-checkbox-input", rest.class],
                  get ref() {
                    return ref;
                  },
                  set ref($$value) {
                    ref = $$value;
                    $$settled = false;
                  },
                  get initial() {
                    return initial;
                  },
                  set initial($$value) {
                    initial = $$value;
                    $$settled = false;
                  },
                  get group() {
                    return group;
                  },
                  set group($$value) {
                    group = $$value;
                    $$settled = false;
                  },
                  get checked() {
                    return checked;
                  },
                  set checked($$value) {
                    checked = $$value;
                    $$settled = false;
                  },
                  get indeterminate() {
                    return indeterminate;
                  },
                  set indeterminate($$value) {
                    indeterminate = $$value;
                    $$settled = false;
                  },
                  get valid() {
                    return valid;
                  },
                  set valid($$value) {
                    valid = $$value;
                    $$settled = false;
                  },
                  get dirty() {
                    return dirty;
                  },
                  set dirty($$value) {
                    dirty = $$value;
                    $$settled = false;
                  },
                  get touched() {
                    return touched;
                  },
                  set touched($$value) {
                    touched = $$value;
                    $$settled = false;
                  },
                  get focused() {
                    return focused;
                  },
                  set focused($$value) {
                    focused = $$value;
                    $$settled = false;
                  },
                  get validationMessage() {
                    return validationMessage;
                  },
                  set validationMessage($$value) {
                    validationMessage = $$value;
                    $$settled = false;
                  }
                }
              ]));
              $$payload3.out.push(`<!----> `);
              NeoCheckboxButton($$payload3, spread_props([
                {
                  "aria-labelledby": labelId,
                  indeterminate,
                  checked,
                  touched,
                  rounded,
                  start,
                  glass,
                  color,
                  tinted,
                  disabled,
                  skeleton,
                  elevation,
                  onclick: () => ref?.click()
                },
                buttonProps
              ]));
              $$payload3.out.push(`<!----> `);
              NeoLabel($$payload3, spread_props([
                { id: labelId, for: id, label, disabled, required },
                labelProps,
                {
                  get ref() {
                    return labelRef;
                  },
                  set ref($$value) {
                    labelRef = $$value;
                    $$settled = false;
                  }
                }
              ]));
              $$payload3.out.push(`<!----> `);
              if (loading !== void 0) {
                $$payload3.out.push("<!--[-->");
                $$payload3.out.push(`<span class="neo-checkbox-suffix svelte-1lj4t1a">`);
                if (loading) {
                  $$payload3.out.push("<!--[-->");
                  $$payload3.out.push(`<span class="neo-checkbox-loading">`);
                  IconCircleLoading($$payload3, { size: "1rem" });
                  $$payload3.out.push(`<!----></span>`);
                } else {
                  $$payload3.out.push("<!--[!-->");
                }
                $$payload3.out.push(`<!--]--></span>`);
              } else {
                $$payload3.out.push("<!--[!-->");
              }
              $$payload3.out.push(`<!--]-->`);
            }
          );
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    ref,
    group,
    checked,
    indeterminate,
    valid,
    dirty,
    touched,
    focused,
    hovered,
    labelRef,
    containerRef,
    validationRef
  });
  pop();
}
function NeoRadio($$payload, $$props) {
  push();
  let {
    // Snippets
    label,
    // State
    type = "radio",
    id = `neo-radio-${getUUID()}`,
    ref = void 0,
    group = void 0,
    checked = false,
    valid = void 0,
    dirty = false,
    touched = false,
    focused = false,
    hovered = false,
    disabled,
    required,
    loading,
    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,
    // Styles
    start,
    glass,
    color,
    tinted,
    rounded = true,
    skeleton = false,
    // Size
    flex,
    width: _width,
    height: _height,
    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Other props
    containerRef = void 0,
    labelRef = void 0,
    labelProps,
    buttonProps,
    containerProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: containerTag = "div", ...containerRest } = containerProps ?? {};
  const elevation = coerce(_elevation);
  const labelId = label ? `neo-radio-label-${getUUID()}` : void 0;
  let initial = checked;
  let validationMessage = ref?.validationMessage ?? "";
  const width2 = toSize(_width);
  const height = toSize(_height);
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    element(
      $$payload2,
      containerTag,
      () => {
        $$payload2.out.push(`${spread_attributes(
          { ...containerRest },
          "svelte-1evj64a",
          {
            "neo-radio-container": true,
            "neo-rounded": rounded,
            "neo-flat": !elevation
          },
          {
            flex,
            width: width2?.absolute,
            "min-width": width2?.min,
            "max-width": width2?.max,
            height: height?.absolute,
            "min-height": height?.min,
            "max-height": height?.max
          }
        )}`);
      },
      () => {
        NeoBaseInput_1($$payload2, spread_props([
          {
            "aria-invalid": valid === void 0 ? void 0 : !valid,
            id,
            type,
            disabled,
            required
          },
          rest,
          {
            hide: true,
            hidden: true,
            "aria-hidden": true,
            tabindex: -1,
            class: ["neo-radio-input", rest.class],
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            get initial() {
              return initial;
            },
            set initial($$value) {
              initial = $$value;
              $$settled = false;
            },
            get group() {
              return group;
            },
            set group($$value) {
              group = $$value;
              $$settled = false;
            },
            get checked() {
              return checked;
            },
            set checked($$value) {
              checked = $$value;
              $$settled = false;
            },
            get valid() {
              return valid;
            },
            set valid($$value) {
              valid = $$value;
              $$settled = false;
            },
            get dirty() {
              return dirty;
            },
            set dirty($$value) {
              dirty = $$value;
              $$settled = false;
            },
            get touched() {
              return touched;
            },
            set touched($$value) {
              touched = $$value;
              $$settled = false;
            },
            get focused() {
              return focused;
            },
            set focused($$value) {
              focused = $$value;
              $$settled = false;
            },
            get validationMessage() {
              return validationMessage;
            },
            set validationMessage($$value) {
              validationMessage = $$value;
              $$settled = false;
            }
          }
        ]));
        $$payload2.out.push(`<!----> `);
        NeoRadioButton($$payload2, spread_props([
          {
            "aria-labelledby": labelId,
            checked,
            touched,
            rounded,
            start,
            glass,
            disabled,
            skeleton,
            elevation,
            color,
            tinted,
            onclick: () => ref?.click()
          },
          buttonProps
        ]));
        $$payload2.out.push(`<!----> `);
        NeoLabel($$payload2, spread_props([
          { id: labelId, for: id, label, disabled, required },
          labelProps,
          {
            get ref() {
              return labelRef;
            },
            set ref($$value) {
              labelRef = $$value;
              $$settled = false;
            }
          }
        ]));
        $$payload2.out.push(`<!----> `);
        if (loading !== void 0) {
          $$payload2.out.push("<!--[-->");
          $$payload2.out.push(`<span class="neo-radio-suffix svelte-1evj64a">`);
          if (loading) {
            $$payload2.out.push("<!--[-->");
            $$payload2.out.push(`<span class="neo-radio-loading">`);
            IconCircleLoading($$payload2, { size: "1rem" });
            $$payload2.out.push(`<!----></span>`);
          } else {
            $$payload2.out.push("<!--[!-->");
          }
          $$payload2.out.push(`<!--]--></span>`);
        } else {
          $$payload2.out.push("<!--[!-->");
        }
        $$payload2.out.push(`<!--]-->`);
      }
    );
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    ref,
    group,
    checked,
    valid,
    dirty,
    touched,
    focused,
    hovered,
    containerRef,
    labelRef
  });
  pop();
}
function NeoRange($$payload, $$props) {
  push();
  let {
    // Snippets
    label,
    tooltip,
    message,
    error,
    before,
    after,
    mark,
    // State
    id = `neo-range-${getUUID()}`,
    ref = void 0,
    value = 0,
    valid = void 0,
    dirty = false,
    touched = false,
    focused = false,
    hovered = false,
    disabled,
    readonly,
    loading,
    validation,
    min = 0,
    max = 100,
    step,
    ticks,
    name,
    form,
    register,
    // Styles
    start,
    glass,
    color,
    tinted,
    rounded = true,
    tooltips = true,
    skeleton = false,
    // Size
    flex: _flex,
    width: _width,
    height: _height,
    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,
    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Actions
    use,
    // Other props
    labelRef = void 0,
    labelProps,
    messageProps,
    containerProps,
    validationRef = void 0,
    validationProps,
    floatingProps,
    floatingOptions,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: containerTag = "div", ...containerRest } = containerProps ?? {};
  const elevation = coerce(_elevation);
  const isArray = Array.isArray(value);
  const initial = Array.isArray(value) ? [...value] : value;
  const lower = typeof value === "number" ? value : value?.[0];
  const upper = typeof value === "number" ? void 0 : value?.[1];
  const lowerProgress = (lower - min) / (max - min) * 100;
  const upperProgress = upper ? (upper - min) / (max - min) * 100 : lowerProgress;
  const steps = ticks ? Math.round((max - min) / (step ?? 1)) : 0;
  const isFilled = (tick2) => {
    const tickProgress = tick2 / steps * 100;
    if (isArray) return tickProgress >= lowerProgress && tickProgress <= upperProgress;
    return tickProgress <= lowerProgress;
  };
  const showTick = (tick2) => {
    const tickProgress = tick2 / steps * 100;
    if (Array.isArray(ticks)) return ticks.includes(tickProgress);
    return ticks === true;
  };
  const boxShadow = computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation);
  const show = tooltips && (focused || hovered);
  const lowerTooltip = useFloating({
    get open() {
      return show;
    },
    placement: "bottom",
    middleware: [flip(), offset(6)],
    ...floatingOptions
  });
  const upperTooltip = useFloating({
    get open() {
      return show;
    },
    placement: "bottom",
    middleware: [flip(), offset(6)],
    ...floatingOptions
  });
  const updateTooltips = () => {
    lowerTooltip.update();
    if (isArray) upperTooltip.update();
  };
  const setValue = (v, index = 0) => {
    const clamped = clamp(v, min, max);
    if (!Array.isArray(value)) value = clamped;
    else if (index === 0 && clamped >= value[1]) value = [value[1], value[1]];
    else if (index === 1 && clamped <= value[0]) value = [value[0], value[0]];
    else value = [index ? value[0] : clamped, index ? clamped : value[1]];
    updateTooltips();
    return value;
  };
  let holding = 1;
  const stepUp = (index = 0) => {
    if (disabled || readonly) return value;
    return setValue((index ? upper ?? 0 : lower) - (step || 1) * round(holding), index);
  };
  const stepDown = (index = 0) => {
    if (disabled || readonly) return value;
    return setValue((index ? upper ?? 0 : lower) + (step || 1) * round(holding), index);
  };
  const getDragHandler = (element2, index = 0) => {
    const onMove = (event) => {
      if (!element2) return;
    };
    const onUp = (event) => {
      if (!element2) return;
      element2.removeEventListener("pointermove", onMove);
      element2.removeEventListener("pointerup", onUp);
      element2.releasePointerCapture(event.pointerId);
    };
    const onDown = (event) => {
      if (disabled || readonly) return;
      return;
    };
    const onDrag = (e) => e.preventDefault();
    const onArrow = (e) => {
      if (!e.key.startsWith("Arrow")) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        stepUp(index);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        stepDown(index);
      }
      holding = Math.min((holding + 1) ** 1.01, 100);
    };
    const onArrowUp = () => {
      holding = 1;
    };
    return {
      onpointercancel: onUp,
      onpointerdown: onDown,
      onpointerup: onUp,
      ondragstart: onDrag,
      onkeydown: onArrow,
      onkeyup: onArrowUp
    };
  };
  const handler = getDragHandler(lowerTooltip.elements.reference);
  const progressHandler = getDragHandler(upperTooltip.elements.reference, 1);
  const context = {
    // Ref
    ref,
    // State
    focused,
    hovered,
    disabled,
    readonly,
    initial,
    loading,
    min,
    max,
    step,
    value,
    touched,
    dirty,
    valid,
    // Styles
    ticks,
    color,
    tooltips,
    rounded,
    glass,
    tinted,
    start,
    skeleton,
    elevation,
    // Methods
    stepUp,
    stepDown
  };
  const inputForm = {
    id,
    ref,
    name,
    form,
    type: "range",
    state: { valid, dirty, touched, value, initial }
  };
  let rangeHeight = void 0;
  let visible = false;
  const flex = visible ? void 0 : _flex;
  const width2 = visible ? void 0 : toSize(_width);
  const height = visible ? void 0 : toSize(_height);
  toTransition(inAction ?? transitionAction);
  toTransitionProps(inAction ?? transitionAction);
  toTransition(outAction ?? transitionAction);
  toTransitionProps(outAction ?? transitionAction);
  toAction(use);
  toActionProps(use);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    NeoInputValidation($$payload2, spread_props([
      {
        input: inputForm,
        register,
        valid,
        validation,
        error,
        context,
        message,
        messageProps,
        rounded,
        flex: _flex,
        width: _width,
        height: _height,
        in: inAction,
        out: outAction,
        transition: transitionAction
      },
      validationProps,
      {
        style: toStyle("--neo-validation-padding: 0", validationProps?.style),
        get ref() {
          return validationRef;
        },
        set ref($$value) {
          validationRef = $$value;
          $$settled = false;
        },
        get visible() {
          return visible;
        },
        set visible($$value) {
          visible = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          element(
            $$payload3,
            containerTag,
            () => {
              $$payload3.out.push(`${spread_attributes(
                {
                  "data-value": value,
                  "data-array": isArray,
                  "data-lower": lower,
                  "data-upper": upper,
                  "data-min": min,
                  "data-max": max,
                  role: "none",
                  ...containerRest
                },
                "svelte-mcb15y",
                { "neo-range-container": true },
                {
                  flex,
                  width: width2?.absolute,
                  "min-width": width2?.min,
                  "max-width": width2?.max,
                  height: height?.absolute,
                  "min-height": height?.min,
                  "max-height": height?.max,
                  "--neo-range-height": rangeHeight
                }
              )}`);
            },
            () => {
              if (lowerTooltip.open) {
                $$payload3.out.push("<!--[-->");
                $$payload3.out.push(`<span${spread_attributes(
                  {
                    ...floatingProps,
                    style: toStyle(lowerTooltip.floatingStyles, floatingProps?.style)
                  },
                  "svelte-mcb15y",
                  { "neo-range-value": true, "neo-rounded": rounded },
                  { "--neo-range-handler-z-index": 1 }
                )}>`);
                if (tooltip) {
                  $$payload3.out.push("<!--[-->");
                  tooltip($$payload3, { lower: true, upper: false, value: lower }, context);
                  $$payload3.out.push(`<!---->`);
                } else {
                  $$payload3.out.push("<!--[!-->");
                  $$payload3.out.push(`${escape_html(lower)}`);
                }
                $$payload3.out.push(`<!--]--></span>`);
              } else {
                $$payload3.out.push("<!--[!-->");
              }
              $$payload3.out.push(`<!--]--> `);
              if (isArray && upperTooltip.open) {
                $$payload3.out.push("<!--[-->");
                $$payload3.out.push(`<span${spread_attributes(
                  {
                    ...floatingProps,
                    style: toStyle(upperTooltip.floatingStyles, floatingProps?.style)
                  },
                  "svelte-mcb15y",
                  { "neo-range-value": true, "neo-rounded": rounded }
                )}>`);
                if (tooltip) {
                  $$payload3.out.push("<!--[-->");
                  tooltip($$payload3, { lower: false, upper: true, value: upper }, context);
                  $$payload3.out.push(`<!---->`);
                } else {
                  $$payload3.out.push("<!--[!-->");
                  $$payload3.out.push(`${escape_html(upper)}`);
                }
                $$payload3.out.push(`<!--]--></span>`);
              } else {
                $$payload3.out.push("<!--[!-->");
              }
              $$payload3.out.push(`<!--]--> `);
              NeoLabel($$payload3, spread_props([
                { for: id, label, disabled },
                labelProps,
                {
                  get ref() {
                    return labelRef;
                  },
                  set ref($$value) {
                    labelRef = $$value;
                    $$settled = false;
                  },
                  children: ($$payload4) => {
                    $$payload4.out.push(`<span class="neo-range-label-container svelte-mcb15y">`);
                    if (before !== void 0) {
                      $$payload4.out.push("<!--[-->");
                      $$payload4.out.push(`<span class="neo-range-prefix svelte-mcb15y">`);
                      before($$payload4, context);
                      $$payload4.out.push(`<!----></span>`);
                    } else {
                      $$payload4.out.push("<!--[!-->");
                    }
                    $$payload4.out.push(`<!--]--> <span${spread_attributes(
                      { ...rest },
                      "svelte-mcb15y",
                      {
                        "neo-range-slider": true,
                        "neo-rounded": rounded,
                        "neo-start": start,
                        "neo-glass": glass,
                        "neo-tinted": tinted,
                        "neo-disabled": disabled,
                        "neo-skeleton": skeleton,
                        "neo-flat": !elevation,
                        "neo-valid": validation && valid,
                        "neo-invalid": validation && !valid
                      },
                      {
                        "--neo-range-tick-count": steps,
                        "--neo-range-box-shadow": boxShadow,
                        "--neo-range-progress": `${stringify(lowerProgress)}%`,
                        "--neo-range-array-progress": `${stringify(upperProgress)}%`
                      }
                    )}><span role="region" class="neo-range-rail svelte-mcb15y"${attr_style("", { "--neo-range-color": getColorVariable(color) })}><span${attr_class("neo-range-handle-before svelte-mcb15y", void 0, { "neo-array": isArray })}></span> <button${spread_attributes(
                      {
                        type: "button",
                        class: "neo-range-handle",
                        "aria-label": `Drag to set ${stringify(isArray ? "lower " : "")}value`,
                        ...handler
                      },
                      "svelte-mcb15y",
                      void 0,
                      { "--neo-range-handler-z-index": 1 }
                    )}></button> `);
                    if (isArray) {
                      $$payload4.out.push("<!--[-->");
                      $$payload4.out.push(`<span class="neo-range-handle-before neo-range svelte-mcb15y"></span> <button${spread_attributes(
                        {
                          type: "button",
                          class: "neo-range-handle",
                          "aria-label": "Drag to set upper value",
                          ...progressHandler
                        },
                        "svelte-mcb15y"
                      )}></button>`);
                    } else {
                      $$payload4.out.push("<!--[!-->");
                    }
                    $$payload4.out.push(`<!--]--> <span class="neo-range-handle-after svelte-mcb15y"></span> `);
                    if (steps > 1) {
                      $$payload4.out.push("<!--[-->");
                      const each_array = ensure_array_like({ length: (steps ?? 0) + 1 });
                      $$payload4.out.push(`<!--[-->`);
                      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                        each_array[i];
                        if (showTick(i)) {
                          $$payload4.out.push("<!--[-->");
                          const filled = isFilled(i);
                          $$payload4.out.push(`<div class="neo-range-tick svelte-mcb15y"${attr_style("", { "--neo-range-tick-index": i })}>`);
                          if (mark) {
                            $$payload4.out.push("<!--[-->");
                            mark($$payload4, { index: i, filled }, context);
                            $$payload4.out.push(`<!---->`);
                          } else {
                            $$payload4.out.push("<!--[!-->");
                            $$payload4.out.push(`<span${attr_class("neo-range-tick-mark svelte-mcb15y", void 0, { "neo-filled": filled })}></span>`);
                          }
                          $$payload4.out.push(`<!--]--></div>`);
                        } else {
                          $$payload4.out.push("<!--[!-->");
                        }
                        $$payload4.out.push(`<!--]-->`);
                      }
                      $$payload4.out.push(`<!--]-->`);
                    } else {
                      $$payload4.out.push("<!--[!-->");
                    }
                    $$payload4.out.push(`<!--]--></span></span> `);
                    if (loading !== void 0 || after !== void 0) {
                      $$payload4.out.push("<!--[-->");
                      $$payload4.out.push(`<span class="neo-range-suffix svelte-mcb15y">`);
                      if (after) {
                        $$payload4.out.push("<!--[-->");
                        after($$payload4, context);
                        $$payload4.out.push(`<!---->`);
                      } else {
                        $$payload4.out.push("<!--[!-->");
                      }
                      $$payload4.out.push(`<!--]--> `);
                      if (loading) {
                        $$payload4.out.push("<!--[-->");
                        $$payload4.out.push(`<span class="neo-range-loading svelte-mcb15y">`);
                        IconCircleLoading($$payload4, { size: "1rem" });
                        $$payload4.out.push(`<!----></span>`);
                      } else {
                        $$payload4.out.push("<!--[!-->");
                      }
                      $$payload4.out.push(`<!--]--></span>`);
                    } else {
                      $$payload4.out.push("<!--[!-->");
                    }
                    $$payload4.out.push(`<!--]--></span>`);
                  },
                  $$slots: { default: true }
                }
              ]));
              $$payload3.out.push(`<!---->`);
            }
          );
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    ref,
    value,
    valid,
    dirty,
    touched,
    focused,
    hovered,
    labelRef,
    validationRef
  });
  pop();
}
function NeoSwitch($$payload, $$props) {
  push();
  let {
    // Snippets
    label,
    message,
    error,
    on,
    off,
    handle,
    // State
    type = "checkbox",
    id = `neo-switch-${getUUID()}`,
    ref = void 0,
    group = void 0,
    checked = false,
    indeterminate = false,
    valid = void 0,
    dirty = false,
    touched = false,
    hovered = false,
    focused = false,
    disabled,
    required,
    loading,
    validation,
    register,
    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,
    // Styles
    start,
    glass,
    color,
    tinted,
    rounded = true,
    skeleton = false,
    // Size
    flex: _flex,
    width: _width,
    height: _height,
    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,
    // Other props
    labelRef = void 0,
    labelProps,
    buttonProps,
    messageProps,
    containerRef = void 0,
    containerProps,
    validationRef = void 0,
    validationProps,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const { tag: containerTag = "div", ...containerRest } = containerProps ?? {};
  const labelId = label ? `neo-switch-label-${getUUID()}` : void 0;
  const elevation = coerce(_elevation);
  let initial = checked;
  let validationMessage = ref?.validationMessage ?? "";
  let visible = false;
  let messageId = `neo-switch-message-${getUUID()}`;
  const context = {
    // Ref
    ref,
    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,
    // State
    value: checked,
    touched,
    dirty,
    valid,
    readonly: rest.readonly,
    disabled,
    // Styles
    rounded,
    glass,
    start,
    skeleton
  };
  const inputForm = {
    id,
    ref,
    name: rest?.name,
    form: rest?.form,
    type: "switch",
    state: { valid, dirty, touched, value: checked, initial }
  };
  const flex = visible ? void 0 : _flex;
  const width2 = visible ? void 0 : toSize(_width);
  const height = visible ? void 0 : toSize(_height);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    NeoInputValidation($$payload2, spread_props([
      {
        input: inputForm,
        register,
        valid,
        validation,
        validationMessage,
        error,
        rounded,
        context,
        message,
        messageProps,
        flex: _flex,
        width: _width,
        height: _height,
        in: inAction,
        out: outAction,
        transition: transitionAction
      },
      validationProps,
      {
        style: toStyle("--neo-validation-padding: 0", validationProps?.style),
        get ref() {
          return validationRef;
        },
        set ref($$value) {
          validationRef = $$value;
          $$settled = false;
        },
        get visible() {
          return visible;
        },
        set visible($$value) {
          visible = $$value;
          $$settled = false;
        },
        get messageId() {
          return messageId;
        },
        set messageId($$value) {
          messageId = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          element(
            $$payload3,
            containerTag,
            () => {
              $$payload3.out.push(`${spread_attributes({ ...containerRest }, "svelte-1j26don", { "neo-switch-container": true, "neo-flat": !elevation }, {
                flex,
                width: width2?.absolute,
                "min-width": width2?.min,
                "max-width": width2?.max,
                height: height?.absolute,
                "min-height": height?.min,
                "max-height": height?.max
              })}`);
            },
            () => {
              NeoBaseInput_1($$payload3, spread_props([
                {
                  "aria-invalid": valid === void 0 ? void 0 : !valid,
                  "aria-describedby": visible ? messageId : void 0,
                  id,
                  type,
                  disabled,
                  required
                },
                rest,
                {
                  hide: true,
                  hidden: true,
                  "aria-hidden": true,
                  tabindex: -1,
                  class: ["neo-switch-input", rest.class],
                  get ref() {
                    return ref;
                  },
                  set ref($$value) {
                    ref = $$value;
                    $$settled = false;
                  },
                  get initial() {
                    return initial;
                  },
                  set initial($$value) {
                    initial = $$value;
                    $$settled = false;
                  },
                  get group() {
                    return group;
                  },
                  set group($$value) {
                    group = $$value;
                    $$settled = false;
                  },
                  get checked() {
                    return checked;
                  },
                  set checked($$value) {
                    checked = $$value;
                    $$settled = false;
                  },
                  get indeterminate() {
                    return indeterminate;
                  },
                  set indeterminate($$value) {
                    indeterminate = $$value;
                    $$settled = false;
                  },
                  get valid() {
                    return valid;
                  },
                  set valid($$value) {
                    valid = $$value;
                    $$settled = false;
                  },
                  get dirty() {
                    return dirty;
                  },
                  set dirty($$value) {
                    dirty = $$value;
                    $$settled = false;
                  },
                  get touched() {
                    return touched;
                  },
                  set touched($$value) {
                    touched = $$value;
                    $$settled = false;
                  },
                  get focused() {
                    return focused;
                  },
                  set focused($$value) {
                    focused = $$value;
                    $$settled = false;
                  },
                  get validationMessage() {
                    return validationMessage;
                  },
                  set validationMessage($$value) {
                    validationMessage = $$value;
                    $$settled = false;
                  }
                }
              ]));
              $$payload3.out.push(`<!----> `);
              NeoSwitchButton($$payload3, spread_props([
                {
                  "aria-labelledby": labelId,
                  handle,
                  off,
                  on,
                  indeterminate,
                  checked,
                  rounded,
                  start,
                  glass,
                  color,
                  tinted,
                  disabled,
                  skeleton,
                  elevation,
                  valid: validation ? valid : void 0,
                  onclick: () => ref?.click()
                },
                buttonProps
              ]));
              $$payload3.out.push(`<!----> `);
              NeoLabel($$payload3, spread_props([
                { id: labelId, for: id, label, disabled, required },
                labelProps,
                {
                  get ref() {
                    return labelRef;
                  },
                  set ref($$value) {
                    labelRef = $$value;
                    $$settled = false;
                  }
                }
              ]));
              $$payload3.out.push(`<!----> `);
              if (loading !== void 0) {
                $$payload3.out.push("<!--[-->");
                $$payload3.out.push(`<span class="neo-switch-suffix svelte-1j26don">`);
                if (loading) {
                  $$payload3.out.push("<!--[-->");
                  $$payload3.out.push(`<span class="neo-switch-loading">`);
                  IconCircleLoading($$payload3, { size: "1rem" });
                  $$payload3.out.push(`<!----></span>`);
                } else {
                  $$payload3.out.push("<!--[!-->");
                }
                $$payload3.out.push(`<!--]--></span>`);
              } else {
                $$payload3.out.push("<!--[!-->");
              }
              $$payload3.out.push(`<!--]-->`);
            }
          );
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    ref,
    group,
    checked,
    indeterminate,
    valid,
    dirty,
    touched,
    hovered,
    focused,
    labelRef,
    containerRef,
    validationRef
  });
  pop();
}
const NeoTheme = {
  Light: "light",
  Dark: "dark"
};
const NeoSource = {
  TopLeft: "top-left"
};
const NeoThemeRoot = "neo-theme-root";
const NeoThemeStorageKey = {
  Reset: "neo-reset",
  Theme: "neo-theme",
  Source: "neo-source",
  Remember: "neo-remember",
  Transition: "neo-transition"
};
const getSavedTheme = () => localStorage?.getItem(NeoThemeStorageKey.Theme);
const getPreferTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? NeoTheme.Dark : NeoTheme.Light;
const getTheme = () => getSavedTheme() ?? getPreferTheme();
const getSavedSource = () => localStorage?.getItem(NeoThemeStorageKey.Source);
const getSource = () => getSavedSource() ?? NeoSource.TopLeft;
function getBoolean(str, fallback = false) {
  if (!str)
    return fallback;
  return str === "true";
}
const getSavedReset = () => localStorage?.getItem(NeoThemeStorageKey.Reset);
const getReset = () => getBoolean(getSavedReset(), true);
const getSavedRemember = () => localStorage?.getItem(NeoThemeStorageKey.Remember);
const getRemember = () => getBoolean(getSavedRemember(), true);
class NeoThemeProviderContext {
  #reset = getReset();
  #theme = getTheme();
  #source = getSource();
  #remember = getRemember();
  #root = document?.documentElement;
  get reset() {
    return this.#reset;
  }
  get theme() {
    return this.#theme;
  }
  get source() {
    return this.#source;
  }
  get remember() {
    return this.#remember;
  }
  get root() {
    return typeof this.#root === "function" ? this.#root() : this.#root;
  }
  get state() {
    return {
      reset: this.reset,
      theme: this.theme,
      source: this.source,
      remember: this.remember,
      root: this.root
    };
  }
  constructor({ reset, theme, source, remember, root }) {
    this.#reset = reset ?? this.reset;
    this.#theme = theme ?? this.theme;
    this.#source = source ?? this.source;
    this.#remember = remember ?? this.remember;
    this.#root = root ?? this.root;
    this.sync();
  }
  update(partial) {
    run(() => {
      if (partial.reset !== void 0) this.#reset = partial.reset;
      if (partial.theme !== void 0) this.#theme = partial.theme;
      if (partial.source !== void 0) this.#source = partial.source;
      if (partial.remember !== void 0) this.#remember = partial.remember;
      if (partial.root !== void 0) this.#root = partial.root;
      this.sync();
    });
  }
  async setTheme(theme) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!("setAttribute" in this.root)) throw new NeoErrorThemeInvalidTarget();
    if (this.theme === this.root.getAttribute(NeoThemeStorageKey.Theme)) return;
    this.root.setAttribute(NeoThemeStorageKey.Transition, "false");
    this.root.setAttribute(NeoThemeStorageKey.Theme, theme);
    await wait();
    this.root.removeAttribute(NeoThemeStorageKey.Transition);
  }
  setSource(source) {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!("setAttribute" in this.root)) throw new NeoErrorThemeInvalidTarget();
    if (this.source === this.root.getAttribute(NeoThemeStorageKey.Source)) return;
    this.root.setAttribute(NeoThemeStorageKey.Source, source);
  }
  sync() {
    if (!this.root) throw new NeoErrorThemeTargetNotFound();
    if (!("setAttribute" in this.root)) throw new NeoErrorThemeInvalidTarget();
    this.root.setAttribute(NeoThemeRoot, "");
    void this.setTheme(this.theme);
    this.setSource(this.source);
    if (this.reset) this.root.setAttribute(NeoThemeStorageKey.Reset, "");
    else this.root.removeAttribute(NeoThemeStorageKey.Reset);
    if (!localStorage) return;
    localStorage.setItem(NeoThemeStorageKey.Remember, Boolean(this.remember).toString());
    if (this.remember) {
      localStorage.setItem(NeoThemeStorageKey.Reset, Boolean(this.reset).toString());
      localStorage.setItem(NeoThemeStorageKey.Theme, this.theme);
      localStorage.setItem(NeoThemeStorageKey.Source, this.source);
    } else {
      localStorage.removeItem(NeoThemeStorageKey.Reset);
      localStorage.removeItem(NeoThemeStorageKey.Theme);
      localStorage.removeItem(NeoThemeStorageKey.Source);
    }
  }
  destroy() {
    if (!this.root) return;
    if (!("removeAttribute" in this.root)) return;
    this.root.removeAttribute(NeoThemeRoot);
    this.root.removeAttribute(NeoThemeStorageKey.Reset);
    this.root.removeAttribute(NeoThemeStorageKey.Theme);
    this.root.removeAttribute(NeoThemeStorageKey.Source);
  }
}
const NeoContextKey = Symbol("NeoThemeProviderContext");
function setNeoThemeContext(context) {
  return setContext(NeoContextKey, new NeoThemeProviderContext(context));
}
function NeoThemeProvider($$payload, $$props) {
  push();
  let {
    // Snippets
    children,
    // States
    reset,
    theme,
    source,
    remember,
    target
  } = $$props;
  const context = setNeoThemeContext({ reset, theme, source, remember, root: target });
  onDestroy(() => context.destroy());
  children?.($$payload, context.state);
  $$payload.out.push(`<!---->`);
  pop();
}
const KeyboardLayouts = Object.freeze({
  Qwerty: "qwerty",
  Azerty: "azerty"
});
Object.freeze({
  [KeyboardLayouts.Qwerty]: Object.freeze({
    "q": "wa",
    "w": "qse",
    "e": "wrd",
    "r": "etf",
    "t": "ryg",
    "y": "tuh",
    "u": "yij",
    "i": "uok",
    "o": "ipl",
    "p": "o",
    "a": "qsz",
    "s": "awed",
    "d": "serf",
    "f": "drtg",
    "g": "ftyh",
    "h": "gyuj",
    "j": "huik",
    "k": "jiol",
    "l": "kop",
    "z": "asx",
    "x": "zdc",
    "c": "xdfv",
    "v": "cfgb",
    "b": "vghn",
    "n": "bhjm",
    "m": "njk",
    "1": "2q",
    "2": "13w",
    "3": "24e",
    "4": "35r",
    "5": "46t",
    "6": "57y",
    "7": "68u",
    "8": "79i",
    "9": "80o",
    "0": "9p",
    "-": "0=",
    "=": "-",
    ".": ",/",
    ",": "m.",
    "/": "."
  }),
  [KeyboardLayouts.Azerty]: Object.freeze({
    "a": "qzs",
    "z": "aqse",
    "e": "zrsd",
    "r": "etfd",
    "t": "rygf",
    "y": "tuhg",
    "u": "yijh",
    "i": "uokj",
    "o": "iplk",
    "p": "o",
    "q": "azw",
    "s": "awed",
    "d": "serf",
    "f": "drtg",
    "g": "ftyh",
    "h": "gyuj",
    "j": "huik",
    "k": "jiol",
    "l": "kopm",
    "m": "l",
    "w": "qsx",
    "x": "wcd",
    "c": "xdfv",
    "v": "cfgb",
    "b": "vghn",
    "n": "bhjm",
    "1": "2a",
    "2": "13z",
    "3": "24e",
    "4": "35r",
    "5": "46t",
    "6": "57y",
    "7": "68u",
    "8": "79i",
    "9": "80o",
    "0": "9p",
    "-": "0=",
    "=": "-",
    ".": ",/",
    ",": "m.",
    "/": "."
  })
});
({
  typo: {
    layout: KeyboardLayouts.Qwerty
  }
});
function _page($$payload) {
  let inputValue = "";
  let switchValue = false;
  let rangeValue = 50;
  let checkboxValue = false;
  let radioValue = "option1";
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Neo Svelte Demo - Neumorphic UI Library</title>`;
      $$payload3.out.push(`<meta name="description" content="Demo of @dvcol/neo-svelte neumorphic UI components"/>`);
    });
    NeoThemeProvider($$payload2, {
      children: ($$payload3) => {
        $$payload3.out.push(`<div class="min-h-screen bg-gray-100 p-8"><div class="max-w-6xl mx-auto"><h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Neo Svelte Demo</h1> <p class="text-center text-gray-600 mb-12">Exploring the @dvcol/neo-svelte neumorphic UI library for Svelte 5</p> `);
        NeoCard($$payload3, {
          class: "mb-8 p-6",
          children: ($$payload4) => {
            $$payload4.out.push(`<h2 class="text-2xl font-semibold mb-4 text-gray-800">Buttons</h2> <div class="flex flex-wrap gap-4">`);
            NeoButton($$payload4, {
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Default Button`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoButton($$payload4, {
              variant: "primary",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Primary Button`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoButton($$payload4, {
              variant: "secondary",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Secondary Button`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoButton($$payload4, {
              disabled: true,
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Disabled Button`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----></div>`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        NeoCard($$payload3, {
          class: "mb-8 p-6",
          children: ($$payload4) => {
            $$payload4.out.push(`<h2 class="text-2xl font-semibold mb-4 text-gray-800">Inputs</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Text Input</label> `);
            NeoInput($$payload4, {
              placeholder: "Enter text...",
              get value() {
                return inputValue;
              },
              set value($$value) {
                inputValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <div><label class="block text-sm font-medium text-gray-700 mb-2">Password Input</label> `);
            NeoInput($$payload4, { type: "password", placeholder: "Enter password..." });
            $$payload4.out.push(`<!----></div></div>`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        NeoCard($$payload3, {
          class: "mb-8 p-6",
          children: ($$payload4) => {
            $$payload4.out.push(`<h2 class="text-2xl font-semibold mb-4 text-gray-800">Form Controls</h2> <div class="space-y-6"><div class="flex items-center space-x-4">`);
            NeoSwitch($$payload4, {
              get checked() {
                return switchValue;
              },
              set checked($$value) {
                switchValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----> <span class="text-gray-700">Toggle Switch: ${escape_html(switchValue ? "On" : "Off")}</span></div> <div><label class="block text-sm font-medium text-gray-700 mb-2">Range Slider: ${escape_html(rangeValue)}</label> `);
            NeoRange($$payload4, {
              min: 0,
              max: 100,
              get value() {
                return rangeValue;
              },
              set value($$value) {
                rangeValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <div class="flex items-center space-x-4">`);
            NeoCheckbox($$payload4, {
              get checked() {
                return checkboxValue;
              },
              set checked($$value) {
                checkboxValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----> <span class="text-gray-700">Checkbox: ${escape_html(checkboxValue ? "Checked" : "Unchecked")}</span></div> <div><label class="block text-sm font-medium text-gray-700 mb-2">Radio Group: ${escape_html(radioValue)}</label> <div class="flex space-x-4"><div class="flex items-center space-x-2">`);
            NeoRadio($$payload4, {
              value: "option1",
              get group() {
                return radioValue;
              },
              set group($$value) {
                radioValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----> <span class="text-gray-700">Option 1</span></div> <div class="flex items-center space-x-2">`);
            NeoRadio($$payload4, {
              value: "option2",
              get group() {
                return radioValue;
              },
              set group($$value) {
                radioValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----> <span class="text-gray-700">Option 2</span></div> <div class="flex items-center space-x-2">`);
            NeoRadio($$payload4, {
              value: "option3",
              get group() {
                return radioValue;
              },
              set group($$value) {
                radioValue = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----> <span class="text-gray-700">Option 3</span></div></div></div></div>`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        NeoCard($$payload3, {
          class: "mb-8 p-6",
          children: ($$payload4) => {
            $$payload4.out.push(`<h2 class="text-2xl font-semibold mb-4 text-gray-800">Progress &amp; Badges</h2> <div class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">Progress: ${escape_html(rangeValue)}%</label> `);
            NeoProgress($$payload4, { value: rangeValue, max: 100 });
            $$payload4.out.push(`<!----></div> <div><label class="block text-sm font-medium text-gray-700 mb-2">Badges</label> <div class="flex flex-wrap gap-2">`);
            NeoBadge($$payload4, {
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Default`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoBadge($$payload4, {
              variant: "primary",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Primary`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoBadge($$payload4, {
              variant: "secondary",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Secondary`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoBadge($$payload4, {
              variant: "success",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Success`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoBadge($$payload4, {
              variant: "warning",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Warning`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            NeoBadge($$payload4, {
              variant: "error",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Error`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----></div></div></div>`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        NeoCard($$payload3, {
          class: "mb-8 p-6",
          children: ($$payload4) => {
            $$payload4.out.push(`<h2 class="text-2xl font-semibold mb-4 text-gray-800">Library Comparison</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 class="text-lg font-medium mb-3 text-gray-700">@dvcol/neo-svelte</h3> <ul class="space-y-2 text-sm text-gray-600"><li>✅ Native Svelte 5 support</li> <li>✅ Pre-built neumorphic components</li> <li>✅ Theme provider system</li> <li>✅ Comprehensive component library</li> <li>✅ Accessible components</li> <li>✅ TypeScript support</li></ul></div> <div><h3 class="text-lg font-medium mb-3 text-gray-700">Our Custom Implementation</h3> <ul class="space-y-2 text-sm text-gray-600"><li>✅ Custom CSS variables system</li> <li>✅ Tailwind integration</li> <li>✅ Light/dark mode support</li> <li>✅ Dynamic theme overrides</li> <li>⚠️ Limited component set</li> <li>⚠️ Manual maintenance required</li></ul></div></div>`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> <div class="text-center">`);
        NeoButton($$payload3, {
          onclick: () => window.history.back(),
          children: ($$payload4) => {
            $$payload4.out.push(`<!---->← Back to Home`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> <a href="/neumorphic-demo" class="ml-4">`);
        NeoButton($$payload3, {
          variant: "secondary",
          children: ($$payload4) => {
            $$payload4.out.push(`<!---->View Custom Implementation`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----></a></div></div></div>`);
      }
    });
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
}
export {
  _page as default
};
