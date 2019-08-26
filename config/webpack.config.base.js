var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    "@babel/polyfill"
  ],
  plugins: [
    new webpack.ProvidePlugin({
      utils: path.resolve(__dirname, '../src/common/utils/index.js'),
      enums: path.resolve(__dirname, '../src/common/constants/enumerators.js'),
      actions: path.resolve(__dirname, '../src/common/constants/ActionTypes.js'),
      theme: path.resolve(__dirname, '../src/common/constants/theme.js'),
      core: path.resolve(__dirname, '../src/common/constants/core.js'),
      myaws: path.resolve(__dirname, '../src/cloud/index.js'),
      errors: path.resolve(__dirname, '../src/common/constants/Errors.js'),
    })
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      include: path.resolve(__dirname, '../'),
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    }]
  },
  node: {
    fs: "empty",
    module: "empty",
    net: "empty"
  }
}