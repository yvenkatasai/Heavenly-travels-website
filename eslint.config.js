import js from '@eslint/js';
import globals from 'globals';

// Keep the configuration minimal: catch real mistakes, leave style to Prettier.
export default [
  {
    ignores: [
      'dist/**',
      'artifacts/**',
      'node_modules/**',
      'tests/browser/evidence/**',
      'coverage/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,mjs}', 'scripts/**/*.{js,mjs}', 'tests/**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2024,
      // Site scripts and tests mix browser and Node APIs; declaring both keeps the
      // configuration small while still catching genuinely undefined names.
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
    },
  },
  {
    // data.js and tours.js define constants consumed by app.js after the build concatenates them,
    // so "unused" assignments there are the interface between the files.
    files: ['src/site/data.js', 'src/site/tours.js'],
    languageOptions: {
      globals: {
        STOPS: 'writable',
        ROUTES: 'writable',
        VEHICLES: 'writable',
        TOUR_IMAGES: 'writable',
        PHOTO_POOL: 'writable',
        tours: 'writable',
      },
    },
    rules: { 'no-unused-vars': 'off' },
  },
  {
    files: ['src/site/app.js'],
    languageOptions: {
      globals: {
        STOPS: 'readonly',
        ROUTES: 'readonly',
        VEHICLES: 'readonly',
        TOUR_IMAGES: 'readonly',
        PHOTO_POOL: 'readonly',
        tours: 'readonly',
      },
    },
  },
];
