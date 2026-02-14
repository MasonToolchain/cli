import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'fs',
  'path',
  'url',
  'os',
  'util',
  'child_process',
  'stream',
  'http',
  'https',
  'zlib',
  'tty',
  'events',
  'crypto',
  'readline',
];

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.cjs',
    format: 'cjs',
    sourcemap: true,
    banner: '#!/usr/bin/env node'
  },
  external,
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    terser(),
  ],
};
