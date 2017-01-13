var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry:  path.resolve('js', 'app.js'),
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('.', 'index.tpl.html'),
      inject:   'body',
      filename: 'index.html'
    })
  ],
  module: {
    loaders: [{
      "test":    /\.js$/,
      "exclude": [/\/handlebars-incremental-dom/, /node_modules/],
      "loader":  "babel-loader",
      "query": {
        "presets": ["es2015", "stage-0"],
        "plugins": ["transform-decorators-legacy"]
      }
    }, {
      "test":    /\.hbs$/,
      "loader":  "handlebars-incremental-dom/webpack-loader"
    }]
  }
};
