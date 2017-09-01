import './normalize.js'
import chai from 'chai'
import sinon from 'sinon'
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
const project = require('../project.config')
const hasFeature = (name, callback) => {
  let featureEnabled = typeof project.features[name] !== 'undefined' && project.features[name]
  if (featureEnabled && callback) {
    callback()
  }

  return featureEnabled
}

// Mocha / Chai
// ------------------------------------
mocha.setup({ ui: 'bdd' })
chai.should()

global.chai = chai
global.expect = chai.expect
global.sinon = sinon

// Chai Plugins
// ------------------------------------
chai.use(dirtyChai)
chai.use(chaiAsPromised)
chai.use(sinonChai)
hasFeature('react', function () {
  // chai.use(require('chai-enzyme')())
})

// Test Importer
// ------------------------------------
// We use a Webpack global here as it is replaced with a string during compile.
// Using a regular JS variable is not statically analyzable so webpack will throw warnings.
const testsContext = require.context('./', true, /\.(spec|test)\.(js|ts|tsx)$/)

// When a test file changes, only rerun that spec file. If something outside of a
// test file changed, rerun all tests.
// https://www.npmjs.com/package/karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []
const allTests = testsContext.keys()
const changedTests = allTests.filter(path => {
  return __karmaWebpackManifest__.indexOf(path) !== -1
})

;(changedTests.length ? changedTests : allTests).forEach(testsContext)
