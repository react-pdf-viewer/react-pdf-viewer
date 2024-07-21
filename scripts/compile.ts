type PackageJson = {
    dependencies: Record<string, string>;
    name: string;
    peerDependencies: Record<string, string>;
}

import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'rollup-plugin-postcss';
import { rollup, type RollupOptions } from 'rollup';

const rootPackagePath = process.cwd();
const input = path.join(rootPackagePath, 'src/index.ts');
const packageContent = fs.readFileSync(path.join(rootPackagePath, 'package.json'), { encoding: 'utf8' });
const packageJson = JSON.parse(packageContent) as unknown as PackageJson;

const outputDir = path.join(rootPackagePath, 'lib');
const packageName = packageJson.name.split('/').pop();

const external = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
];

const plugins = [
    json(),
    // Inject CSS modules
    postcss({
        //extract: true,
        modules: true,
    }),
    typescript({
        include: path.join(rootPackagePath, "../../@types"),
        //noEmitOnError: true,
        tsconfig: path.join(rootPackagePath, 'tsconfig.json'),
    }),
];

const rollupOptions: RollupOptions = {
    input,
    output: [
        {
            exports: 'named',
            file: path.join(outputDir, `cjs/${packageName}.js`),
            format: 'cjs',
        },
        {
            exports: 'named',
            file: path.join(outputDir, `cjs/${packageName}.min.js`),
            format: 'cjs',
            plugins: plugins.concat([terser()]),
        },
    ],
    external,
    plugins,
};

// Compile
rollup(rollupOptions);
