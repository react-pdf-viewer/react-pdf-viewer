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
import { rollup, type OutputOptions, type RollupOptions, type RollupOutput, type WarningHandlerWithDefault } from 'rollup';
import copy from 'rollup-plugin-copy';
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
    const handleOnWarn: WarningHandlerWithDefault = (warning, warn) => {
        // Ignore the warning shown when the `use client` directive is used at the top of files
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
        }
        warn(warning);
    };

    const rollupOptions: RollupOptions[] = [
        {
            input,
            output: {
                exports: 'named',
                file: path.join(outputDir, `cjs/${packageName}.js`),
                format: 'cjs',
            },
            external,
            plugins: [
                json(),
                esbuild({
                    sourceMap: false,
                    tsconfig: path.join(rootPackagePath, 'tsconfig.json'),
                }),
                postcss({
                    extract: 'index.css',
                    modules: {
                        // By default, all CSS classes are prefixed with `m-`
                        generateScopedName: createGenerateScopedName('rpv'),
                    },
                }),
                copy({
                    targets: [{
                        src: path.join(outputDir, 'cjs/index.css'),
                        dest: path.join(outputDir, 'styles'),
                    }],
                    verbose: true,
                    hook: 'writeBundle',
                }),
            ],
            onwarn: handleOnWarn,
        },
        {
            input,
            output: {
                exports: 'named',
                file: path.join(outputDir, `cjs/${packageName}.min.js`),
                format: 'cjs',
            },
            external,
            plugins: [
                json(),
                esbuild({
                    sourceMap: false,
                    tsconfig: path.join(rootPackagePath, 'tsconfig.json'),
                }),
                postcss({
                    extract: 'index.min.css',
                    minimize: true,
                    modules: {
                        // By default, all CSS classes are prefixed with `m-`
                        generateScopedName: createGenerateScopedName('rpv'),
                    },
                }),
                copy({
                    targets: [{
                        src: path.join(outputDir, 'cjs/index.min.css'),
                        dest: path.join(outputDir, 'styles'),
                    }],
                    verbose: true,
                    hook: 'writeBundle',
                }),
                terser(),
            ],
            onwarn: handleOnWarn,
        },
    ];

    // Compile
    return Promise.all(
        rollupOptions.map((rollupOption) => {
            new Promise<RollupOutput>((resolve) => {
                rollup(rollupOption).then((build) => {
                    build.write(rollupOption.output as OutputOptions).then((out) => {
                        resolve(out);
                    });
                })
            });
        })
    );
};

(async () => {
    buildPackage(process.cwd());
})();
