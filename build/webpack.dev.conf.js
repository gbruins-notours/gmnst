/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base.conf');
const utils = require('./utils');


let webpackConfig = merge(baseConfig, {
    entry: {
        app: ['webpack-hot-middleware/client', path.resolve(__dirname, '../src/entry-client.js')]
    },
    module: {
        rules: utils.getStyleLoaders()
    },
    plugins: [
        // http://vue-loader.vuejs.org/en/workflow/production.html
        // The DefinePlugin allows you to create global constants which can be configured at compile time.
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),

        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),

        new webpack.NoEmitOnErrorsPlugin(),

        new FriendlyErrorsPlugin(),

        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: path.join(__dirname, '../server/views/index.html'),
            inject: true
        }),

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../server/views'),
                to: 'views',
                ignore: ['index.html']
            }
        ])
    ],
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map'
});

module.exports = webpackConfig;
