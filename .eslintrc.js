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
          { target: './src/domain', from: './src/use-cases' },
          { target: './src/domain', from: './src/interface-adapters' },
          { target: './src/domain', from: './src/infra' },

          { target: './src/use-cases', from: './src/interface-adapters' },
          { target: './src/use-cases', from: './src/infra' },

          { target: './src/interface-adapters', from: './src/infra' },
        ],
      },
    ],
  },
  env: {
    node: true,
  },
};
