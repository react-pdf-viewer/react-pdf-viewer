const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // We need it because we use the local development version of `@react-pdf-viewer/xxx`
        // Otherwise, we will see "Invalid hook call" error
        config.resolve.alias['react'] = path.join(__dirname, '../../node_modules/react');

        // Be able to compile TypeScript files
        const tsLoader = {
            test: /\.ts(x?)$/,
            include: [path.join(__dirname, '../../packages')],
            exclude: /node_modules/,
            use: ['ts-loader'],
        };
        config.module.rules.push(tsLoader);

        // Indicate the package source based on the name
        // So we don't have to map them manually in the `alias` option as
        //  alias: {
        //      '@react-pdf-viewer/core/lib/styles.css': path.join(__dirname, '../../packages/core/lib/styles.css'),
        //      '@react-pdf-viewer/core': path.join(__dirname, '../../packages/core/src'),
        //      ...
        //  }
        const mapPlugin = new webpack.NormalModuleReplacementPlugin(
            // The pattern covers the package and its CSS
            // @react-pdf-viewer/core
            // @react-pdf-viewer/core/lib/styles/index.css
            /^@react-pdf-viewer\/[a-z-]+[\/lib\/styles]*[\/index.(css)]*$/,
            (resource) => {
                const request = resource.request;
                const pkgName = request.split('/')[1];

                switch (true) {
                    case request.endsWith('.css'):
                        resource.request = path.join(__dirname, `../../packages/${pkgName}/src/styles/index.scss`);
                        break;

                    default:
                        resource.request = path.join(__dirname, `../../packages/${pkgName}/src`);
                        break;
                }
            }
        );
        config.externals.push({
            canvas: 'canvas',
        });
        config.plugins.push(mapPlugin);

        // Copy pdfjs worker to `public`
        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.join(__dirname, '../../node_modules/pdfjs-dist/build/pdf.worker.min.js'),
                        to: path.join(__dirname, 'public'),
                    },
                ],
            })
        );

        return config;
    },
};
