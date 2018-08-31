import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';


const config = {
  input: 'src/ReduxStoreProvider.js',
  output: [{
    file: 'dist/redux-store-provider.cjs.js',
    format: 'cjs',
  }, {
    file: 'dist/redux-store-provider.umd.js',
    format: 'umd',
    name: 'ReduxStoreProvider',
    globals: { lodash: '_' },
  }, {
    file: 'dist/redux-store-provider.es.js',
    format: 'es',
  }],
  external:['lodash'],
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**', // only transpile our source code
      presets: [
        ['env', { modules: false, loose: true }],
      ],
      plugins: [
        ['transform-object-rest-spread', { 'useBuiltIns': true }],
      ],
    }),
    commonjs(),
  ],
};


export default config;
