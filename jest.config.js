module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        // In order to load the PDF document in node, we use the ES5 build
        'pdfjs-dist': '<rootDir>/node_modules/pdfjs-dist/legacy/build/pdf',
    },
    setupFilesAfterEnv: ['<rootDir>/configs/setupTests.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: true,
};
