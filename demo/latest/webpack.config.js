const path = require('path');
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
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
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
        alias: {
            // When linking @phuoc-ng/react-pdf-viewer to the `dist` folder
            // Fix an issue of `Invalid hook call`
            // Webpack seems to duplicate 2 React versions
            // See https://github.com/phuoc-ng/react-pdf-viewer/commit/0cd175bfebfe1922d9c14c5d3309f9d1eff6213f
            react: path.resolve('./node_modules/react'),
            // CSS
            '@phuocng/rpv/cjs/react-pdf-viewer.css': path.join(__dirname, '../../packages/rpv/npm/cjs/react-pdf-viewer.css'),
            // Plugins
            '@phuocng/rpv': path.join(__dirname, '../../packages/rpv/src'),
            '@phuocng/rpv-current-page': path.join(__dirname, '../../packages/rpv-current-page/src'),
            '@phuocng/rpv-locale-switcher': path.join(__dirname, '../../packages/rpv-locale-switcher/src'),
            '@phuocng/rpv-next-page': path.join(__dirname, '../../packages/rpv-next-page/src'),
            '@phuocng/rpv-previous-page': path.join(__dirname, '../../packages/rpv-previous-page/src'),
            '@phuocng/rpv-toolbar': path.join(__dirname, '../../packages/rpv-toolbar/src'),
        },
    },
    devServer: {
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
    ],
};
