/**
 * @class Collection
 * @param {array} promises
 *
 * @property {array} items
 */
class Collection {
  constructor(promises) {
    this.items = promises
  }

  /**
   * Get a promise in this collection by index
   *
   * @param {integer} index
   * @return {Promise}
   */
  get (index) {
    if (typeof index === 'undefined' || !(this.items[index] instanceof Promise)) {
      return Promise.reject(new Error('[RedPanda PromiseCollection] No promise found for index ' + index))
    }

    return this.items[index]
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
   * @return {Promise}
   */
  first () {
    return this.get(0)
  };

  /**
   * Get last promise in this collection
   *
   * @return {Promise}
   */
  last () {
    return this.get(this.count() - 1)
  };
}

export default Collection
