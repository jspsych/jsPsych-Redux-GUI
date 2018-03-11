var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    "babel-polyfill"
  ],
  resolve: {
    alias: {
      'utils': path.resolve(__dirname, '../src/common/utils/index.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      utils: 'utils'
    })
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: path.resolve(__dirname, '../'),
      query: {
        presets: ['env', 'react', 'stage-0']
      }
    }, {
      test: /\.json$/,
      loader: "json-loader"
    }]
  },
  node: {
    fs: "empty",
    module: "empty",
    net: "empty"
  }
}