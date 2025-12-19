import globals from "globals";

export default [
  {
    ignores: [
      "vendor/**",
      "*.d.ts",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es6,
      },
    },
    rules: {
      "brace-style": "error",

      camelcase: ["error", {
          properties: "never",
          ignoreDestructuring: true,
      }],

      "comma-dangle": ["error", {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "never",
      }],
      "comma-spacing": "error",
      "comma-style": "error",
      curly: ["error", "multi-line"],
      "func-call-spacing": "error",

      "no-multiple-empty-lines": ["error", {
          max: 1,
      }],

      "no-tabs": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],

      "one-var": ["error", {
          var: "never",
          let: "never",
          const: "never",
      }],

      "operator-linebreak": ["error", "after", { overrides: { "?": "before", ":": "before" } }],
      "padded-blocks": ["error", "never"],
      "quote-props": ["error", "as-needed"],

      quotes: ["error", "double", {
          avoidEscape: true,
          allowTemplateLiterals: true,
      }],

      semi: "error",
      "semi-spacing": "error",
      "space-before-blocks": "error",

      "space-before-function-paren": ["error", {
          named: "never",
          anonymous: "always",
          asyncArrow: "always",
      }],

      "spaced-comment": ["error", "always", {
          line: {
              markers: ["/"],
              exceptions: ["-", "+"],
          },

          block: {
              markers: ["!"],
              exceptions: ["*"],
              balanced: true,
          },
      }],

      "template-tag-spacing": ["error", "never"],

      "arrow-parens": ["error", "always"],

      "arrow-spacing": ["error", {
          before: true,
          after: true,
      }],

      "no-confusing-arrow": ["error", {
          allowParens: true,
      }],

      "no-var": "error",

      "prefer-const": ["error", {
          destructuring: "any",
          ignoreReadBeforeAssign: true,
      }],

      "prefer-destructuring": ["error", {
          VariableDeclarator: {
              array: false,
              object: true,
          },

          AssignmentExpression: {
              array: true,
              object: false,
          },
      }],

      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "template-curly-spacing": "error",
    },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
];
