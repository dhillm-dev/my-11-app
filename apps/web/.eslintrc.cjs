module.exports = {
	root: true,
	env: { browser: true, es2022: true },
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:svelte/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: { ecmaVersion: 2022, sourceType: "module", extraFileExtensions: [".svelte"] },
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser"
			}
		}
	],
	ignorePatterns: ["build/**", ".svelte-kit/**", "dist/**", "node_modules/**", "_app/**", "**/immutable/**"],
	globals: { Temporal: "readonly" },
	rules: {
		"no-empty": "off",
		"no-self-assign": "error",
		"@typescript-eslint/no-explicit-any": ["warn", { "ignoreRestArgs": true }],
		"@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
		"svelte/no-at-html-tags": "error"
	}
};