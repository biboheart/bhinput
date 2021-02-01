const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./build/webpack.base.config');
const devWebpackConfig = require('./build/webpack.dev.config');
const prodWebpackConfig = require('./build/webpack.prod.config');

const isDev = process.env.NODE_ENV !== 'production';
let config = merge(baseWebpackConfig, isDev ? devWebpackConfig : prodWebpackConfig);
module.exports = config;
