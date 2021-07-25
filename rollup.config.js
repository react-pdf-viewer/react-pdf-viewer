import path from 'path';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const rootPackagePath = process.cwd();
const input = path.join(rootPackagePath, 'src/index.ts');
const pkg = require(path.join(rootPackagePath, 'package.json'));

const outputDir = path.join(rootPackagePath, 'lib');
const pgkName = pkg.name.split('/').pop();

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const plugins = [json(), typescript()];

export default [
    // CJS
    {
        input,
        output: {
            exports: 'named',
            file: path.join(outputDir, `cjs/${pgkName}.js`),
            format: 'cjs',
        },
        external,
        plugins,
    },

    // Minified CJS
    {
        input,
        output: {
            exports: 'named',
            file: path.join(outputDir, `cjs/${pgkName}.min.js`),
            format: 'cjs',
        },
        external,
        plugins: plugins.concat([terser()]),
    },
];
