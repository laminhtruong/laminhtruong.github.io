import { i as isAddress, I as InvalidAddressError } from './isAddress-BUhRlNtM.js';

function isAddressEqual(a, b) {
  if (!isAddress(a, {
    strict: false
  })) throw new InvalidAddressError({
    address: a
  });
  if (!isAddress(b, {
    strict: false
  })) throw new InvalidAddressError({
    address: b
  });
  return a.toLowerCase() === b.toLowerCase();
}

export { isAddressEqual as i };
