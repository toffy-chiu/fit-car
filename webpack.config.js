var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path=require('path');
var copy=require('./src/lib/copy');

// 生产环境
var isProd = process.env.NODE_ENV.trim() === 'production';

//copy static files
//css
copy('./src/css', './dist');
//images
copy('./src/img', './dist');

module.exports = {
    entry: {
        app: isProd?[
            './src/components/app'
        ]:[
            'webpack-dev-server/client?http://0.0.0.0:3000',
            'webpack/hot/only-dev-server',
            './src/components/app'
        ],
        vendor:[
            'react',
            'react-dom',
            'react-router',
            'amazeui-touch'
        ]
    },
    output: {
        publicPath:isProd ? './' : '/dist/', //给require.ensure用
        path: './dist', //js的发布路径
        filename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
        chunkFilename:isProd ? '[name].chunk.[chunkhash:8].js' : '[name].chunk.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, loader: 'react-hot/webpack!jsx?harmony', exclude:/node_modules/}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new ExtractTextPlugin(isProd ? '[name].[chunkhash:8].css' : '[name].css'),
        new HtmlWebpackPlugin({
            title:'车辆花销管理',
            template:'./src/index.html',
            filename:'./index.html' //结合output.path
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};