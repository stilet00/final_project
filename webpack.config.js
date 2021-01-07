const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "production",
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
                use: ['style-loader', 'css-loader']

            }
        ]
    },

    entry: "/scripts/script.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "index.html"
        })
    ]
}