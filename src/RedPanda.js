import Registry from 'Registry'
const fetch = require('isomorphic-fetch')
const kindOf = require('kind-of')

/**
 * The RedPanda Api Center
 * @param {object} namedEntities The named request / request group registry
 */
class RedPanda {
  constructor () {
    this.registry = new Registry()
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
  send (requestOptions, isChained) {
    let promiseStack = []

    if (kindOf(requestOptions) === 'array') {
      for (var index = 0, length = requestOptions.length, options; index < length; index++) {
        options = this.registry.get(requestOptions[index])
        promiseStack.push(fetch(options.url, options))
      }
    }
    else {
      promiseStack.push(fetch(this.registry.get(requestOptions)))
    }

    return Promise.all(promiseStack)
  };

  /**
   * Name a request with options
   *
   * @param {string} requestName
   * @param {object} requestOptions
   * @memberof RedPanda
   */
  /**
   * Name a request group
   *
   * @param {string} requestName
   * @param {array}  requestOptionStack
   * @memberof RedPanda
   */
  define (requestName, requestOptions) {
    this.registry.set(requestName, requestOptions);
  };

  listen (requestOptions, callbacks) {};
};

export default RedPanda
