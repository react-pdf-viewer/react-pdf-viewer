module.exports = {
    moduleNameMapper: {
        // In order to load the PDF document in node, we use the ES5 build 
        'pdfjs-dist': '<rootDir>/node_modules/pdfjs-dist/es5/build/pdf',
        'file:///assets/(.*)': [
            'file:///<rootDir>/assets/$1',
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
