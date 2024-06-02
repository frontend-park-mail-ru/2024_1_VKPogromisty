const path = require("path");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack5-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  entry: "./public/index.js",

  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.hbs$/i,
        use: "handlebars-loader",
      },
      {
        test: /\.js$/,
        include: /public/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  optimization: {
    minimizer: [
      "...",
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
        },
        generator: [
          {
            type: "asset",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },

  plugins: [
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, "public/sw.js"),
    }),
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public/index.html"),
          to: path.resolve(__dirname, "dist"),
        },
        {
          from: path.resolve(__dirname, "static"),
          to: path.resolve(__dirname, "dist/"),
        },
      ],
    }),
  ],
};
