module.exports = {
    preset: 'jest-puppeteer',
    // Uncomment the `testMatch` option when we want to run a specific test case
    // testMatch: ['<rootDir>/packages/search/__e2e__/jumpBetweenMatches.e2e.ts'],
    testRegex: ['(/__e2e__/.*|(\\.|/)(e2e))\\.ts$'],
    testTimeout: 20 * 1000, // 20s
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: true,
};
