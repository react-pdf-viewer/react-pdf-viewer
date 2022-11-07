const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const path = require('path');

const rootPackagePath = process.cwd();
const input = path.join(rootPackagePath, 'src/index.ts');
const pkg = require(path.join(rootPackagePath, 'package.json'));

const outputDir = path.join(rootPackagePath, 'lib');
const pgkName = pkg.name.split('/').pop();

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const plugins = [json(), typescript()];

module.exports = [
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
