class Queue {
  constructor(items) {
    this.items = items
  };

  map(fn) {
    return this.items.map(fn)
  };
}

export default Queue
