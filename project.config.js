const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  features: {
    html: false,
    css : false,
    react: false,
    chunkHashJs: false,
    commonChunk: false,
    normalizeSeparated: false
  },
  /** Developing port */
  devPort: 4321,
  /** The environment to use when building the project */
  env: NODE_ENV,
  /** The full path to the project's root directory */
  basePath: __dirname,
  /** The name of the directory containing the application source code */
  srcDir: 'src',
  /** The file name of the application's entry point */
  main: 'main',
  /** The name of the directory in which to emit compiled assets */
  outDir: 'dist',
  /** The base path for all projects assets (relative to the website root) */
  publicPath: '/Content/',
  /** Whether to generate sourcemaps */
  sourcemaps: true,
  /** A hash map of keys that the compiler should treat as external to the project */
  externals: {},
  /** A hash map of variables and their values to expose globally */
  globals: {},
  /** Whether to enable verbose logging */
  verbose: false,
  /** The list of modules to bundle separately from the core application code */
  vendors: [],
  /** the list of vendor files that copied separately */
  copy: []
}
