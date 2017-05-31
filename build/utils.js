let ExtractTextPlugin = require('extract-text-webpack-plugin')


function getLoaderConfig(loader, loaderOptions) {
    let isProd = process.env.NODE_ENV === 'production';

    var loaders = [{
        loader: 'css-loader',
        options: {
            minimize: isProd,
            sourceMap: isProd
        }
    }];

    if (loader) {
        loaders.push({
            loader: `${loader}-loader`,
            options: Object.assign({}, loaderOptions, {
                sourceMap: isProd
            })
        })
    }

    // Extract CSS to separate file for production builds
    if (isProd) {
        return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
        })
    }

    return ['vue-style-loader'].concat(loaders)
}


exports.getCssLoaders = () => {
    return {
        css: getLoaderConfig(),
        postcss: getLoaderConfig(),
        sass: getLoaderConfig('sass', {indentedSyntax: false}),
        scss: getLoaderConfig('sass')
    }
};


exports.getStyleLoaders = () => {
    let output = [];
    let loaders = exports.getCssLoaders();

    Object.keys(loaders).forEach((key) => {
        output.push({
            test: new RegExp(`\\.${key}$`),
            use: loaders[key]
        })
    });

    return output;
};