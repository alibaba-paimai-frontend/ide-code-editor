const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { getExternal, getMonacoPlugin } = require('./webpack-helper');

const targetDir = 'dist';

const defaultConfig = common.map(config => {
  return merge(config, {
    entry: './src/index.tsx',
    externals: getExternal(['styled-components'], false),
    output: {
      filename: 'index.umd.js',
      libraryTarget: 'umd',
      library: 'ideCodeEditor',
      path: path.resolve(__dirname, 'dist'),
      umdNamedDefine: true
    },
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      minimizer: [new TerserPlugin()]
    },
    plugins: [
      getMonacoPlugin(),
      new CleanWebpackPlugin(targetDir),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  });
});

// 我们输出三份配置
module.exports = defaultConfig.concat([
  merge(defaultConfig[0], {
    externals: getExternal(['styled-components'], true),
    output: {
      filename: 'index.browser.js',
      libraryTarget: 'umd',
      library: 'ideCodeEditor',
      path: path.resolve(__dirname, 'dist'),
      umdNamedDefine: true
    }
  })
]);
