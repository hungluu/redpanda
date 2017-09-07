const argv = require('yargs').argv
const webpackConfig = require('./webpack.config')
const sauceLabsIdentity = process.env.SAUCE_USERNAME
  ? {username: process.env.SAUCE_USERNAME, accessKey: process.env.SAUCE_ACCESS_KEY}
  : require('./saucelabs.identity')

const TEST_BUNDLER = './tests/test-bundler.sauce.js'

const browsers = [
  { base: 'SauceLabs', browserName: 'android', version: '4.4', platform: 'Linux' },
  { base: 'SauceLabs', browserName: 'android', version: '6.0', platform: 'Linux' },
  { base: 'SauceLabs', browserName: 'chrome',
    version: '26',
    platform: 'Windows 2008' },
  { base: 'SauceLabs', browserName: 'chrome',
    version: '60',
    platform: 'Windows 2008' },
  { base: 'SauceLabs', browserName: 'firefox', version: '4', platform: 'Windows 10' },
  { base: 'SauceLabs', browserName: 'firefox', version: '55', platform: 'Mac 10.9' },
  // { base: 'SauceLabs', browserName: 'internet explorer',
  //   version: '6',
  //   platform: 'Windows 2003' },
  // { base: 'SauceLabs', browserName: 'internet explorer',
  //   version: '7',
  //   platform: 'Windows 2003' },
  // { base: 'SauceLabs', browserName: 'internet explorer',
  //   version: '8',
  //   platform: 'Windows 2008' },
  { base: 'SauceLabs', browserName: 'internet explorer',
    version: '9',
    platform: 'Windows 2008' },
  { base: 'SauceLabs', browserName: 'internet explorer',
    version: '10',
    platform: 'Windows 2012' },
  { base: 'SauceLabs', browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 10' },
  { base: 'SauceLabs', browserName: 'iphone', version: '8.1', platform: 'Mac 10.10' },
  { base: 'SauceLabs', browserName: 'iphone', version: '10.3', platform: 'Mac 10.12' },
  { base: 'SauceLabs', browserName: 'opera', version: '11', platform: 'Windows 2003' },
  { base: 'SauceLabs', browserName: 'opera', version: '12', platform: 'Windows 2003' },
  { base: 'SauceLabs', browserName: 'safari', version: '5', platform: 'Windows 2008' },
  { base: 'SauceLabs', browserName: 'safari', version: '6', platform: 'Mac 10.8' },
  { base: 'SauceLabs', browserName: 'safari', version: '7', platform: 'Mac 10.9' },
  { base: 'SauceLabs', browserName: 'safari', version: '8', platform: 'Mac 10.10' },
  { base: 'SauceLabs', browserName: 'safari', version: '9', platform: 'Mac 10.11' },
  { base: 'SauceLabs', browserName: 'safari', version: '10', platform: 'Mac 10.12' },
  { base: 'SauceLabs', browserName: 'microsoftedge',
    version: '13',
    platform: 'Windows 10' },
  { base: 'SauceLabs', browserName: 'microsoftedge',
    version: '14',
    platform: 'Windows 10' },
  { base: 'SauceLabs', browserName: 'microsoftedge',
    version: '15',
    platform: 'Windows 10' }
];

var karmaBrowsers = {};
browsers.forEach((item) => {
  karmaBrowsers[item.browserName + ' ' + item.version + ' ' + item.platform] = item
})

const karmaConfig = {
  sauceLabs: {
    testName: 'Test RedPanda on Saucelabs',
    recordScreenshots: false,
    username: sauceLabsIdentity.username,
    accessKey: sauceLabsIdentity.accessKey,
    connectOptions: {
      logfile: 'sauce_connect.log',
      'no-ssl-bump-domains': 'all', // ignore android 4 emulator SSL error
    },
    public: 'public'
  },
  basePath: '../',
  browsers: Object.keys(karmaBrowsers),
  customLaunchers: karmaBrowsers,
  singleRun: !argv.watch,
  coverageReporter: {
    reporters: [
      { type: 'text-summary' },
    ],
  },
  files: [{
    pattern  : TEST_BUNDLER,
    watched  : false,
    served   : true,
    included : true
  }],
  frameworks: ['mocha'],
  reporters: ['mocha', 'saucelabs'],
  preprocessors: {
    [TEST_BUNDLER]: ['webpack'],
  },
  logLevel: 'WARN',
  browserConsoleLogOptions: {
    terminal: true,
    format: '%b %T: %m',
    level: '',
  },
  webpack: {
    entry: TEST_BUNDLER,
    devtool: 'cheap-module-source-map',
    module: webpackConfig.module,
    plugins: webpackConfig.plugins,
    resolve: webpackConfig.resolve,
    externals: {
      'react/addons': 'react',
      'react/lib/ExecutionEnvironment': 'react',
      'react/lib/ReactContext': 'react',
    },
  },
  webpackMiddleware: {
    stats: 'errors-only',
    noInfo: true,
  },
  concurrency: 5,
  // Increase timeout in case connection in CI is slow
  captureTimeout: 120000,
  // web server port
  //  port: 11001,
}

module.exports = (cfg) => cfg.set(karmaConfig)
