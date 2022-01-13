module.exports = {
    preset: 'jest-puppeteer',
    // Uncomment the `testMatch` option when we want to run a specific test case
    testMatch: ['<rootDir>/packages/default-layout/__tests__/scrollMode.e2e.ts'],
    // testRegex: ['(/__tests__/.*|(\\.|/)(e2e))\\.ts$'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: true,
};
