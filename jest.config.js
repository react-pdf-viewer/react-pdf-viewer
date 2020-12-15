module.exports = {
    moduleNameMapper: {
        // 'pdfjs-dist': '<rootDir>/node_modules/pdfjs-dist',
        'assets/(.*)': [
            '<rootDir>/assets/$1',
        ],
    },
    setupFilesAfterEnv: [
        '<rootDir>/configs/setupTests.ts',
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: true,
};
