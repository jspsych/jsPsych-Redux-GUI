var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
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
      loader: 'babel',
      exclude: /node_modules/,
      include: path.resolve(__dirname, '../'),
      query: {
        presets: ['es2015', 'react']
      }
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  }
}