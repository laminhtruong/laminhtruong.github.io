const requestList = {};
const handler = {
  get(target, property) {
    return Reflect.get(target, property);
  },
  set(target, property, value) {
    const isExist = property in target;
    const isDeletion = value === undefined;
    if (isExist && isDeletion) {
      return Reflect.deleteProperty(target, property);
    }
    if (isExist) {
      target[property]?.abort?.();
    }
    if (value instanceof AbortController) {
      return Reflect.set(target, property, value);
    }
    return true;
  }
};
const requestController = new Proxy(requestList, handler);

export { requestController };
