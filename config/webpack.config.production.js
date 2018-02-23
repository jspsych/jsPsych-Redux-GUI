var merge = require('webpack-merge');
var baseConfig = require("./webpack.config.base");
var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseConfig, {
  devtool: 'cheap-module-source-map',
  entry: [
    path.resolve(__dirname, '../src/client/index.js'),
  ],
  output: {
    path: path.resolve(__dirname, '../public/static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: { except: ['exports'] },
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
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
})
