import less from 'rollup-plugin-less';
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
            // css({
            //     output: './dist/cjs/react-pdf-viewer.css',
            // }),
            less({
                output: './dist/cjs/react-pdf-viewer.css',
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
