// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Deferred {
  promise;
  _state = "unresolved";
  _resolve;
  _reject;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  get state() {
    return this._state;
  }
  resolve = value => {
    if (this._state === "unresolved") {
      this._state = "resolved";
      this._resolve(value);
    }
  };
  reject = error => {
    if (this._state === "unresolved") {
      this._state = "rejected";
      this._reject(error);
    }
  };
}

export { Deferred };
