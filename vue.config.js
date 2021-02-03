const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    publicPath: './',
    outputDir: 'docs',
    configureWebpack: {
        plugins: [new BundleAnalyzerPlugin()]
    },
    devServer: {
        disableHostCheck: true
    }
}