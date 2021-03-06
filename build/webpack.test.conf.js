// This is the webpack config used for unit tests.
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var utils = require('./utils')

var webpackConfig = merge(baseConfig, {
    module: {
        rules: utils.getStyleLoaders()
    },
    // devtool: '#inline-source-map',
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        // The DefinePlugin allows you to create global constants which can be configured at compile time.
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"test"'
            }
        }),
    ]
})

//test for sass
webpackConfig.module.rules.push({
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: 'style!css!sass'
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig
