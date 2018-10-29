const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const config = {
    mode: 'development',
    entry: {
        app: './src/js/app.js',
    },
    output: {
        // 这个路径必须是绝对路径
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // 第三方公共代码
                vender: {
                    test: /node_modules/,
                    name: 'vender',
                    chunks: 'initial',
                    priority: 10
                },
                // 自己写的公共代码
                utils: {
                    name: 'utils',
                    chunks: 'initial',
                    minSize: 0 // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use:'babel-loader',
                include: '/src/',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                    ],
                    publicPath: '../', // 这里需要指定css文件引用其他文件的路径
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // 小于这个大小的图片直接转换为base64
                            outputPath: 'images/', // 打包后的目录
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader',
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true,
            chunks: ['app','vender']
        }),
        /**
         *  有多个css文件时用[name]来作为占位符输出多个css
         *  跟ouput的[name]相同
         */
        new extractTextPlugin('css/[name].css'),
        new cleanWebpackPlugin('dist'),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: './dist', // 目录
        port: 8888, // 端口
        compress: true, // 压缩
        open: true, // 自动打开浏览器
        hot: true // 热更新
    }
}

module.exports = config;