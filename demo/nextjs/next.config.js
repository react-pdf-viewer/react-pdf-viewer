const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    reactStrictMode: true,
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
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
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
