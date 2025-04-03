import { B as BaseError } from './base-CC-Hj7CW.js';
import { s as stringToBytes } from './toBytes-rCiiThej.js';
import { k as keccak256 } from './keccak256-B1CwQAsk.js';

class InvalidAddressError extends BaseError {
  constructor({
    address
  }) {
    super(`Address "${address}" is invalid.`, {
      metaMessages: ['- Address must be a hex value of 20 bytes (40 hex characters).', '- Address must match its checksum counterpart.'],
      name: 'InvalidAddressError'
    });
  }
}

/**
 * Map with a LRU (Least recently used) policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */
class LruMap extends Map {
  constructor(size) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxSize = size;
  }
  get(key) {
    const value = super.get(key);
    if (super.has(key) && value !== undefined) {
      this.delete(key);
      super.set(key, value);
    }
    return value;
  }
  set(key, value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize) {
      const firstKey = this.keys().next().value;
      if (firstKey) this.delete(firstKey);
    }
    return this;
  }
}

const checksumAddressCache = /*#__PURE__*/new LruMap(8192);
function checksumAddress(address_,
/**
 * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
 * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
 * that relies on EIP-55 checksum encoding (checksum without chainId).
 *
 * It is highly recommended to not use this feature unless you
 * know what you are doing.
 *
 * See more: https://github.com/ethereum/EIPs/issues/1121
 */
chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`)) return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash = keccak256(stringToBytes(hexAddress), 'bytes');
  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split('');
  for (let i = 0; i < 40; i += 2) {
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  const result = `0x${address.join('')}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
function getAddress(address,
/**
 * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
 * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
 * that relies on EIP-55 checksum encoding (checksum without chainId).
 *
 * It is highly recommended to not use this feature unless you
 * know what you are doing.
 *
 * See more: https://github.com/ethereum/EIPs/issues/1121
 */
chainId) {
  if (!isAddress(address, {
    strict: false
  })) throw new InvalidAddressError({
    address
  });
  return checksumAddress(address, chainId);
}

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
/** @internal */
const isAddressCache = /*#__PURE__*/new LruMap(8192);
function isAddress(address, options) {
  const {
    strict = true
  } = options ?? {};
  const cacheKey = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey)) return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address)) return false;
    if (address.toLowerCase() === address) return true;
    if (strict) return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}

export { InvalidAddressError as I, LruMap as L, checksumAddress as c, getAddress as g, isAddress as i };
