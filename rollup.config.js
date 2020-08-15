import path from 'path';
import less from 'rollup-plugin-less-modules';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const rootPackagePath = process.cwd();
const input = path.join(rootPackagePath, 'src/index.ts');
const pkg = require(path.join(rootPackagePath, 'package.json'));

const outputDir = path.join(rootPackagePath, 'npm');
const pgkName = pkg.name.split('/').pop();

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
];

const noBundleCss = process.env.NO_CSS === 'true';

const plugins = [
    json(),
    typescript(),
].concat(noBundleCss ? [] : [
    less({
        output: path.join(outputDir, 'styles.css'),
        sourcemap: false,
    }),
]);

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
        plugins: plugins.concat([
            terser(),
        ]),
    }
];
