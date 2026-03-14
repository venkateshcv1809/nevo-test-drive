import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

export default async (): Promise<Config> => ({
    projects: await getJestProjectsAsync(),

    testTimeout: 10000,
    verbose: true,

    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    testEnvironment: 'jsdom',

    maxWorkers: '50%',
    cacheDirectory: '<rootDir>/.jest-cache',
});
