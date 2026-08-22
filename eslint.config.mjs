import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Light-only site: there is no dark palette, so a `dark:` utility can only
  // half-theme a page. The `dark` variant is also neutralised in globals.css;
  // this rule catches the mistake at author time instead of at runtime.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/(^| )dark:/]",
          message:
            "This site has no dark theme — `dark:` utilities are inert (see the light-only theme lock in globals.css). Use the light tokens instead.",
        },
        {
          selector: "TemplateElement[value.raw=/(^| )dark:/]",
          message:
            "This site has no dark theme — `dark:` utilities are inert (see the light-only theme lock in globals.css). Use the light tokens instead.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
