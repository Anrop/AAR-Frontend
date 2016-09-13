var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
  },
  devtool: 'eval',
  entry: require('./webpack/entry'),
  module: require('./webpack/module'),
  output: require('./webpack/output'),
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin(
      'vendor',
      'vendor.bundle.js'
    ),
  ],
  resolve: require('./webpack/resolve'),
};
