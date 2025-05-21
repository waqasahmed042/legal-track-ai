/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const urlDev = "https://localhost:3000/";
const urlProd = "https://codewithabubakr.github.io/LegalTrackAiWordAddin/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      vendor: ["react", "react-dom", "core-js", "@fluentui/react-components", "@fluentui/react-icons"],
      taskpane: ["./src/taskpane/index.tsx", "./src/taskpane/taskpane.html"],
      aiResultDialog: [
        "./src/taskpane/dialogBoxes/aiResultDialog/aiResultIndex.html",
        "./src/taskpane/dialogBoxes/aiResultDialog/aiResultIndex.tsx",
      ],
      searchLibraryDialog: [
        "./src/taskpane/dialogBoxes/searchLibraryDialog/searchLibraryIndex.html",
        "./src/taskpane/dialogBoxes/searchLibraryDialog/searchLibraryIndex.tsx",
      ],
      summaryDialog: [
        "./src/taskpane/dialogBoxes/summaryDialog/summaryIndex.html",
        "./src/taskpane/dialogBoxes/summaryDialog/summaryIndex.tsx",
      ],
      riskAnalysisDialog: [
        "./src/taskpane/dialogBoxes/riskAnalysisDialog/riskAnalysisIndex.html",
        "./src/taskpane/dialogBoxes/riskAnalysisDialog/riskAnalysisIndex.tsx",
      ],
      writeDialog: [
        "./src/taskpane/dialogBoxes/writeDialog/writeIndex.html",
        "./src/taskpane/dialogBoxes/writeDialog/writeIndex.tsx",
      ],
      commands: "./src/commands/commands.ts",
    },
    output: {
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|ttf|woff|woff2|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "vendor", "taskpane"],
      }),
      new HtmlWebpackPlugin({
        filename: "aiResultIndex.html",
        template: "./src/taskpane/dialogBoxes/aiResultDialog/aiResultIndex.html",
        chunks: ["aiResultDialog"],
      }),
      new HtmlWebpackPlugin({
        filename: "searchLibraryIndex.html",
        template: "./src/taskpane/dialogBoxes/searchLibraryDialog/searchLibraryIndex.html",
        chunks: ["searchLibraryDialog"],
      }),
      new HtmlWebpackPlugin({
        filename: "summaryIndex.html",
        template: "./src/taskpane/dialogBoxes/summaryDialog/summaryIndex.html",
        chunks: ["summaryDialog"],
      }),
      new HtmlWebpackPlugin({
        filename: "riskAnalysisIndex.html",
        template: "./src/taskpane/dialogBoxes/riskAnalysisDialog/riskAnalysisIndex.html",
        chunks: ["riskAnalysisDialog"],
      }),
      new HtmlWebpackPlugin({
        filename: "writeIndex.html",
        template: "./src/taskpane/dialogBoxes/writeDialog/writeIndex.html",
        chunks: ["writeDialog"],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["commands"],
      }),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"],
      }),
      new Dotenv(),
      new NodePolyfillPlugin(),
    ],
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  return config;
};
