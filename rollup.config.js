import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const input = './src/index.ts';

const excludeAllExternals = id => !id.startsWith('.') && !id.startsWith('/');

export default [
    {
        input,
        output: {
            file: './dist/cjs/react-pdf-viewer.js',
            format: 'cjs',
        },
        // external: excludeAllExternals,
        external: ['pdfjs-dist', 'react', 'react-dom'],
        plugins: [
            json(),
            css({
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
    }
];
