module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.base.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'off',
    'no-bitwise': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    'max-len': 'off',

    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: '.',
        // Files with scripts/modules that will be use only in development
        devDependencies: ['test/*', 'jest*', 'configs/**/*', 'tools/**/*'],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['index', 'internal', 'object'], ['sibling', 'parent']],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        warnOnUnassignedImports: false,
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
