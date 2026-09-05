import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored, third-party decoder — not ours to lint.
    "public/**",
  ]),
  {
    // The Three.js / React Three Fiber layer drives an imperative engine:
    // every frame it writes to engine objects (`camera`, animation actions)
    // and to mutable refs by design. The React-Compiler lint rules treat that
    // as a violation, so they're advisory (not build-breaking) in here.
    files: [
      "src/components/three/**/*.{ts,tsx}",
      "src/lib/three/**/*.{ts,tsx}",
      "src/hooks/useGalleryAudio.ts",
    ],
    rules: {
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);

export default eslintConfig;
