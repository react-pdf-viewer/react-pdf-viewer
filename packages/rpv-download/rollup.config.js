import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const pkg = require('./package.json');

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
];

const input = './src/index.ts';

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
            typescript(),
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
            typescript(),
            terser(),
        ],
    }
];
