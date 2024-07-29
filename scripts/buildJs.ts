type PackageJson = {
    dependencies: Record<string, string>;
    name: string;
    peerDependencies: Record<string, string>;
};

import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { createGenerateScopedName } from 'hash-css-selector';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
    rollup,
    type OutputOptions,
    type RollupOptions,
    type RollupOutput,
    type WarningHandlerWithDefault,
} from 'rollup';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';

const generateTypes = (rootPackagePath: string) => {
    exec(`tsc --project ${path.join(rootPackagePath, 'tsconfig.build.json')}`);
};

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
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
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
                    extract: `${packageName}.css`,
                    modules: {
                        // By default, all CSS classes are prefixed with `m-`
                        generateScopedName: createGenerateScopedName('rpv'),
                    },
                }),
                copy({
                    // Copy file synchronously, so it can be removed by using the `del` plugin
                    copySync: true,
                    hook: 'writeBundle',
                    targets: [
                        {
                            src: path.join(outputDir, `cjs/${packageName}.css`),
                            dest: path.join(outputDir, 'styles'),
                        },
                        {
                            src: path.join(outputDir, `cjs/${packageName}.css`),
                            dest: path.join(outputDir, 'styles'),
                            rename: 'index.css',
                        },
                    ],
                }),
                del({
                    hook: 'writeBundle',
                    targets: path.join(outputDir, `cjs/${packageName}.css`),
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
                    extract: `${packageName}.min.css`,
                    minimize: true,
                    modules: {
                        // By default, all CSS classes are prefixed with `m-`
                        generateScopedName: createGenerateScopedName('rpv'),
                    },
                }),
                copy({
                    copySync: true,
                    hook: 'writeBundle',
                    targets: [
                        {
                            src: path.join(outputDir, `cjs/${packageName}.min.css`),
                            dest: path.join(outputDir, 'styles'),
                        },
                        {
                            src: path.join(outputDir, `cjs/${packageName}.min.css`),
                            dest: path.join(outputDir, 'styles'),
                            rename: 'index.min.css',
                        },
                    ],
                }),
                del({
                    hook: 'writeBundle',
                    targets: path.join(outputDir, `cjs/${packageName}.min.css`),
                }),
                terser(),
            ],
            onwarn: handleOnWarn,
        },
    ];

    // Generate Typescript definitions
    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir);
    fs.copyFileSync(path.join(rootPackagePath, 'dist/index.js'), path.join(rootPackagePath, 'lib/index.js'));

    generateTypes(rootPackagePath);

    // Compile
    return Promise.all(
        rollupOptions.map((rollupOption) => {
            new Promise<RollupOutput>((resolveBuild) => {
                rollup(rollupOption).then((build) => {
                    build.write(rollupOption.output as OutputOptions).then((out) => {
                        resolveBuild(out);
                    });
                });
            });
        }),
    );
};

(async () => {
    const rootPackagePath = process.cwd();
    buildPackage(rootPackagePath);
})();
