//@ts-check
'use strict';
const path = require('path');
/**@type {import('webpack').Configuration}*/

const config = {
  target: 'node',
  // production none
  mode: 'none',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  devtool: 'nosources-source-map',
  externals: {  //防止commonjs vscode被webpack打包
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vsceignore file
  },
  resolve: {
    //设置那些文件可以作为模块
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
};
module.exports = config;