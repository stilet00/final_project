const path = require('path')
module.exports = {
    context: path.join(__dirname),
    mode: "development",
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
            }
        ]
    },
    entry: "/src/scripts/script.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    }
}