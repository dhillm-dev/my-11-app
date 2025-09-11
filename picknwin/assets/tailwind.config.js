// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

const plugin = require("tailwindcss/plugin")
const fs = require("fs")
const path = require("path")

module.exports = {
  content: [
    "./js/**/*.js",
    "../lib/picknwin_admin_web.ex",
    "../lib/picknwin_admin_web/**/*.*ex"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#FD4F00",
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    // Allows prefixing tailwind classes with LiveView classes to add rules
    // only when LiveView classes are applied, for example:
    //
    //     <div class="phx-click-loading:animate-ping">
    //
    plugin(({addVariant}) => addVariant("phx-no-feedback", [".phx-no-feedback&", ".phx-no-feedback &"])),
    plugin(({addVariant}) => addVariant("phx-click-loading", [".phx-click-loading&", ".phx-click-loading &"])),
    plugin(({addVariant}) => addVariant("phx-submit-loading", [".phx-submit-loading&", ".phx-submit-loading &"])),
    plugin(({addVariant}) => addVariant("phx-change-loading", [".phx-change-loading&", ".phx-change-loading &"])),

    // Embeds Heroicons (https://heroicons.com) into your app.css bundle
    // See your `CoreComponents.icon/1` for more information.
    //
    plugin(function({matchComponents, theme}) {
      let iconsDir = path.join(__dirname, "../deps/heroicons/optimized")
      let values = {}
      let icons = [
        ["outline", "/24/outline"],
        ["solid", "/24/solid"],
        ["mini", "/20/solid"],
        ["micro", "/16/solid"]
      ]
      icons.forEach(([variant, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).forEach(file => {
          let name = path.basename(file, ".svg")
          values[`${variant}-${name}`] = {name, variant, dir}
        })
      })
      matchComponents({
        "hero": ({name, variant, dir}) => {
          let svg = fs.readFileSync(path.join(iconsDir, `${dir}/${name}.svg`), "utf8")
          // This allows the SVG content to be embedded in the CSS
          return {
            [`--hero-${variant}-${name}`]: `url('data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}')`,
            "-webkit-mask": `var(--hero-${variant}-${name})`,
            "mask": `var(--hero-${variant}-${name})`,
            "mask-repeat": "no-repeat",
            "background-color": "currentColor",
            "vertical-align": "middle",
            "display": "inline-block",
            "width": theme("spacing.5"),
            "height": theme("spacing.5")
          }
        }
      }, {values})
    })
  ]
}