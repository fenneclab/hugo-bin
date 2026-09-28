export default [
  {
    space: 2,
    rules: {
      '@stylistic/comma-dangle': [
        'error',
        'never'
      ],
      '@stylistic/curly-newline': [
        'error',
        {
          consistent: true
        }
      ],
      '@stylistic/object-curly-spacing': [
        'error',
        'always'
      ],
      '@stylistic/operator-linebreak': [
        'error',
        'after'
      ],
      '@stylistic/space-before-function-paren': [
        'error',
        'never'
      ],
      'arrow-body-style': 'off',
      camelcase: [
        'error',
        {
          properties: 'never'
        }
      ],
      'capitalized-comments': 'off',
      curly: [
        'error',
        'multi-line'
      ],
      'prefer-template': 'error',
      'require-unicode-regexp': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off'
    }
  },
  {
    files: ['package.json'],
    rules: {
      'package-json/consistent-path-prefix': 'off',
      'package-json/no-install-scripts': 'off',
      'package-json/no-redundant-files': 'off',
      'package-json/prefer-shorthand': 'off',
      'package-json/prefer-side-effects-field': 'off',
      'package-json/sort-files': 'off',
      'package-json/sort-properties': 'off'
    }
  }
];
