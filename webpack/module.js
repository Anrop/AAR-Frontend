var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  loaders: [
    {
      test: /\.css?$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
    },
    {
      test: /\.eot$/,
      loader: "file-loader",
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['react', 'es2015', 'stage-2'],
      }
    },
    {
      test: /\.png$/,
      loader: "file-loader"
    },
    {
      test: /\.svg$/,
      loader: "file-loader"
    },
    {
      test: /\.ttf$/,loader: "file-loader"
    },
    {
      test: /\.(woff|woff2)$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    },
  ],
};
