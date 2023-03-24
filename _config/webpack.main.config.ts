import type { Configuration } from 'webpack';
import { rules } from './webpack.rules';
// eslint-disable-next-line import/default
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.renderer', '.tsx', '.css', '.json'],
  },
  stats: {
    errorDetails: true,
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: path.join('assets'), to: 'assets' }] })
  ]
};
