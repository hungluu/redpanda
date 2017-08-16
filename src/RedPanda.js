const JSON = require('json3')

/**
 * The RedPanda Api Center
 */
class RedPanda {
  constructor () {
    /**
     * The named requests registry
     * @param {object}
     */
    this.namedRequests = {}
  };

  /**
   * Send a request with options defined by name
   *
   * @param {string} requestOptions name of request
   * @param {requestCallback|requestCallback[]} callbacks A callback or a chain of callbacks (one-by-one called)
   * @memberof RedPanda
   */
  /**
   * Send a request with options
   *
   * @param {object} requestOptions options of request, method is 'GET' by default
   * @param {requestCallback|requestCallback[]} callbacks A callback or a chain of callbacks (one-by-one called)
   * @memberof RedPanda
   */
  /**
   * Send a bulk of request one by one
   *
   * @param {mixed} requestOptions
   * @param {boolean} isChained If true, next request in queue will only be called
   *  when a response has been received from previous one
   * @memberof RedPanda
   */
  send (requestOptions, callbacks) {};

  name (requestName, requestOptions) {};

  listen (requestOptions, callbacks) {};

  option () {};
};

export default RedPanda
