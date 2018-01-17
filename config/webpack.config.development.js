var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    path.resolve(__dirname, '../src/client/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: path.resolve(__dirname, '../'),
      query: {
        presets: ['es2015', 'react', 'stage-0']
      }
    }, {
      test: /\.css$/,
      loader: 'style!css!'
    }, {
        test: /\.json$/,
        loader: 'json-loader'
    }]
  },

  node: {
    fs: "empty",
    module: "empty",
    net: "empty"
  }
}
