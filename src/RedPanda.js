const fetch = require('isomorphic-fetch')
import kindOf from 'kind-of'
import Registry from './Registry'
import PromiseStack from './PromiseStack'

import RequestSequence from './RequestSequence'
import RequestStack from './RequestStack'

/**
 * The RedPanda Api Center
 * @param {object} namedEntities The named request / request group registry
 */
class RedPanda {
  constructor () {
    // private
    let reg = new Registry()

    /**
     * Get request options
     *
     * @param {string|Array|object} key
     * @return {Array}
     */
    this.get = (key) => reg.get(key)

    /**
     * Name a request by options or an array of request options
     *
     * @param {string} key option name
     * @param {string|Array|object} value option value
     * @return {Array}
     */
    this.set = (key, value) => {
      reg.set(key, value)
      return this
    }
  };

  /**
   * Send a request with options defined by name
   *
   * @param {string} requestName name of request that defined
   * @return {PromiseStack}
   */
  /**
   * Send a request with options
   *
   * @param {object} requestOptions options of request, method is 'GET' by default
   * @return {PromiseStack}
   */
  /**
   * Send a bulk of requests in parallels
   *
   * @param {array} requestOptionArray an array of request options or request name
   * @return {PromiseStack}
   */
  send (requestOptions, checked) {
    let promises = this.get(requestOptions).map((option) => {
      if (kindOf(option) === 'object') {
        return fetch(option.url, option)
      }
      else {
        return this.send(option, true).all()
      }
    })
    return new PromiseStack(promises)
  };

  /**
   * Send a bulk of requests sequentially
   *
   * @param {array} requestOptionArray an array of request options or request name
   * @return {PromiseStack}
   */
  sendSequence (requestOptions) {
    let queue = new RequestSequence(this.get(requestOptions), this)
    return queue.start()
  };

  sequence(requestOptions) {
    return new RequestSequence(requestOptions)
  };
};

export default RedPanda
