var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path=require('path');
var copy=require('./src/lib/copy');

// 生产环境
var isProd = process.env.NODE_ENV === 'production';

//复制静态资源文件
if(isProd) {
    //css
    copy('./src/css', './dist');
    //images
    copy('./src/img', './dist');
}

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
        publicPath:isProd ? './' : '/', //给require.ensure用；webpack-dev-server的网站名
        path: path.resolve(__dirname, './dist'), //js的发布路径
        filename: !isProd ? '[name].[chunkhash:8].js' : '[name].js',
        chunkFilename:!isProd ? '[name].chunk.[chunkhash:8].js' : '[name].chunk.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'react-hot/webpack!jsx?harmony', include:path.join(__dirname, './src')}
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new ExtractTextPlugin(!isProd ? '[name].[chunkhash:8].css' : '[name].css'),
        new HtmlWebpackPlugin({
            title:'车辆花销管理',
            template:isProd?'./src/index.html':'./src/index.debug.html',
            filename:'./index.html' //结合output.path
        })
    ]
};