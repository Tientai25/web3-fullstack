class Cache {
  constructor() { this.events = []; this.value = null; }
  pushEvent(e) {
    this.events.unshift(e);
    this.events = this.events.slice(0, 100);
  }
}
export default new Cache();
