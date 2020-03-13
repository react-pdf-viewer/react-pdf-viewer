import less from 'rollup-plugin-less-modules';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const input = './src/index.ts';

export default [
    // CJS
    {
        input,
        output: {
            file: './dist/cjs/react-pdf-viewer.js',
            format: 'cjs',
        },
        external: ['pdfjs-dist', 'react', 'react-dom'],
        plugins: [
            json(),
            less({
                output: './dist/cjs/react-pdf-viewer.css',
                sourcemap: false,
            }),
            typescript({
                removeComments: true,
                module: 'es6',
                target: 'es5',
                jsx: 'react',
                allowSyntheticDefaultImports: true,
                resolveJsonModule: true,
                moduleResolution: 'node',
            }),
        ],
        watch: {
            include: 'src/**/*.*',
        },
    }
];
