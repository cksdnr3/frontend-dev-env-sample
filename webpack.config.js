const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const apiMocker = require("connect-api-mocker");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "developoment";

module.exports = {
  mode,
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  devServer: {
    port: 3000,
    client: {
      progress: true,
      overlay: {
        errors: true,
      },
      logging: "error",
    },
    onBeforeSetupMiddleware: (devServer) => {
      if (!devServer) throw new Error("webpack-dev-server is not defined");
      devServer.app.use(apiMocker("/api", "mocks/api"));
      // devServer.app.get("/api/users", (req, res) => {
      //   res.json([
      //     {
      //       id: 1,
      //       name: "alice",
      //     },
      //     {
      //       id: 2,
      //       name: "tom",
      //     },
      //     {
      //       id: 3,
      //       name: "james",
      //     },
      //   ]);
      // });
    },
    proxy: {
      "/api": "http://localhost:3000",
    },
    hot: true,
  },
  optimization: {
    minimizer: mode === "production" ? [new CssMinimizerPlugin()] : [],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
          Build Date: ${new Date().toLocaleString()}
          Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
          Author: ${childProcess.execSync("git config user.name")}
        `,
    }),
    new webpack.DefinePlugin({
      TWO: "1 + 1",
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(development)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin({}),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: "[name].css" })]
      : []),
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/axios/dist/axios.min.js",
          to: "./axios.min.js",
        },
      ],
    }),
  ],
};
