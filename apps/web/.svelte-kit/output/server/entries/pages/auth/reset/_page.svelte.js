import { Q as sanitize_props, R as rest_props, A as push, S as fallback, T as spread_attributes, U as clsx, V as bind_props, D as pop, W as copy_payload, X as assign_payload, F as head, I as attr_class, J as stringify } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { B as Button } from "../../../../chunks/button.js";
import { c as cn } from "../../../../chunks/utils2.js";
import "clsx";
function Input($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "value",
    "placeholder",
    "type",
    "disabled",
    "readonly",
    "id",
    "name",
    "required",
    "autofocus",
    "autocomplete",
    "maxlength",
    "minlength",
    "pattern",
    "step",
    "min",
    "max"
  ]);
  push();
  let className = fallback($$props["class"], void 0);
  let value = fallback($$props["value"], void 0);
  let placeholder = fallback($$props["placeholder"], void 0);
  let type = fallback($$props["type"], "text");
  let disabled = fallback($$props["disabled"], void 0);
  let readonly = fallback($$props["readonly"], void 0);
  let id = fallback($$props["id"], void 0);
  let name = fallback($$props["name"], void 0);
  let required = fallback($$props["required"], void 0);
  let autofocus = fallback($$props["autofocus"], void 0);
  let autocomplete = fallback($$props["autocomplete"], void 0);
  let maxlength = fallback($$props["maxlength"], void 0);
  let minlength = fallback($$props["minlength"], void 0);
  let pattern = fallback($$props["pattern"], void 0);
  let step = fallback($$props["step"], void 0);
  let min = fallback($$props["min"], void 0);
  let max = fallback($$props["max"], void 0);
  $$payload.out.push(`<input${spread_attributes(
    {
      value,
      placeholder,
      type,
      disabled,
      readonly,
      id,
      name,
      required,
      autocomplete,
      maxlength,
      minlength,
      pattern,
      step,
      min,
      max,
      class: clsx(cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)),
      ...$$restProps
    },
    null,
    void 0,
    void 0,
    4
  )}/>`);
  bind_props($$props, {
    class: className,
    value,
    placeholder,
    type,
    disabled,
    readonly,
    id,
    name,
    required,
    autofocus,
    autocomplete,
    maxlength,
    minlength,
    pattern,
    step,
    min,
    max
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  let password = "";
  let confirmPassword = "";
  let isLoading = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Reset Password - PicknWin</title>`;
      $$payload3.out.push(`<meta name="description" content="Create a new password for your PicknWin account"/>`);
    });
    $$payload2.out.push(`<div class="space-y-6">`);
    {
      $$payload2.out.push("<!--[!-->");
      {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="text-center"><h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Password</h2> <p class="text-slate-600 dark:text-slate-400">Enter a strong password for your account</p></div> <form class="space-y-4"><div class="space-y-2"><label for="password" class="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label> `);
        Input($$payload2, {
          id: "password",
          type: "password",
          placeholder: "Enter new password (min. 6 characters)",
          disabled: isLoading,
          class: "neumorphic-input",
          get value() {
            return password;
          },
          set value($$value) {
            password = $$value;
            $$settled = false;
          }
        });
        $$payload2.out.push(`<!----></div> <div class="space-y-2"><label for="confirmPassword" class="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label> `);
        Input($$payload2, {
          id: "confirmPassword",
          type: "password",
          placeholder: "Confirm your new password",
          disabled: isLoading,
          class: "neumorphic-input",
          get value() {
            return confirmPassword;
          },
          set value($$value) {
            confirmPassword = $$value;
            $$settled = false;
          }
        });
        $$payload2.out.push(`<!----></div> <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4"><h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password Requirements:</h4> <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1"><li class="flex items-center space-x-2"><div${attr_class(`w-1.5 h-1.5 rounded-full ${stringify(password.length >= 6 ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600")}`)}></div> <span${attr_class(clsx(password.length >= 6 ? "text-green-600 dark:text-green-400" : ""))}>At least 6 characters</span></li> <li class="flex items-center space-x-2"><div${attr_class(`w-1.5 h-1.5 rounded-full ${stringify(password === confirmPassword && password ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600")}`)}></div> <span${attr_class(clsx(password === confirmPassword && password ? "text-green-600 dark:text-green-400" : ""))}>Passwords match</span></li></ul></div> `);
        {
          $$payload2.out.push("<!--[!-->");
        }
        $$payload2.out.push(`<!--]--> `);
        Button($$payload2, {
          type: "submit",
          disabled: isLoading,
          class: "w-full neumorphic-button bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 transition-all duration-200",
          children: ($$payload3) => {
            {
              $$payload3.out.push("<!--[!-->");
              $$payload3.out.push(`Update Password`);
            }
            $$payload3.out.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
        $$payload2.out.push(`<!----></form>`);
      }
      $$payload2.out.push(`<!--]-->`);
    }
    $$payload2.out.push(`<!--]--> `);
    {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="text-center"><a href="/auth/login" class="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg> Back to Sign In</a></div>`);
    }
    $$payload2.out.push(`<!--]--></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
