var path = require('path');
const COPY = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const ServiceWorker = path.resolve(__dirname, './sw.js');
const PUSH_ICON = path.resolve(__dirname, './icon/icon_title.png');
const Manifest = path.resolve(__dirname, './manifest.json');
const Path_To_Reg = path.resolve(__dirname, './path-to-regexp.js');

const DIST = path.resolve(__dirname, './dist/');

module.exports = {
    entry: './js/index.js',
    output: {
        filename: '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, "./dist"),
        chunkFilename: '[id]-[chunkhash].chunk.js'
    },
    module: {
        loaders:[
            { 
                test: /\.js[x]?$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.css$/, loader: 'style-loader!css-loader?modules' }
        ]
    },
    plugins: [
        new COPY([{
            from:ServiceWorker,
            to: DIST
        },
        {
            from:PUSH_ICON,
            to:DIST
        },
        {
            from:Manifest,
            to:DIST
        },{
            from: Path_To_Reg,
            to:DIST
        }]),
        new HtmlWebpackPlugin({
            title: 'sw test',
            filename: 'index.html',
            template: './template.html',
        })
    ]
};