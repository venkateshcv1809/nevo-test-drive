const nxPreset = require('@nx/jest/preset').default;

module.exports = {
    ...nxPreset,

    testEnvironment: 'jsdom',

    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@nevo/(.*)$': '<rootDir>/libs/$1/src/$1',
    },

    transformIgnorePatterns: ['node_modules/(?!(axios|@tanstack/react-query)/)'],
};
