var merge = require('webpack-merge');
var baseConfig = require("./webpack.config.base");
var path = require('path');
var webpack = require('webpack');

module.exports = merge(baseConfig, {
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
})

