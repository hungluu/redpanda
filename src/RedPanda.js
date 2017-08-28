require('isomorphic-fetch')

import Registry from './Registry'
import PromiseCollection from './PromiseCollection'
import RequestSequence from './RequestSequence'

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

    /**
     * Flatten multi-level request stacks passed in
     *
     * @param {mixed} options
     * @return {Array}
     */
    this.flatten = (options) => reg.flatten(options)
  };

  /**
   * Send a request with options defined by name
   *
   * @param {string} requestName name of request that defined
   * @return {PromiseCollection}
   */
  /**
   * Send a request with options
   *
   * @param {object} requestOptions options of request, method is 'GET' by default
   * @return {PromiseCollection}
   */
  /**
   * Send a bulk of requests in parallels
   *
   * @param {array} requestOptionArray an array of request options or request name
   * @return {PromiseCollection}
   */
  send (requestOptions) {
    let promises = this.flatten(requestOptions).map((option) => option instanceof RequestSequence
      ? (new RequestSequence(option.items, this)).start()
      : fetch(option.url, option)
    )

    return new PromiseCollection(promises)
  };

  /**
   * Create a request sequence by request name
   *
   * @param {string} requestName name of request that defined
   * @return {PromiseCollection}
   */
  /**
   * Create a request sequence by request options
   *
   * @param {object} requestOptions options of request, method is 'GET' by default
   * @return {PromiseCollection}
   */
  /**
   * Create a request sequence bu a bulk of requests that is intended to process sequentialy
   *
   * @param {array} requestOptionArray an array of request options or request name
   * @return {RequestSequence}
   */
  sequence(requestOptions) {
    return new RequestSequence(this.flatten(requestOptions), this)
  };

  /**
   * An ultility function to manually get a resolved promise
   * @param {*} value
   * @return {Promise}
   */
  resolve (value) {
    return Promise.resolve(value)
  };

  /**
   * An ultility function to manually get a rejected promise
   * @param {string} value
   * @return {Promise}
   */
  reject (error) {
    return Promise.reject(error)
  };

  /**
   * An ultility function to manually wait some promises
   * @param {Promise[]} promises
   */
  waitAll (promises) {
    return Promise.all(promises)
  };
};

export default RedPanda
