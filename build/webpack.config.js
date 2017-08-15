const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const project = require('../project.config')
const fs = require('fs-extra')

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = (file) => inProject(project.srcDir, file)
const inProjectFiles = (subPath) => fs.readdirSync(subPath ? inProject(project.srcDir, subPath) : inProject(project.srcDir))
const exit = (hasError) => process.exit(hasError ? 1 : 0)
const normalizeSlashes = (path) => path.replace(/\\/g, '/')
const isExternal = (module) => typeof module.userRequest === 'string' && module.userRequest.match(/(bower_components|node_modules)/)

// Prepare configs for multiple html files compilation
//------------------------------------------------------
let entryPoints = {},
  htmlCompilers = []
inProjectFiles().forEach(function(fileName) {
  entryPoints[fileName] = []
  entryPoints[fileName].push(inProjectSrc(path.join(fileName, '_bootstrap.js')))
  htmlCompilers.push(new HtmlWebpackPlugin({
    inject: 'body',
    chunks: [fileName],
    filename: fileName + '/index.html',
    template: inProjectSrc(fileName + '/_view.html')
  }))
})

const __DEV__ = project.env === 'development'
const __TEST__ = project.env === 'test'
const __PROD__ = project.env === 'production'

const config = {
  entry: entryPoints,
  devtool: project.sourcemaps ? 'source-map' : false,
  output: {
    path: inProject(project.outDir),
    filename: __DEV__ ? '[name]/[name].js' : '[name]/[name].[chunkhash].js',
    publicPath: project.publicPath,
  },
  resolve: {
    modules: [
      inProject(project.srcDir),
      'node_modules',
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  externals: project.externals,
  module: {
    rules: [],
  },
  plugins: htmlCompilers.concat(
    new webpack.DefinePlugin(Object.assign({
      'process.env': {
        NODE_ENV: JSON.stringify(project.env)
      },
      __DEV__,
      __TEST__,
      __PROD__,
    }, project.globals))
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendors',
    //   minChunks: (module) => isExternal(module)
    // })
  )
}

// config.resolveLoader = {
//   alias: {
//     "vendor-loader": inProject('vendorLoader.js')
//   }
// }

// HTML
// ------------------------------------
config.module.rules.push({
  test: /\.(ejs|html)$/,
  exclude: /node_modules/,
  // use: [
  use: [{
    loader: 'html-loader',
    options: {
      interpolate: true
    }
  }]
})

// JavaScript
// ------------------------------------
config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      plugins: [
        'babel-plugin-transform-class-properties',
        'babel-plugin-syntax-dynamic-import', [
          'babel-plugin-transform-runtime',
          {
            helpers: true,
            polyfill: false, // we polyfill needed features in src/normalize.js
            regenerator: true,
          },
        ],
        [
          'babel-plugin-transform-object-rest-spread',
          {
            useBuiltIns: true // we polyfill Object.assign in src/normalize.js
          },
        ],
      ],
      presets: [
        'babel-preset-react', ['babel-preset-env', {
          modules: false,
          targets: {
            ie9: false,
          },
          uglify: true,
        }],
      ]
    },
  }],
})

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: '[name]/styles/[name].[contenthash].css',
  allChunks: false,
  disable: __DEV__,
})

config.module.rules.push({
  test: /\.(sass|scss|css)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [{
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          minimize: {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll: true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: project.sourcemaps,
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: project.sourcemaps,
          includePaths: [
            inProjectSrc('styles'),
          ],
        },
      }
    ],
  })
})
config.plugins.push(extractStyles)

const CopyWebpackPlugin = require('copy-webpack-plugin')
config.plugins.push(new CopyWebpackPlugin(project.copy))

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif)$/,
  loader: 'file-loader',
  options: {
    limit: 8192,
    name: (srcPath) => normalizeSlashes(srcPath.split('src\\')[1])
  }
})

// Fonts
// ------------------------------------
;
[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0]
  const mimetype = font[1]

  config.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype,
    },
  })
})

// HTML Template
// ------------------------------------
// config.plugins.push(new HtmlWebpackPlugin({
//   template: inProjectSrc('index.html'),
//   inject: true,
//   minify: {
//     collapseWhitespace: true,
//   },
// }))

// Development Tools
// ------------------------------------
if (__DEV__) {
  // config.entry.main.push(
  //   `webpack-hot-middleware/client.js?path=${config.output.publicPath}__webpack_hmr`
  // )
  var hmrPublicPath = '/'; // config.output.publicPath;
  for (var key in config.entry) {
    if (config.entry.hasOwnProperty(key)) {
      config.entry[key].push(
        `webpack-hot-middleware/client.js?path=${hmrPublicPath}__webpack_hmr`
      )
    }
  }
  config.plugins.push(
    new webpack.ProvidePlugin({
      jQuery: "jquery"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Bundle Splitting
// ------------------------------------
// if (!__TEST__) {
//   const bundles = ['normalize', 'manifest']

//   if (project.vendors && project.vendors.length) {
//     bundles.unshift('vendor')
//     config.entry.vendor = project.vendors
//   }
//   config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
//     names: bundles
//   }))
// }

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      // minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    })
  )
}

module.exports = config
