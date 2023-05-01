import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// eslint-disable-next-line import/default
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import webpack from "webpack"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyWebpackPlugin({ patterns: [{ from: path.join('assets'), to: 'assets' }] }),
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(require("../package.json").version)
  })
];
