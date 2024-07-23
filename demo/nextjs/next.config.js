const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    reactStrictMode: true,
    transpilePackages: [
        "@react-pdf-viewer/attachment",
        "@react-pdf-viewer/bookmark",
        "@react-pdf-viewer/core",
        "@react-pdf-viewer/default-layout",
        "@react-pdf-viewer/drop",
        "@react-pdf-viewer/full-screen",
        "@react-pdf-viewer/get-file",
        "@react-pdf-viewer/highlight",
        "@react-pdf-viewer/locale-switcher",
        "@react-pdf-viewer/open",
        "@react-pdf-viewer/page-navigation",
        "@react-pdf-viewer/print",
        "@react-pdf-viewer/properties",
        "@react-pdf-viewer/rotate",
        "@react-pdf-viewer/scroll-mode",
        "@react-pdf-viewer/search",
        "@react-pdf-viewer/selection-mode",
        "@react-pdf-viewer/theme",
        "@react-pdf-viewer/thumbnail",
        "@react-pdf-viewer/toolbar",
        "@react-pdf-viewer/zoom",
    ],
    async rewrites() {
        return [
            {
                source: '/ignore/:document\\.pdf',
                destination: '/api/doc/ignore/:document',
            },
            {
                source: '/:document\\.pdf',
                destination: '/api/doc/:document',
            },
        ];
    },
    webpack: (config) => {
        const rootDir = path.join(__dirname, '../..');

        // We need it because we use the local development version of `@react-pdf-viewer/xxx`
        // Otherwise, we will see "Invalid hook call" error
        config.resolve.alias['react'] = path.join(rootDir, 'node_modules/react');

        // Be able to compile TypeScript files
        config.module.rules.push({
            test: /\.ts(x?)$/,
            include: [path.join(rootDir, 'packages')],
            exclude: /node_modules/,
            use: ['ts-loader'],
        });

        config.externals.push({
            canvas: 'canvas',
        });

        // Copy pdfjs worker to `public`
        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.join(rootDir, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
                        to: path.join(__dirname, 'public'),
                    },
                ],
            }),
        );

        return config;
    },
};
