const fetch = require('isomorphic-fetch')
const kindOf = require('kind-of')
const Registry = require('./Registry')

/**
 * The RedPanda Api Center
 * @param {object} namedEntities The named request / request group registry
 */
class RedPanda {
  constructor () {
    // private
    let reg = new Registry()

    this.get = (key) => reg.get(key)
    this.set = (key, value) => {
      reg.set(key, value)
      return this
    }
  };

  /**
   * Send a request with options defined by name
   *
   * @param {string} requestName name of request that defined
   * @memberof RedPanda
   * @return {Promise}
   */
  /**
   * Send a request with options
   *
   * @param {object} requestOptions options of request, method is 'GET' by default
   * @memberof RedPanda
   * @return {Promise}
   */
  /**
   * Send a bulk of request one by one
   *
   * @param {mixed} requestList a list of request by options or name
   * @param {boolean} isChained If true, next request in queue will only be called
   *  when a response has been received from previous one
   * @memberof RedPanda
   * @return {Promise}
   */
  send (requestOptions) {
    let promiseStack = this.get(requestOptions).map((option) => fetch(option.url, option))

    return Promise.all(promiseStack)
  };

  listen (requestOptions, callbacks) {};
};

module.exports = RedPanda
