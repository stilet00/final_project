const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "production",
    entry: "/scripts/script.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), new TerserPlugin()
        ]
    },
    plugins: [
        new MiniCssExtractPlugin( {
            filename: "/styles/style.css"
        }),
        new HTMLWebpackPlugin({
            template: "index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']

            }
        ]
    }
}