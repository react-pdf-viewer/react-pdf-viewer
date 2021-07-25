module.exports = {
    testEnvironment: 'jsdom',
    // Uncomment the `testMatch` option when we want to run a specific test case
    // testMatch: [
    //     '<rootDir>/packages/core/__tests__/changeFileUrl.test.tsx',
    // ],
    moduleNameMapper: {
        // In order to load the PDF document in node, we use the ES5 build
        // For pdfjs-dist 2.7.570+
        // 'pdfjs-dist': '<rootDir>/node_modules/pdfjs-dist/legacy/build/pdf',
        // For pdfjs-dist 2.6.347
        'pdfjs-dist': '<rootDir>/node_modules/pdfjs-dist/es5/build/pdf',
    },
    setupFilesAfterEnv: ['<rootDir>/configs/setupTests.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: true,
};
