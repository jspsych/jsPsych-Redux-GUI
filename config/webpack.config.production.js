var path = require('path');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.resolve(__dirname, '../src/client/index.js'),
    path.resolve(__dirname, '../public/jsPsych/jspsych.js'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
    new webpack.optimize.AggressiveMergingPlugin()
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
