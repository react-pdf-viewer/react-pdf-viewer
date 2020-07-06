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
        extensions: ['.css', '.js', '.jsx', '.ts', '.tsx']
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
        // Indicate the package source based on the name
        // So we don't have to map them manually in the `alias` option as 
        //  alias: {
        //      '@phuocng/rpv/cjs/rpv.css': path.join(__dirname, '../../packages/rpv/npm/cjs/rpv.css'),
        //      '@phuocng/rpv': path.join(__dirname, '../../packages/rpv/src'),
        //      ...
        //  }
        new webpack.NormalModuleReplacementPlugin(
            // The pattern covers the package and its CSS
            // @phuocng/rpv
            // @phuocng/rpv/cjs/rpv.css
            /^@phuocng\/rpv[a-z-]*[\/cjs\/a-z-\.css]*$/,
            resource => {
                const request = resource.request;
                const pkgName = request.split('/')[1];
                resource.request = request.endsWith('.css')
                    ? path.join(__dirname, `../../packages/${pkgName}/npm/cjs/${pkgName}.css`)
                    : path.join(__dirname, `../../packages/${pkgName}/src`)
            }
        ),
    ],
};
