import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwind from "eslint-plugin-better-tailwindcss";
import prettierConfig from "eslint-config-prettier/flat";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
const __dirname = path.dirname(__filename); // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment

export default tseslint.config(
	{
		name: "money-decision/base",
		ignores: ["dist/**", "node_modules/**", ".eslintrc.json"],
	},

	js.configs.recommended,

	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,

	{
		name: "money-decision/language-options",
		languageOptions: {
			parserOptions: {
				projectService: {
					 
					allowDefaultProject: ["eslint.config.js", "tailwind.config.js", "postcss.config.js"],
				},
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				tsconfigRootDir: __dirname,
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				console: "off",
				window: "readonly",
				document: "readonly",
				module: "readonly",
				require: "readonly",
				process: "readonly",
				setTimeout: "readonly",
				setInterval: "readonly",
				fetch: "readonly",
				FormData: "readonly",
				URL: "readonly",
				URLSearchParams: "readonly",
				AbortController: "readonly",
			},
		},
	},

	{
		name: "money-decision/react",
		plugins: {
			react,
		},
		settings: {
			react: {
				version: "18.2",
			},
		},
		rules: {
			"react/display-name": "warn",
			"react/no-unknown-property": ["error", { ignore: ["css"] }],
			"react/jsx-no-leaked-render": ["warn", { validStrategies: ["ternary", "coerce"] }],
			"react/no-unused-prop-types": "warn",
			"react/prop-types": "off",
		},
	},

	{
		name: "money-decision/react-hooks",
		plugins: {
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
		},
	},

	{
		name: "money-decision/react-refresh",
		plugins: {
			"react-refresh": reactRefresh,
		},
		rules: {
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		},
	},

	{
		name: "money-decision/tailwindcss",
		plugins: {
			tailwind,
		},
		settings: {
			tailwindcss: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
				tailwindConfig: path.join(__dirname, "tailwind.config.js"),
			},
		},
		rules: {
			"tailwind/enforce-consistent-class-order": ["warn", { order: "official" }],
			"tailwind/no-conflicting-classes": "error",
		},
	},

	{
		name: "money-decision/custom-rules",
		rules: {
			"no-nested-ternary": "error",
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"prefer-const": "error",
			"eqeqeq": ["error", "always", { null: "ignore" }],
			"max-depth": ["warn", 4],
			"max-params": ["warn", 4],
			complexity: ["warn", 15],
		},
	},

	prettierConfig
);
