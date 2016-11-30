var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path=require('path');

// 生产环境
var isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        app: isProd?[
            './src/app'
        ]:[
            'webpack-dev-server/client?http://0.0.0.0:3000',
            'webpack/hot/only-dev-server',
            './src/app'
        ],
        vendor:[
            'react',
            'react-dom',
            'react-router'
        ]
    },
    output: {
        publicPath:isProd ? './' : '/', //给require.ensure用；webpack-dev-server的网站名
        path: path.resolve(__dirname, './dist'), //js的发布路径
        filename: '[name].js',
        chunkFilename:'[name].chunk.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'react-hot/webpack!jsx?harmony', include:path.join(__dirname, './src')},
            {test: /\.css$/, loaders: ['style', 'css'], include:path.join(__dirname, './src')}
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(isProd?"production":"dev")
            }
        }),
        new webpack.ProvidePlugin({
            React:'react'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        //new ExtractTextPlugin(isProd ? '[name].[chunkhash:8].css' : '[name].css'),
        new HtmlWebpackPlugin({
            title:'汽车花销管理',
            favicon:'./src/img/favicon.png',
            template:isProd?'./src/index.html':'./src/index.debug.html',
            filename:'./index.html' //结合output.path
        })
    ]
};