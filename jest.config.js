module.exports = {
    testEnvironment: 'jsdom',
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
