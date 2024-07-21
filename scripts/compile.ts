type PackageJson = {
    dependencies: Record<string, string>;
    name: string;
    peerDependencies: Record<string, string>;
}

import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { createGenerateScopedName } from 'hash-css-selector';
import fs from 'node:fs';
import path from 'node:path';
import { rollup, type OutputOptions, type RollupOptions } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';

const buildPackage = async (rootPackagePath: string) => {
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
        esbuild({
            sourceMap: false,
            tsconfig: path.join(rootPackagePath, 'tsconfig.json'),
        }),
        // Inject CSS modules
        postcss({
            // extract: true,
            modules: {
                // By default, all CSS classes are prefixed with `m-`
                generateScopedName: createGenerateScopedName('rpv'),
            },
        }),
    ];

    const outputs: OutputOptions[] = [
        {
            exports: 'named',
            file: path.join(outputDir, `cjs/${packageName}.js`),
            format: 'cjs',
            plugins,
        },
        {
            exports: 'named',
            file: path.join(outputDir, `cjs/${packageName}.min.js`),
            format: 'cjs',
            plugins: plugins.concat([terser()]),
        },
    ];

    const rollupOptions: RollupOptions = {
        input,
        output: outputs,
        external,
        plugins,
        onwarn: (warning, warn) => {
            // Ignore the warning shown when the `use client` directive is used at the top of files
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
                return;
            }
            warn(warning);
        },
    };

    // Compile
    const build = await rollup(rollupOptions);
    return Promise.all(outputs.map((output) => build.write(output)));
};

(async () => {
    buildPackage(process.cwd());
})();
