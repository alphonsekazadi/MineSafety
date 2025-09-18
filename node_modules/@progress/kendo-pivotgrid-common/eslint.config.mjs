import tseslint from 'typescript-eslint';

export default tseslint.config(
  tseslint.configs.base,
  {
    files: ["src/**/*.ts"],
    rules: {
      "semi": ["error", "always"],
      "no-console": "error",
      "no-debugger": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "comma-dangle": ["error", "never"],
      "no-multi-spaces": "error",
      "space-before-function-paren": ["error", "never"],
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "eol-last": "error",
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "no-var": "error",
      "prefer-const": "error",
      "no-empty": "error",
      "no-unreachable": "error",
      "no-compare-neg-zero": "error",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-extra-semi": "error",
      "no-useless-concat": "error",
      "no-unsafe-negation": "error",
      "no-unused-expressions": "error",
      "no-useless-return": "error",
      "no-empty-function": "warn",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-this-before-super": "error",
      "prefer-promise-reject-errors": "error",
      "rest-spread-spacing": ["error", "never"],
      "template-curly-spacing": ["error", "never"],
      "yield-star-spacing": ["error", "both"],
      "arrow-spacing": ["error", { "before": true, "after": true }],
      "no-duplicate-imports": "error",
      "no-restricted-imports": "off",
      "import/order": "off"
    }
  }
);
