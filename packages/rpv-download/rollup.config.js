import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const pkg = require('./package.json');

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
];

const input = './src/index.ts';
const typescriptOptions = {
    removeComments: true,
    module: 'es6',
    target: 'es5',
    jsx: 'react',
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    moduleResolution: 'node',
};

export default [
    // CJS
    {
        input,
        output: {
            file: './npm/cjs/rpv-download.js',
            format: 'cjs',
        },
        external,
        plugins: [
            typescript(typescriptOptions),
        ],
    },

    // Minified CJS
    {
        input,
        output: {
            file: './npm/cjs/rpv-download.min.js',
            format: 'cjs',
        },
        external,
        plugins: [
            typescript(typescriptOptions),
            terser(),
        ],
    }
];
