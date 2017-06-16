import path from 'path';
import Express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../config/webpack.config.development';

import template from '../../public/template';

const app = new Express();
const port = 3000;

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(Express.static(path.join(__dirname + '/../../public')));

app.use(function(req, res) {
  res.send(template({}));
});

var server = app.listen(port, function() {
  var port = server.address().port;

  console.log("Example app listening at http://localhost:%s", port);
})