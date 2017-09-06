import Registry from './Registry'
import PromiseCollection from './PromiseCollection'
import RequestSequence from './RequestSequence'

/**
 * The RedPanda Api Center
 *
 * @example var net = new RedPanda()
 */
class RedPanda {
  constructor () {
    // private
    let reg = new Registry()

    /**
     * Get request options
     *
     * @param {string|array|object} key
     * @return {array}
     */
    this.get = (key) => reg.get(key)

    /**
     * Name a request by options or an array of request options
     *
     * @param {string} key option name
     * @param {string|object|array|RequestSequence} value option value, multi-dimensional array allowed
     * @return {this}
     */
    this.set = (key, value) => {
      reg.set(key, value)
      return this
    }

    /**
     * Flatten multi-level request stacks passed in
     *
     * @param {mixed} options
     * @return {object[]}
     */
    this.flatten = (options) => reg.flatten(options)
  };

  /**
   * Send a request with options defined by name, parallelly for sequentially (if item is a RequestSequence)
   *
   * @param {string|object|array} requestOptions
   *  <p>If a string provided, it is name of request that defined.</p>
   *  <p>If an object provided, it is options of request, method is 'GET' by default.<</p>
   *  <p>If an array provided, it is an array of request options or request name.</p>
   *
   * @example net.send('requestName').then(...)
   * @example net.send({url: 'http://example.com'}).then(...)
   * @example net.send(['request1', 'request2', {url: 'http://example.com'}]).then(...)
   * @example net.send(['request1', net.sequence(['request1', 'request2'])]).then(...)
   *
   * @return {PromiseCollection}
   */
  send (requestOptions) {
    let promises = this.flatten(requestOptions).map((option) =>
      option instanceof Promise // use for customizing send
        ? option // return the Promise-self
        : option instanceof RequestSequence
          ? (new RequestSequence(option.items, this)).start() // start a sequence
          : fetch(option.url, option) // send simple request
    )

    return new PromiseCollection(promises)
  };

  /**
   * Create a request sequence to be used for .send method
   *
   * @param {string|object|array} requestOptions
   *  <p>If a string provided, it is name of request that defined.</p>
   *  <p>If an object provided, it is options of request, method is 'GET' by default.<</p>
   *  <p>If an array provided, it is an array of request options or request name.</p>
   *
   * @return {RequestSequence}
   */
  sequence (requestOptions) {
    return new RequestSequence(this.flatten(requestOptions), this)
  };

  /**
   * Static alias for {@link #send}
   *
   * @example RedPanda.send({url: 'http://example.com'}).then(...)
   *
   * @name RedPanda.send
   * @static
   * @return {PromiseCollection}
   */
  static send (requestOptions) {
    return (new RedPanda()).send(requestOptions)
  };

  /**
   * Static alias for {@link #sequence}
   *
   * @static
   * @name RedPanda.sequence
   * @return {RequestSequence}
   */
  static sequence (requestOptions) {
    return (new RedPanda()).sequence(requestOptions)
  };
};

export default RedPanda
