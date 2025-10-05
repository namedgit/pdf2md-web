const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Try a few common entry locations used in this repo's history
const entryCandidates = [
  './javascript/index.jsx',
  './javascript/index.js',
  './src/index.jsx',
  './src/index.js'
];
const entry = entryCandidates.find(p => fs.existsSync(path.resolve(__dirname, p))) || './src/index.js';

console.log('[pdf2md-web] Using entry:', entry);

module.exports = {
  mode: 'development',
  entry: [
    'core-js',
    'regenerator-runtime/runtime',
    entry
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: fs.existsSync(path.resolve(__dirname, 'index.html'))
        ? 'index.html'
        : path.resolve(__dirname, 'index.html'),
      // title fallback if template missing (we also ship one)
      templateParameters: { title: 'pdf2md-web' }
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/worker.js', to: 'worker.js', noErrorOnMissing: true },
        { from: 'public/cmaps', to: 'cmaps', noErrorOnMissing: true }
      ]
    })
  ],
  devtool: 'source-map',
  devServer: {
    static: { directory: path.join(__dirname, 'public') },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true
  }
};
