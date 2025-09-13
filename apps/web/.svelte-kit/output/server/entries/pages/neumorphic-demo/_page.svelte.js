import { O as ensure_array_like, F as head, P as attr, a6 as valueless_option, D as pop, A as push, G as escape_html } from "../../../chunks/index2.js";
import { B as Button } from "../../../chunks/button.js";
import "clsx";
const themePresets = {
  // Light themes
  default: {
    "--neu-bg-color": "#e0e5ec",
    "--neu-bg-light-shadow": "#ffffff",
    "--neu-bg-dark-shadow": "#a3b1c6",
    "--neu-text-color": "#2d3748",
    "--neu-text-secondary": "#4a5568"
  },
  warm: {
    "--neu-bg-color": "#f7f3f0",
    "--neu-bg-light-shadow": "#ffffff",
    "--neu-bg-dark-shadow": "#d4c4b0",
    "--neu-text-color": "#8b4513",
    "--neu-text-secondary": "#a0522d"
  },
  cool: {
    "--neu-bg-color": "#e8f4f8",
    "--neu-bg-light-shadow": "#ffffff",
    "--neu-bg-dark-shadow": "#b8d4da",
    "--neu-text-color": "#2c5282",
    "--neu-text-secondary": "#3182ce"
  },
  // Dark themes
  dark: {
    "--neu-bg-color": "#2d3748",
    "--neu-bg-light-shadow": "#4a5568",
    "--neu-bg-dark-shadow": "#1a202c",
    "--neu-text-color": "#f7fafc",
    "--neu-text-secondary": "#e2e8f0"
  },
  darkWarm: {
    "--neu-bg-color": "#3c2415",
    "--neu-bg-light-shadow": "#5a3a2a",
    "--neu-bg-dark-shadow": "#2a1810",
    "--neu-text-color": "#f7e6d3",
    "--neu-text-secondary": "#e6d0b8"
  },
  darkCool: {
    "--neu-bg-color": "#1e3a5f",
    "--neu-bg-light-shadow": "#2d5a87",
    "--neu-bg-dark-shadow": "#0f1c2e",
    "--neu-text-color": "#e6f3ff",
    "--neu-text-secondary": "#b8e0ff"
  }
};
function _page($$payload, $$props) {
  push();
  let currentPreset = "default";
  let customPrimaryColor = "#4299e1";
  const each_array = ensure_array_like(Object.keys(themePresets));
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Neumorphic Design System - PickNWin</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen neu-base transition-all duration-500 p-8"><div class="max-w-7xl mx-auto"><div class="text-center mb-12"><h1 class="text-5xl font-bold mb-4" style="color: var(--neu-text-color)">Neumorphic Design System</h1> <p class="text-xl" style="color: var(--neu-text-secondary)">Inspired by ui-neumorphism, built for Svelte</p> <div class="mt-6 flex flex-wrap justify-center gap-4">`);
  Button($$payload, {
    variant: "neumorphic-primary",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->${escape_html("🌙")} Toggle Theme`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->🔄 Reset`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="neu-card mb-12"><h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Theme Controls</h2> <div class="mb-8"><h3 class="text-xl font-semibold mb-4" style="color: var(--neu-text-color)">Preset Themes</h3> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 svelte-1yjo9td"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let preset = each_array[$$index];
    Button($$payload, {
      variant: currentPreset === preset ? "neumorphic-pressed" : "neumorphic",
      size: "sm",
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->${escape_html(preset)}`);
      },
      $$slots: { default: true }
    });
  }
  $$payload.out.push(`<!--]--></div></div> <div class="mb-8"><h3 class="text-xl font-semibold mb-4" style="color: var(--neu-text-color)">Custom Theme</h3> <div class="flex flex-wrap items-center gap-4"><div class="flex items-center gap-2"><label style="color: var(--neu-text-secondary)">Primary Color:</label> <input type="color"${attr("value", customPrimaryColor)} class="neu-input w-16 h-10 p-1 cursor-pointer"/></div> `);
  Button($$payload, {
    variant: "neumorphic-success",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Apply Custom`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-warning",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Pink Theme (ui-neumorphism example)`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="neu-card mb-12"><h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Button Variants</h2> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 svelte-1yjo9td"><div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Basic Neumorphic</h3> <div class="space-y-3">`);
  Button($$payload, {
    variant: "neumorphic",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Default`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-flat",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Flat`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-raised",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Raised`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Color Variants</h3> <div class="space-y-3">`);
  Button($$payload, {
    variant: "neumorphic-primary",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Primary`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-success",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Success`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-warning",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Warning`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-danger",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Danger`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Sizes</h3> <div class="space-y-3">`);
  Button($$payload, {
    variant: "neumorphic-primary",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-primary",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Default`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-primary",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-primary",
    size: "xl",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Extra Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Interactive States</h3> <div class="space-y-3">`);
  Button($$payload, {
    variant: "neumorphic",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->${escape_html("Click Me")}`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    class: "neu-pulse",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Pulsing`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    class: "neu-bounce",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Bouncing`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Traditional Variants</h3> <div class="space-y-3">`);
  Button($$payload, {
    variant: "default",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Default`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "outline",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Outline`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "secondary",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Secondary`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "ghost",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Ghost`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Mixed Usage</h3> <div class="flex flex-wrap gap-2">`);
  Button($$payload, {
    variant: "neumorphic-primary",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Save`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Cancel`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-danger",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Delete`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div></div></div> <div class="neu-card mb-12"><h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Card Components</h2> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 svelte-1yjo9td"><div class="neu-card-sm"><h3 class="text-lg font-semibold mb-2" style="color: var(--neu-text-color)">Small Card</h3> <p style="color: var(--neu-text-secondary)">This is a small neumorphic card with subtle shadows.</p></div> <div class="neu-card"><h3 class="text-lg font-semibold mb-2" style="color: var(--neu-text-color)">Regular Card</h3> <p style="color: var(--neu-text-secondary)">This is a regular neumorphic card with medium shadows and padding.</p> `);
  Button($$payload, {
    variant: "neumorphic-primary",
    size: "sm",
    class: "mt-4",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Action`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div> <div class="neu-card-lg"><h3 class="text-lg font-semibold mb-2" style="color: var(--neu-text-color)">Large Card</h3> <p style="color: var(--neu-text-secondary)">This is a large neumorphic card with prominent shadows and generous padding.</p> <div class="flex gap-2 mt-4">`);
  Button($$payload, {
    variant: "neumorphic-success",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Confirm`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Cancel`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div></div></div> <div class="neu-card mb-12"><h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Input Components</h2> <div class="grid gap-6 md:grid-cols-2 svelte-1yjo9td"><div class="space-y-4"><div><label class="block text-sm font-medium mb-2" style="color: var(--neu-text-color)">Neumorphic Input</label> <input type="text" placeholder="Enter text..." class="neu-input w-full neu-focus"/></div> <div><label class="block text-sm font-medium mb-2" style="color: var(--neu-text-color)">Neumorphic Textarea</label> <textarea placeholder="Enter message..." rows="4" class="neu-input w-full neu-focus resize-none"></textarea></div></div> <div class="space-y-4"><div><label class="block text-sm font-medium mb-2" style="color: var(--neu-text-color)">Neumorphic Select</label> <select class="neu-input w-full neu-focus"><option>`);
  valueless_option($$payload, () => {
    $$payload.out.push(`Choose option...`);
  });
  $$payload.out.push(`</option><option>`);
  valueless_option($$payload, () => {
    $$payload.out.push(`Option 1`);
  });
  $$payload.out.push(`</option><option>`);
  valueless_option($$payload, () => {
    $$payload.out.push(`Option 2`);
  });
  $$payload.out.push(`</option><option>`);
  valueless_option($$payload, () => {
    $$payload.out.push(`Option 3`);
  });
  $$payload.out.push(`</option></select></div> <div class="flex items-center space-x-4"><label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" class="neu-input w-5 h-5"/> <span style="color: var(--neu-text-color)">Checkbox</span></label> <label class="flex items-center space-x-2 cursor-pointer"><input type="radio" name="radio" class="neu-input w-5 h-5"/> <span style="color: var(--neu-text-color)">Radio</span></label></div></div></div></div> <div class="neu-card mb-12"><h2 class="text-3xl font-bold mb-6" style="color: var(--neu-text-color)">Usage Examples</h2> <div class="grid gap-6 lg:grid-cols-2 svelte-1yjo9td"><div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Component Usage</h3> <div class="space-y-4"><div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Basic Button:</h4> <code class="text-sm svelte-1yjo9td" style="color: var(--neu-text-secondary)">&lt;Button variant="neumorphic">Click Me&lt;/Button></code></div> <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Primary Button:</h4> <code class="text-sm svelte-1yjo9td" style="color: var(--neu-text-secondary)">&lt;Button variant="neumorphic-primary" size="lg">Primary&lt;/Button></code></div> <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Custom Classes:</h4> <code class="text-sm svelte-1yjo9td" style="color: var(--neu-text-secondary)">&lt;div class="neu-card">Content&lt;/div></code></div></div></div> <div class="neu-card-sm"><h3 class="text-lg font-semibold mb-4" style="color: var(--neu-text-color)">Theming (like ui-neumorphism)</h3> <div class="space-y-4"><div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Override Variables:</h4> <code class="text-sm svelte-1yjo9td" style="color: var(--neu-text-secondary)">overrideThemeVariables({ '--neu-primary': '#ff6b6b' });</code></div> <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Apply Preset:</h4> <code class="text-sm svelte-1yjo9td" style="color: var(--neu-text-secondary)">applyThemePreset('dark');</code></div> <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"><h4 class="font-semibold mb-2" style="color: var(--neu-text-color)">Custom Theme:</h4> <code class="text-sm svelte-1yjo9td" style="color: var(--neu-text-secondary)">createCustomTheme('#4299e1', { isDark: false });</code></div></div></div></div></div> <div class="text-center neu-card"><h2 class="text-2xl font-bold mb-4" style="color: var(--neu-text-color)">PickNWin Neumorphic Design System</h2> <p class="mb-6" style="color: var(--neu-text-secondary)">A comprehensive neumorphic design system for Svelte, inspired by ui-neumorphism's theming approach but built specifically for our PickNWin application.</p> <div class="flex flex-wrap justify-center gap-4">`);
  Button($$payload, {
    variant: "neumorphic-primary",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->🏠 Back to Home`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->🎨 Button Demo`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div></div></div>`);
  pop();
}
export {
  _page as default
};
