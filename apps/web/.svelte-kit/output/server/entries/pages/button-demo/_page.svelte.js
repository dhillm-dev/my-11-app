import "clsx";
import { B as Button } from "../../../chunks/button.js";
function _page($$payload) {
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8"><div class="max-w-4xl mx-auto"><h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Button Style Demo</h1> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"><div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Style</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "neumorphic",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Click Me`);
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
    variant: "neumorphic",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Primary</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "neumorphic-primary",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Primary`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-primary",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
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
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Success</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "neumorphic-success",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Success`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-success",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-success",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-success",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Warning</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "neumorphic-warning",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Warning`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-warning",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-warning",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-warning",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Neumorphic Danger</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "neumorphic-danger",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Danger`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-danger",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-danger",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "neumorphic-danger",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Default Style</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "default",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Click Me`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "default",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "default",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "default",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Outline Style</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "outline",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Click Me`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "outline",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "outline",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "outline",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Secondary Style</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "secondary",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Click Me`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "secondary",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "secondary",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "secondary",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Ghost Style</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "ghost",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Click Me`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "ghost",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "ghost",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "ghost",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg"><h3 class="text-lg font-semibold text-gray-700 mb-4">Destructive Style</h3> <div class="space-y-4">`);
  Button($$payload, {
    variant: "destructive",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Delete`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "destructive",
    disabled: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Disabled`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "destructive",
    size: "sm",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Small`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "destructive",
    size: "lg",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Large`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div></div> <div class="mt-12 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-lg"><h2 class="text-2xl font-bold text-gray-800 mb-6">Usage Examples</h2> <div class="space-y-4"><div class="bg-gray-100 p-4 rounded-lg"><h4 class="font-semibold text-gray-700 mb-2">Basic Neumorphic:</h4> <code class="text-sm text-gray-600">&lt;Button variant="neumorphic">Click Me&lt;/Button></code></div> <div class="bg-gray-100 p-4 rounded-lg"><h4 class="font-semibold text-gray-700 mb-2">Primary Neumorphic:</h4> <code class="text-sm text-gray-600">&lt;Button variant="neumorphic-primary">Primary&lt;/Button></code></div> <div class="bg-gray-100 p-4 rounded-lg"><h4 class="font-semibold text-gray-700 mb-2">Success Neumorphic:</h4> <code class="text-sm text-gray-600">&lt;Button variant="neumorphic-success" size="lg">Success&lt;/Button></code></div> <div class="bg-gray-100 p-4 rounded-lg"><h4 class="font-semibold text-gray-700 mb-2">Warning Neumorphic:</h4> <code class="text-sm text-gray-600">&lt;Button variant="neumorphic-warning">Warning&lt;/Button></code></div> <div class="bg-gray-100 p-4 rounded-lg"><h4 class="font-semibold text-gray-700 mb-2">Danger Neumorphic:</h4> <code class="text-sm text-gray-600">&lt;Button variant="neumorphic-danger">Danger&lt;/Button></code></div> <div class="bg-gray-100 p-4 rounded-lg"><h4 class="font-semibold text-gray-700 mb-2">Extra Large Size:</h4> <code class="text-sm text-gray-600">&lt;Button variant="neumorphic-primary" size="xl">Extra Large&lt;/Button></code></div></div></div></div></div>`);
}
export {
  _page as default
};
