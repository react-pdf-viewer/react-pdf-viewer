import less from 'rollup-plugin-less-modules';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
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
            file: './npm/cjs/rpv-selection-mode.js',
            format: 'cjs',
        },
        external,
        plugins: [
            json(),
            less({
                output: './npm/cjs/rpv-selection-mode.css',
                sourcemap: false,
            }),
            typescript(),
        ],
    },

    // Minified CJS
    {
        input,
        output: {
            file: './npm/cjs/rpv-selection-mode.min.js',
            format: 'cjs',
        },
        external,
        plugins: [
            json(),
            less({
                output: './npm/cjs/rpv-selection-mode.css',
                sourcemap: false,
            }),
            typescript(),
            terser(),
        ],
    }
];
