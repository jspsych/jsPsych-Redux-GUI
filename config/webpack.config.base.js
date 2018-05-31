var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    "babel-polyfill"
  ],
  resolve: {
    alias: {
      utils: path.resolve(__dirname, '../src/common/utils/index.js'),
      enums: path.resolve(__dirname, '../src/common/constants/enumerators.js'),
      actions: path.resolve(__dirname, '../src/common/constants/ActionTypes.js'),
      theme: path.resolve(__dirname, '../src/common/constants/theme.js'),
      core: path.resolve(__dirname, '../src/common/constants/core.js'),
      myaws: path.resolve(__dirname, '../src/cloud/index.js'),
      errors: path.resolve(__dirname, '../src/common/constants/Errors.js'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      utils: 'utils',
      enums: 'enums',
      actions: 'actions',
      theme: 'theme',
      core: 'core',
      myaws: 'myaws',
      errors: 'errors'
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