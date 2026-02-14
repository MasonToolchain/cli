export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.cjs',
    format: 'cjs',
    sourcemap: true,
    banner: '#!/usr/bin/env node',
  },
}
