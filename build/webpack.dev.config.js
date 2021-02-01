const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // production|development
    entry: "./src/demo.ts",
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "demo.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../example/index.html')
        })
    ],
    devServer: {
        port: 3000
    }
}