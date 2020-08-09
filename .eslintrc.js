module.exports = {
  root: true,
  extends: [
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          { target: './domain', from: './use-cases' },
          { target: './domain', from: './interface-adapters' },
          { target: './domain', from: './infra' },

          { target: './use-cases', from: './interface-adapters' },
          { target: './use-cases', from: './infra' },

          { target: './interface-adapters', from: './infra' },
        ],
      },
    ],
  },
  env: {
    node: true,
  },
};
