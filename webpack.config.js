const path = require("path");
const webpack = require('webpack');
const childProcess = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            process.env.NODE_ENV === 'production'
                ? MiniCssExtractPlugin.loader
                : "style-loader",
          "css-loader"
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',

      }
    ],
  },
  plugins: [
      new webpack.BannerPlugin({
        banner: `
          Build Date: ${new Date().toLocaleString()}
          Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
          Author: ${childProcess.execSync('git config user.name')}
        `
      }),
      new webpack.DefinePlugin({
        TWO: '1 + 1',
        'api.domain': JSON.stringify('http://dev.api.domain.com')
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        templateParameters: {
          env: process.env.NODE_ENV === 'development' ? '(development)' : ''
        },
        minify: process.env.NODE_ENV === 'production' ? {
          collapseWhitespace: true,
          removeComments: true,
        } : false
      }),
      new CleanWebpackPlugin({}),
    ...(
        process.env.NODE_ENV === 'production'
            ? [new MiniCssExtractPlugin({ filename: '[name].css' })]
            : []
    )
  ]
};