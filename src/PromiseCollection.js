/**
 * A collection of promises
 *
 * Stack the same-level promises produced during RedPanda fetching processes
 * Have useful methods like `then`, `catch` to attached a callback to all
 * promises stacked inside
 *
 * @class PromiseCollection
 * @param {Promise[]} promises
 *
 * @property {Promise[]} items
 */
class PromiseCollection {
  constructor (promises) {
    this.items = promises
  }

  /**
   * Get a promise in this collection by index
   *
   * @param {integer} index
   * @return {Promise}
   */
  get (index) {
    if (this.items[index] instanceof Promise || this.items[index] instanceof PromiseCollection) {
      return this.items[index]
    }

    return Promise.reject(new Error('[RedPanda PromiseCollection] No promise found for index ' + index))
  };

  /**
   * Get number of promises in this collection
   *
   * @return {integer}
   */
  count () {
    return this.items.length
  };

  /**
   * Get first promise in this collection
   *
   * @return {Promise|PromiseCollection}
   */
  first () {
    return this.get(0)
  };

  /**
   * Get last promise in this collection
   *
   * @return {Promise|PromiseCollection}
   */
  last () {
    return this.get(this.count() - 1)
  };

  /**
   * Get a single Promise that resolves when all promises inside
   * this collection has resolved
   *
   * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
   * @return {Promise}
   */
  all () {
    // Nested PromiseCollection converted to Promise.all instead
    return Promise.all(this.items.map((item) => item instanceof PromiseCollection ? item.all() : item))
  };

  /**
   * Attach a success callback (onResolved) to all promises inside this collection
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
   * @param {Function} fn
   * @return {this}
   */
  then (fn) {
    this.items = this.items.map((promise) => promise.then(fn))
    return this
  };

  /**
   * Attach a failure callback (onRejected) to all promises inside this collection
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
   * @param {Function} fn
   * @return {this}
   */
  catch (fn) {
    this.items = this.items.map((promise) => promise.catch(fn))
    return this
  };
}

export default PromiseCollection
