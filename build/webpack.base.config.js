const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const postcss = {
    loader: 'postcss-loader',
    options: {
        plugins: [
            require('postcss-import'),
            require('autoprefixer'),
        ]
    }
}

let config = {
    mode: 'development', // production|development
    entry: ['@babel/polyfill/noConflict', './src/main.ts'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "index.js",
        library: [ 'BhInput' ],
        libraryTarget: 'umd',
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        modules: [path.join(__dirname, '../src'), 'node_modules'],
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                //loader: "awesome-typescript-loader",
                use: ["babel-loader", "ts-loader"],
                exclude: /node_modules/
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', postcss]
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', postcss, 'less-loader']
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', postcss, 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|mp4)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 20,
                    },
                },
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'default.css',
        }),
        new CleanWebpackPlugin()
    ]
}

module.exports = config;