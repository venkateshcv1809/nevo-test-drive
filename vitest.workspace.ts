export default [
    '**/vite.config.{mjs,js,ts,mts}',
    '**/vitest.config.{mjs,js,ts,mts}',
    
    '**/apps/*/vite.config.{mjs,js,ts,mts}',
    '**/libs/*/vite.config.{mjs,js,ts,mts}',
    
    '**/*.test.{ts,tsx,js,jsx}',
    '**/*.spec.{ts,tsx,js,jsx}',
    
    'vitest.config.ts',
    'vitest.workspace.ts',
    
    '!**/dist/**',
    '!**/node_modules/**',
];