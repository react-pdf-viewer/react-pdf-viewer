const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    },
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.css', '.js', '.jsx', '.ts', '.tsx'],
        // In development mode that maps `react-pdf-viewer` packages with `../packages/PACKAGE_NAME/src`
        // we have to indicate the `react` path
        // Otherwise, we will see "Invalid hook call" error
        alias: {
            "react": path.join(__dirname, '../node_modules/react')
        },
        fallback: {
            // To make `@axe-core/react` work
            crypto: false,
        }
    },
    devServer: {
        // Allow us to access the demo from the IP address
        // `http://IP_ADDRESS:8001`, `http://localhost:8001` work
        host: '0.0.0.0',
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        port: 8001,
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            ignoreOrder: false,
        }),

        // If you want to see the signature which is disabled by pdf.js, then you have to replace it
        // with `@react-pdf-viewer/pdfjs-dist-signature`
        /*
        new webpack.NormalModuleReplacementPlugin(
            /^pdfjs-dist$/,
            resource => {
                resource.request = path.join(__dirname, '../node_modules/@react-pdf-viewer/pdfjs-dist-signature');
            },
        ),
        */
        
        // Indicate the package source based on the name
        // So we don't have to map them manually in the `alias` option as 
        //  alias: {
        //      '@react-pdf-viewer/core/lib/styles.css': path.join(__dirname, '../packages/core/lib/styles.css'),
        //      '@react-pdf-viewer/core': path.join(__dirname, '../packages/core/src'),
        //      ...
        //  }
        new webpack.NormalModuleReplacementPlugin(
            // The pattern covers the package and its CSS
            // @react-pdf-viewer/core
            // @react-pdf-viewer/core/lib/styles/index.css
            /^@react-pdf-viewer\/[a-z-]+[\/styles]*[\/index.(css)]*$/,
            resource => {
                const request = resource.request;
                const pkgName = request.split('/')[1];

                switch (true) {
                    case request.endsWith('.css'):
                        resource.request = path.join(__dirname, `../packages/${pkgName}/lib/styles/index.css`);
                        break;

                    // case request.endsWith('.less'):
                    //     resource.request = path.join(__dirname, `../packages/${pkgName}/lib/styles/index.less`);
                    //     break;

                    default:
                        resource.request = path.join(__dirname, `../packages/${pkgName}/src`);
                        break;
                }
            }
        ),
    ],
};
