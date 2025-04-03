function number(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}
// copied from utils
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array';
}
function bytes(b, ...lengths) {
  if (!isBytes(b)) throw new Error('Uint8Array expected');
  if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function hash(h) {
  if (typeof h !== 'function' || typeof h.create !== 'function') throw new Error('Hash should be wrapped by utils.wrapConstructor');
  number(h.outputLen);
  number(h.blockLen);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed) throw new Error('Hash instance has been destroyed');
  if (checkFinished && instance.finished) throw new Error('Hash#digest() has already been called');
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}

const crypto = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
const u32 = arr => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
// Cast array to view
const createView = arr => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => word << 32 - shift | word >>> shift;
const isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
// The byte swap operation for uint32
const byteSwap = word => word << 24 & 0xff000000 | word << 8 & 0xff0000 | word >>> 8 & 0xff00 | word >>> 24 & 0xff;
// In place byte swap for Uint32Array
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
  if (typeof str !== 'string') throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
  if (typeof data === 'string') data = utf8ToBytes(data);
  bytes(data);
  return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    bytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
// For runtime check if class implements interface
class Hash {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function wrapConstructor(hashCons) {
  const hashC = msg => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  // Legacy Node.js compatibility
  if (crypto && typeof crypto.randomBytes === 'function') {
    return crypto.randomBytes(bytesLength);
  }
  throw new Error('crypto.getRandomValues must be defined');
}

export { Hash as H, bytes as a, byteSwap32 as b, createView as c, concatBytes as d, exists as e, randomBytes as f, hash as h, isLE as i, number as n, output as o, rotr as r, toBytes as t, u32 as u, wrapConstructor as w };
