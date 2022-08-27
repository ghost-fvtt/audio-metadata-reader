// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import copy from '@guanghechen/rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';

import { distDirectory, name, sourceDirectory } from './tools/const.mjs';

const staticFiles = [
  '.reuse',
  'CHANGELOG.md.license',
  'CHANGELOG.md',
  'lang',
  'LICENSE.md',
  'module.json.license',
  'module.json',
  'README.md',
  'templates',
];
const isProduction = process.env.NODE_ENV === 'production';
const isWatch = process.env.ROLLUP_WATCH === 'true';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: { [`${name}`]: `${sourceDirectory}/${name}.js` },
  output: {
    dir: distDirectory,
    format: 'es',
    sourcemap: true,
    assetFileNames: '[name].[ext]',
  },
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    styles({
      mode: ['extract', `styles/${name}.css`],
      url: false,
      sourceMap: true,
      minimize: isProduction,
    }),
    copy({
      targets: [{ src: staticFiles, dest: distDirectory }],
    }),
    isProduction && terser({ ecma: 2020, keep_fnames: true }),
    isWatch && livereload(distDirectory),
  ],
};

export default config;
