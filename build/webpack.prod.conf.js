/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const utils = require('./utils');

let webpackConfig = merge(baseConfig, {
    module: {
        rules: utils.getStyleLoaders()
    },
    output: {
        filename: 'static/js/[name].[chunkhash].js'
        // chunkFilename: 'js/[id].[chunkhash].js'
    },
    plugins: [
        // http://vue-loader.vuejs.org/en/workflow/production.html
        // The DefinePlugin allows you to create global constants which can be configured at compile time.
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                BUG_SNAG_API_KEY: JSON.stringify(process.env.BUG_SNAG_API_KEY),
                AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID),
                AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN)
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),

        // extract css into its own file
        new ExtractTextPlugin(path.join('static', 'css', '[name].[contenthash].css')),

        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'test' ? 'index.html' :  path.resolve(__dirname, '../dist/index.html'),
            template: path.join(__dirname, '../server/views/index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),

        // split vendor js into its own file
        // prevents hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
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
    // add sourcemaps to production build
    devtool: '#source-map'
});


// if (config.build.productionGzip) {
//     var CompressionWebpackPlugin = require('compression-webpack-plugin')
//
//     webpackConfig.plugins.push(
//         new CompressionWebpackPlugin({
//             asset: '[path].gz[query]',
//             algorithm: 'gzip',
//             test: new RegExp('\\.(js|css)$'),
//             threshold: 10240,
//             minRatio: 0.8
//         })
//     )
// }
//
// if (config.build.bundleAnalyzerReport) {
//     var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//     webpackConfig.plugins.push(new BundleAnalyzerPlugin())
// }


module.exports = webpackConfig;
