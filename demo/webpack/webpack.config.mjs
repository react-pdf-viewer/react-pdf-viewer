import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const rootDir = path.join(__dirname, '../..');

export default {
    entry: './src/index.tsx',
    output: {
        path: distDir,
        filename: '[name].[contenthash].js',
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
                use: ['babel-loader', 'ts-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: "[hash:base64]",
                                auto: true,
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            // We need it because we use the local development version of `@react-pdf-viewer/xxx`
            // Otherwise, we will see "Invalid hook call" error
            react: path.join(rootDir, 'node_modules/react'),
        },
    },
    devServer: {
        static: [
            {
                directory: distDir,
            },
            // Serve the local PDF documents
            {
                directory: path.join(rootDir, 'samples'),
            },
        ],
        historyApiFallback: true,
        host: '0.0.0.0',
        port: 8001,
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
            clean: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            ignoreOrder: false,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(rootDir, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
                    to: distDir,
                },
            ],
        }),
    ],
};
