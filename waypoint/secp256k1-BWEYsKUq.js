import { s as sha256 } from './sha256-E5MvF2nn.js';
import { H as Hash, h as hash, t as toBytes, e as exists, a as bytes, d as concatBytes$1, f as randomBytes } from './utils-CKEBUnDS.js';

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// 100 lines of code in the file are duplicated from noble-hashes (utils).
// This is OK: `abstract` directory does not use noble-hashes.
// User may opt-in into using different hashing library. This way, noble-hashes
// won't be included into their bundle.
const _0n$3 = /* @__PURE__ */BigInt(0);
const _1n$4 = /* @__PURE__ */BigInt(1);
const _2n$2 = /* @__PURE__ */BigInt(2);
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array';
}
function abytes(item) {
  if (!isBytes(item)) throw new Error('Uint8Array expected');
}
function abool(title, value) {
  if (typeof value !== 'boolean') throw new Error(`${title} must be valid boolean, got "${value}".`);
}
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */Array.from({
  length: 256
}, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
  abytes(bytes);
  // pre-caching improves the speed 6x
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
  // Big Endian
  return BigInt(hex === '' ? '0' : `0x${hex}`);
}
// We use optimized technique to convert hex string to byte array
const asciis = {
  _0: 48,
  _9: 57,
  _A: 65,
  _F: 70,
  _a: 97,
  _f: 102
};
function asciiToBase16(char) {
  if (char >= asciis._0 && char <= asciis._9) return char - asciis._0;
  if (char >= asciis._A && char <= asciis._F) return char - (asciis._A - 10);
  if (char >= asciis._a && char <= asciis._f) return char - (asciis._a - 10);
  return;
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
  if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2) throw new Error('padded hex string expected, got unpadded hex of length ' + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === undefined || n2 === undefined) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
// BE: Big Endian, LE: Little Endian
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  abytes(bytes);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, '0'));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
// Unpadded, rarely used
function numberToVarBytesBE(n) {
  return hexToBytes(numberToHexUnpadded(n));
}
/**
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'private key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === 'string') {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
    }
  } else if (isBytes(hex)) {
    // Uint8Array.from() instead of hash.slice() because node.js Buffer
    // is instance of Uint8Array, and its slice() creates **mutable** copy
    res = Uint8Array.from(hex);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === 'number' && len !== expectedLength) throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
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
// Compares 2 u8a-s in kinda constant time
function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
  if (typeof str !== 'string') throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
// Is positive bigint
const isPosBig = n => typeof n === 'bigint' && _0n$3 <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
 * Asserts min <= n < max. NOTE: It's < max and not <= max.
 * @example
 * aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
 */
function aInRange(title, n, min, max) {
  // Why min <= n < max and not a (min < n < max) OR b (min <= n <= max)?
  // consider P=256n, min=0n, max=P
  // - a for min=0 would require -1:          `inRange('x', x, -1n, P)`
  // - b would commonly require subtraction:  `inRange('x', x, 0n, P - 1n)`
  // - our way is the cleanest:               `inRange('x', x, 0n, P)
  if (!inRange(n, min, max)) throw new Error(`expected valid ${title}: ${min} <= n < ${max}, got ${typeof n} ${n}`);
}
// Bit operations
/**
 * Calculates amount of bits in a bigint.
 * Same as `n.toString(2).length`
 */
function bitLen(n) {
  let len;
  for (len = 0; n > _0n$3; n >>= _1n$4, len += 1);
  return len;
}
/**
 * Gets single bit at position.
 * NOTE: first bit position is 0 (same as arrays)
 * Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
 */
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n$4;
}
/**
 * Sets single bit at position.
 */
function bitSet(n, pos, value) {
  return n | (value ? _1n$4 : _0n$3) << BigInt(pos);
}
/**
 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
 */
const bitMask = n => (_2n$2 << BigInt(n - 1)) - _1n$4;
// DRBG
const u8n = data => new Uint8Array(data); // creates Uint8Array
const u8fr = arr => Uint8Array.from(arr); // another shortcut
/**
 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
 * @returns function that will call DRBG until 2nd arg returns something meaningful
 * @example
 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
 */
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== 'number' || hashLen < 2) throw new Error('hashLen must be a number');
  if (typeof qByteLen !== 'number' || qByteLen < 2) throw new Error('qByteLen must be a number');
  if (typeof hmacFn !== 'function') throw new Error('hmacFn must be a function');
  // Step B, Step C: set hashLen to 8*ceil(hlen/8)
  let v = u8n(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
  let k = u8n(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
  let i = 0; // Iterations counter, will throw when over 1000
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
  const reseed = (seed = u8n()) => {
    // HMAC-DRBG reseed() function. Steps D-G
    k = h(u8fr([0x00]), seed); // k = hmac(k || v || 0x00 || seed)
    v = h(); // v = hmac(k || v)
    if (seed.length === 0) return;
    k = h(u8fr([0x01]), seed); // k = hmac(k || v || 0x01 || seed)
    v = h(); // v = hmac(k || v)
  };
  const gen = () => {
    // HMAC-DRBG generate() function
    if (i++ >= 1000) throw new Error('drbg: tried 1000 values');
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed); // Steps D-G
    let res = undefined; // Step H: grind until k is in [1..n-1]
    while (!(res = pred(gen()))) reseed();
    reset();
    return res;
  };
  return genUntil;
}
// Validating curves and fields
const validatorFns = {
  bigint: val => typeof val === 'bigint',
  function: val => typeof val === 'function',
  boolean: val => typeof val === 'boolean',
  string: val => typeof val === 'string',
  stringOrUint8Array: val => typeof val === 'string' || isBytes(val),
  isSafeInteger: val => Number.isSafeInteger(val),
  array: val => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: val => typeof val === 'function' && Number.isSafeInteger(val.outputLen)
};
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== 'function') throw new Error(`Invalid validator "${type}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === undefined) return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
    }
  };
  for (const [fieldName, type] of Object.entries(validators)) checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators)) checkField(fieldName, type, true);
  return object;
}
// validate type tests
// const o: { a: number; b: number; c: number } = { a: 1, b: 5, c: 6 };
// const z0 = validateObject(o, { a: 'isSafeInteger' }, { c: 'bigint' }); // Ok!
// // Should fail type-check
// const z1 = validateObject(o, { a: 'tmp' }, { c: 'zz' });
// const z2 = validateObject(o, { a: 'isSafeInteger' }, { c: 'zz' });
// const z3 = validateObject(o, { test: 'boolean', z: 'bug' });
// const z4 = validateObject(o, { a: 'boolean', z: 'bug' });
/**
 * throws not implemented error
 */
const notImplemented = () => {
  throw new Error('not implemented');
};
/**
 * Memoizes (caches) computation result.
 * Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
 */
function memoized(fn) {
  const map = new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== undefined) return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}

var ut = /*#__PURE__*/Object.freeze({
    __proto__: null,
    aInRange: aInRange,
    abool: abool,
    abytes: abytes,
    bitGet: bitGet,
    bitLen: bitLen,
    bitMask: bitMask,
    bitSet: bitSet,
    bytesToHex: bytesToHex,
    bytesToNumberBE: bytesToNumberBE,
    bytesToNumberLE: bytesToNumberLE,
    concatBytes: concatBytes,
    createHmacDrbg: createHmacDrbg,
    ensureBytes: ensureBytes,
    equalBytes: equalBytes,
    hexToBytes: hexToBytes,
    hexToNumber: hexToNumber,
    inRange: inRange,
    isBytes: isBytes,
    memoized: memoized,
    notImplemented: notImplemented,
    numberToBytesBE: numberToBytesBE,
    numberToBytesLE: numberToBytesLE,
    numberToHexUnpadded: numberToHexUnpadded,
    numberToVarBytesBE: numberToVarBytesBE,
    utf8ToBytes: utf8ToBytes,
    validateObject: validateObject
});

// HMAC (RFC 2104)
class HMAC extends Hash {
  constructor(hash$1, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash$1);
    const key = toBytes(_key);
    this.iHash = hash$1.create();
    if (typeof this.iHash.update !== 'function') throw new Error('Expected instance of class which extends utils.Hash');
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    // blockLen can be bigger than outputLen
    pad.set(key.length > blockLen ? hash$1.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++) pad[i] ^= 0x36;
    this.iHash.update(pad);
    // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
    this.oHash = hash$1.create();
    // Undo internal XOR && apply outer XOR
    for (let i = 0; i < pad.length; i++) pad[i] ^= 0x36 ^ 0x5c;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    // Create new instance without calling constructor since key already in state and we don't know it.
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const {
      oHash,
      iHash,
      finished,
      destroyed,
      blockLen,
      outputLen
    } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
}
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 * @example
 * import { hmac } from '@noble/hashes/hmac';
 * import { sha256 } from '@noble/hashes/sha2';
 * const mac1 = hmac(sha256, 'key', 'message');
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Utilities for modular arithmetics and finite fields
// prettier-ignore
const _0n$2 = BigInt(0),
  _1n$3 = BigInt(1),
  _2n$1 = BigInt(2),
  _3n$1 = BigInt(3);
// prettier-ignore
const _4n = BigInt(4),
  _5n = BigInt(5),
  _8n = BigInt(8);
// prettier-ignore
BigInt(9);
  BigInt(16);
// Calculates a modulo b
function mod(a, b) {
  const result = a % b;
  return result >= _0n$2 ? result : b + result;
}
/**
 * Efficiently raise num to power and do modular division.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 * @example
 * pow(2n, 6n, 11n) // 64n % 11n == 9n
 */
// TODO: use field version && remove
function pow(num, power, modulo) {
  if (modulo <= _0n$2 || power < _0n$2) throw new Error('Expected power/modulo > 0');
  if (modulo === _1n$3) return _0n$2;
  let res = _1n$3;
  while (power > _0n$2) {
    if (power & _1n$3) res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n$3;
  }
  return res;
}
// Does x ^ (2 ^ power) mod p. pow2(30, 4) == 30 ^ (2 ^ 4)
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n$2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
// Inverses number over modulo
function invert(number, modulo) {
  if (number === _0n$2 || modulo <= _0n$2) {
    throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
  }
  // Euclidean GCD https://brilliant.org/wiki/extended-euclidean-algorithm/
  // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
  let a = mod(number, modulo);
  let b = modulo;
  // prettier-ignore
  let x = _0n$2,
    u = _1n$3;
  while (a !== _0n$2) {
    // JIT applies optimization if those two lines follow each other
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    // prettier-ignore
    b = a, a = r, x = u, u = m;
  }
  const gcd = b;
  if (gcd !== _1n$3) throw new Error('invert: does not exist');
  return mod(x, modulo);
}
/**
 * Tonelli-Shanks square root search algorithm.
 * 1. https://eprint.iacr.org/2012/685.pdf (page 12)
 * 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
 * Will start an infinite loop if field order P is not prime.
 * @param P field order
 * @returns function that takes field Fp (created from P) and number n
 */
function tonelliShanks(P) {
  // Legendre constant: used to calculate Legendre symbol (a | p),
  // which denotes the value of a^((p-1)/2) (mod p).
  // (a | p) ≡ 1    if a is a square (mod p)
  // (a | p) ≡ -1   if a is not a square (mod p)
  // (a | p) ≡ 0    if a ≡ 0 (mod p)
  const legendreC = (P - _1n$3) / _2n$1;
  let Q, S, Z;
  // Step 1: By factoring out powers of 2 from p - 1,
  // find q and s such that p - 1 = q*(2^s) with q odd
  for (Q = P - _1n$3, S = 0; Q % _2n$1 === _0n$2; Q /= _2n$1, S++);
  // Step 2: Select a non-square z such that (z | p) ≡ -1 and set c ≡ zq
  for (Z = _2n$1; Z < P && pow(Z, legendreC, P) !== P - _1n$3; Z++);
  // Fast-path
  if (S === 1) {
    const p1div4 = (P + _1n$3) / _4n;
    return function tonelliFast(Fp, n) {
      const root = Fp.pow(n, p1div4);
      if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
      return root;
    };
  }
  // Slow-path
  const Q1div2 = (Q + _1n$3) / _2n$1;
  return function tonelliSlow(Fp, n) {
    // Step 0: Check that n is indeed a square: (n | p) should not be ≡ -1
    if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE)) throw new Error('Cannot find square root');
    let r = S;
    // TODO: will fail at Fp2/etc
    let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q); // will update both x and b
    let x = Fp.pow(n, Q1div2); // first guess at the square root
    let b = Fp.pow(n, Q); // first guess at the fudge factor
    while (!Fp.eql(b, Fp.ONE)) {
      if (Fp.eql(b, Fp.ZERO)) return Fp.ZERO; // https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm (4. If t = 0, return r = 0)
      // Find m such b^(2^m)==1
      let m = 1;
      for (let t2 = Fp.sqr(b); m < r; m++) {
        if (Fp.eql(t2, Fp.ONE)) break;
        t2 = Fp.sqr(t2); // t2 *= t2
      }
      // NOTE: r-m-1 can be bigger than 32, need to convert to bigint before shift, otherwise there will be overflow
      const ge = Fp.pow(g, _1n$3 << BigInt(r - m - 1)); // ge = 2^(r-m-1)
      g = Fp.sqr(ge); // g = ge * ge
      x = Fp.mul(x, ge); // x *= ge
      b = Fp.mul(b, g); // b *= g
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  // NOTE: different algorithms can give different roots, it is up to user to decide which one they want.
  // For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
  // P ≡ 3 (mod 4)
  // √n = n^((P+1)/4)
  if (P % _4n === _3n$1) {
    // Not all roots possible!
    // const ORDER =
    //   0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
    // const NUM = 72057594037927816n;
    const p1div4 = (P + _1n$3) / _4n;
    return function sqrt3mod4(Fp, n) {
      const root = Fp.pow(n, p1div4);
      // Throw if root**2 != n
      if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
      return root;
    };
  }
  // Atkin algorithm for q ≡ 5 (mod 8), https://eprint.iacr.org/2012/685.pdf (page 10)
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return function sqrt5mod8(Fp, n) {
      const n2 = Fp.mul(n, _2n$1);
      const v = Fp.pow(n2, c1);
      const nv = Fp.mul(n, v);
      const i = Fp.mul(Fp.mul(nv, _2n$1), v);
      const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
      if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
      return root;
    };
  }
  // Other cases: Tonelli-Shanks algorithm
  return tonelliShanks(P);
}
// prettier-ignore
const FIELD_FIELDS = ['create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr', 'eql', 'add', 'sub', 'mul', 'pow', 'div', 'addN', 'subN', 'mulN', 'sqrN'];
function validateField(field) {
  const initial = {
    ORDER: 'bigint',
    MASK: 'bigint',
    BYTES: 'isSafeInteger',
    BITS: 'isSafeInteger'
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = 'function';
    return map;
  }, initial);
  return validateObject(field, opts);
}
// Generic field functions
/**
 * Same as `pow` but for Fp: non-constant-time.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 */
function FpPow(f, num, power) {
  // Should have same speed as pow for bigints
  // TODO: benchmark!
  if (power < _0n$2) throw new Error('Expected power > 0');
  if (power === _0n$2) return f.ONE;
  if (power === _1n$3) return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n$2) {
    if (power & _1n$3) p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n$3;
  }
  return p;
}
/**
 * Efficiently invert an array of Field elements.
 * `inv(0)` will return `undefined` here: make sure to throw an error.
 */
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  // Walk from first to last, multiply them by each other MOD p
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num)) return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  // Invert last element
  const inverted = f.inv(lastMultiplied);
  // Walk from last to first, multiply them by inverted each other MOD p
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num)) return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
// CURVE.n lengths
function nLength(n, nBitLength) {
  // Bit size, byte size of CURVE.n
  const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return {
    nBitLength: _nBitLength,
    nByteLength
  };
}
/**
 * Initializes a finite field over prime. **Non-primes are not supported.**
 * Do not init in loop: slow. Very fragile: always run a benchmark on a change.
 * Major performance optimizations:
 * * a) denormalized operations like mulN instead of mul
 * * b) same object shape: never add or remove keys
 * * c) Object.freeze
 * NOTE: operations don't check 'isValid' for all elements for performance reasons,
 * it is caller responsibility to check this.
 * This is low-level code, please make sure you know what you doing.
 * @param ORDER prime positive bigint
 * @param bitLen how many bits the field consumes
 * @param isLE (def: false) if encoding / decoding should be in little-endian
 * @param redef optional faster redefinitions of sqrt and other methods
 */
function Field(ORDER, bitLen, isLE = false, redef = {}) {
  if (ORDER <= _0n$2) throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const {
    nBitLength: BITS,
    nByteLength: BYTES
  } = nLength(ORDER, bitLen);
  if (BYTES > 2048) throw new Error('Field lengths over 2048 bytes are not supported');
  const sqrtP = FpSqrt(ORDER);
  const f = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n$2,
    ONE: _1n$3,
    create: num => mod(num, ORDER),
    isValid: num => {
      if (typeof num !== 'bigint') throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n$2 <= num && num < ORDER; // 0 is valid element, but it's not invertible
    },
    is0: num => num === _0n$2,
    isOdd: num => (num & _1n$3) === _1n$3,
    neg: num => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: num => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: num => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: num => invert(num, ORDER),
    sqrt: redef.sqrt || (n => sqrtP(f, n)),
    invertBatch: lst => FpInvertBatch(f, lst),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, b, c) => c ? b : a,
    toBytes: num => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: bytes => {
      if (bytes.length !== BYTES) throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes.length}`);
      return isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    }
  });
  return Object.freeze(f);
}
/**
 * Returns total number of bytes consumed by the field element.
 * For example, 32 bytes for usual 256-bit weierstrass curve.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of field
 */
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== 'bigint') throw new Error('field order must be bigint');
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
/**
 * Returns minimal amount of bytes that can be safely reduced
 * by field order.
 * Should be 2^-128 for 128-bit curve such as P256.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of target hash
 */
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
/**
 * "Constant-time" private key generation utility.
 * Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
 * and convert them into private scalar, with the modulo bias being negligible.
 * Needs at least 48 bytes of input for 32-byte private key.
 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
 * FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
 * RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
 * @param hash hash output from SHA3 or a similar function
 * @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
 * @param isLE interpret hash bytes as LE num
 * @returns valid private scalar
 */
function mapHashToField(key, fieldOrder, isLE = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  // No small numbers: need to understand bias story. No huge numbers: easier to detect JS timings.
  if (len < 16 || len < minLen || len > 1024) throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
  const num = isLE ? bytesToNumberBE(key) : bytesToNumberLE(key);
  // `mod(x, 11)` can sometimes produce 0. `mod(x, 10) + 1` is the same, but no 0
  const reduced = mod(num, fieldOrder - _1n$3) + _1n$3;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Abelian group utilities
const _0n$1 = BigInt(0);
const _1n$2 = BigInt(1);
// Since points in different groups cannot be equal (different object constructor),
// we can have single place to store precomputes
const pointPrecomputes = new WeakMap();
const pointWindowSizes = new WeakMap(); // This allows use make points immutable (nothing changes inside)
// Elliptic curve multiplication of Point by scalar. Fragile.
// Scalars should always be less than curve order: this should be checked inside of a curve itself.
// Creates precomputation tables for fast multiplication:
// - private scalar is split by fixed size windows of W bits
// - every window point is collected from window's table & added to accumulator
// - since windows are different, same point inside tables won't be accessed more than once per calc
// - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
// - +1 window is neccessary for wNAF
// - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
// TODO: Research returning 2d JS array of windows, instead of a single window. This would allow
// windows to be in different memory locations
function wNAF(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const validateW = W => {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error(`Wrong window size=${W}, should be [1..${bits}]`);
  };
  const opts = W => {
    validateW(W);
    const windows = Math.ceil(bits / W) + 1; // +1, because
    const windowSize = 2 ** (W - 1); // -1 because we skip zero
    return {
      windows,
      windowSize
    };
  };
  return {
    constTimeNegate,
    // non-const time multiplication ladder
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n$1) {
        if (n & _1n$2) p = p.add(d);
        d = d.double();
        n >>= _1n$2;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const {
        windows,
        windowSize
      } = opts(W);
      const points = [];
      let p = elm;
      let base = p;
      for (let window = 0; window < windows; window++) {
        base = p;
        points.push(base);
        // =1, because we skip zero
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      // TODO: maybe check that scalar is less than group order? wNAF behavious is undefined otherwise
      // But need to carefully remove other checks before wNAF. ORDER == bits here
      const {
        windows,
        windowSize
      } = opts(W);
      let p = c.ZERO;
      let f = c.BASE;
      const mask = BigInt(2 ** W - 1); // Create mask with W ones: 0b1111 for W=4 etc.
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize;
        // Extract W bits.
        let wbits = Number(n & mask);
        // Shift number by W bits.
        n >>= shiftBy;
        // If the bits are bigger than max size, we'll split those.
        // +224 => 256 - 32
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n$2;
        }
        // This code was first written with assumption that 'f' and 'p' will never be infinity point:
        // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
        // there is negate now: it is possible that negated element from low value
        // would be the same as high element, which will create carry into next window.
        // It's not obvious how this can fail, but still worth investigating later.
        // Check if we're onto Zero point.
        // Add random point inside current window to f.
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1; // -1 because we skip zero
        const cond1 = window % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          // The most important part for const-time getPublicKey
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      // JIT-compiler should not eliminate f here, since it will later be used in normalizeZ()
      // Even if the variable is still unused, there are some checks which will
      // throw an exception, so compiler needs to prove they won't happen, which is hard.
      // At this point there is a way to F be infinity-point even if p is not,
      // which makes it less const-time: around 1 bigint multiply.
      return {
        p,
        f
      };
    },
    wNAFCached(P, n, transform) {
      const W = pointWindowSizes.get(P) || 1;
      // Calculate precomputes on a first run, reuse them after
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) pointPrecomputes.set(P, transform(comp));
      }
      return this.wNAF(W, comp, n);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
/**
 * Pippenger algorithm for multi-scalar multiplication (MSM).
 * MSM is basically (Pa + Qb + Rc + ...).
 * 30x faster vs naive addition on L=4096, 10x faster with precomputes.
 * For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
 * Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
 * @param c Curve Point constructor
 * @param field field over CURVE.N - important that it's not over CURVE.P
 * @param points array of L curve points
 * @param scalars array of L scalars (aka private keys / bigints)
 */
function pippenger(c, field, points, scalars) {
  // If we split scalars by some window (let's say 8 bits), every chunk will only
  // take 256 buckets even if there are 4096 scalars, also re-uses double.
  // TODO:
  // - https://eprint.iacr.org/2024/750.pdf
  // - https://tches.iacr.org/index.php/TCHES/article/view/10287
  // 0 is accepted in scalars
  if (!Array.isArray(points) || !Array.isArray(scalars) || scalars.length !== points.length) throw new Error('arrays of points and scalars must have equal length');
  scalars.forEach((s, i) => {
    if (!field.isValid(s)) throw new Error(`wrong scalar at index ${i}`);
  });
  points.forEach((p, i) => {
    if (!(p instanceof c)) throw new Error(`wrong point at index ${i}`);
  });
  const wbits = bitLen(BigInt(points.length));
  const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1; // in bits
  const MASK = (1 << windowSize) - 1;
  const buckets = new Array(MASK + 1).fill(c.ZERO); // +1 for zero array
  const lastBits = Math.floor((field.BITS - 1) / windowSize) * windowSize;
  let sum = c.ZERO;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(c.ZERO);
    for (let j = 0; j < scalars.length; j++) {
      const scalar = scalars[j];
      const wbits = Number(scalar >> BigInt(i) & BigInt(MASK));
      buckets[wbits] = buckets[wbits].add(points[j]);
    }
    let resI = c.ZERO; // not using this will do small speed-up, but will lose ct
    // Skip first bucket, because it is zero
    for (let j = buckets.length - 1, sumI = c.ZERO; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0) for (let j = 0; j < windowSize; j++) sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: 'bigint',
    h: 'bigint',
    Gx: 'field',
    Gy: 'field'
  }, {
    nBitLength: 'isSafeInteger',
    nByteLength: 'isSafeInteger'
  });
  // Set defaults
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{
      p: curve.Fp.ORDER
    }
  });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Short Weierstrass curve. The formula is: y² = x³ + ax + b
function validateSigVerOpts(opts) {
  if (opts.lowS !== undefined) abool('lowS', opts.lowS);
  if (opts.prehash !== undefined) abool('prehash', opts.prehash);
}
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: 'field',
    b: 'field'
  }, {
    allowedPrivateKeyLengths: 'array',
    wrapPrivateKey: 'boolean',
    isTorsionFree: 'function',
    clearCofactor: 'function',
    allowInfinityPoint: 'boolean',
    fromBytes: 'function',
    toBytes: 'function'
  });
  const {
    endo,
    Fp,
    a
  } = opts;
  if (endo) {
    if (!Fp.eql(a, Fp.ZERO)) {
      throw new Error('Endomorphism can only be defined for Koblitz curves that have a=0');
    }
    if (typeof endo !== 'object' || typeof endo.beta !== 'bigint' || typeof endo.splitScalar !== 'function') {
      throw new Error('Expected endomorphism with beta: bigint and splitScalar: function');
    }
  }
  return Object.freeze({
    ...opts
  });
}
const {
  bytesToNumberBE: b2n,
  hexToBytes: h2b
} = ut;
/**
 * ASN.1 DER encoding utilities. ASN is very complex & fragile. Format:
 *
 *     [0x30 (SEQUENCE), bytelength, 0x02 (INTEGER), intLength, R, 0x02 (INTEGER), intLength, S]
 *
 * Docs: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/, https://luca.ntop.org/Teaching/Appunti/asn1.html
 */
const DER = {
  // asn.1 DER encoding utils
  Err: class DERErr extends Error {
    constructor(m = '') {
      super(m);
    }
  },
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag, data) => {
      const {
        Err: E
      } = DER;
      if (tag < 0 || tag > 256) throw new E('tlv.encode: wrong tag');
      if (data.length & 1) throw new E('tlv.encode: unpadded data');
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128) throw new E('tlv.encode: long form length too big');
      // length of length with long form flag
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : '';
      return `${numberToHexUnpadded(tag)}${lenLen}${len}${data}`;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const {
        Err: E
      } = DER;
      let pos = 0;
      if (tag < 0 || tag > 256) throw new E('tlv.encode: wrong tag');
      if (data.length < 2 || data[pos++] !== tag) throw new E('tlv.decode: wrong tlv');
      const first = data[pos++];
      const isLong = !!(first & 128); // First bit of first length byte is flag for short/long form
      let length = 0;
      if (!isLong) length = first;else {
        // Long form: [longFlag(1bit), lengthLength(7bit), length (BE)]
        const lenLen = first & 127;
        if (!lenLen) throw new E('tlv.decode(long): indefinite length not supported');
        if (lenLen > 4) throw new E('tlv.decode(long): byte length is too big'); // this will overflow u32 in js
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen) throw new E('tlv.decode: length bytes not complete');
        if (lengthBytes[0] === 0) throw new E('tlv.decode(long): zero leftmost byte');
        for (const b of lengthBytes) length = length << 8 | b;
        pos += lenLen;
        if (length < 128) throw new E('tlv.decode(long): not minimal encoding');
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length) throw new E('tlv.decode: wrong value length');
      return {
        v,
        l: data.subarray(pos + length)
      };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num) {
      const {
        Err: E
      } = DER;
      if (num < _0n) throw new E('integer: negative integers are not allowed');
      let hex = numberToHexUnpadded(num);
      // Pad with zero byte if negative flag is present
      if (Number.parseInt(hex[0], 16) & 0b1000) hex = '00' + hex;
      if (hex.length & 1) throw new E('unexpected assertion');
      return hex;
    },
    decode(data) {
      const {
        Err: E
      } = DER;
      if (data[0] & 128) throw new E('Invalid signature integer: negative');
      if (data[0] === 0x00 && !(data[1] & 128)) throw new E('Invalid signature integer: unnecessary leading zero');
      return b2n(data);
    }
  },
  toSig(hex) {
    // parse DER signature
    const {
      Err: E,
      _int: int,
      _tlv: tlv
    } = DER;
    const data = typeof hex === 'string' ? h2b(hex) : hex;
    abytes(data);
    const {
      v: seqBytes,
      l: seqLeftBytes
    } = tlv.decode(0x30, data);
    if (seqLeftBytes.length) throw new E('Invalid signature: left bytes after parsing');
    const {
      v: rBytes,
      l: rLeftBytes
    } = tlv.decode(0x02, seqBytes);
    const {
      v: sBytes,
      l: sLeftBytes
    } = tlv.decode(0x02, rLeftBytes);
    if (sLeftBytes.length) throw new E('Invalid signature: left bytes after parsing');
    return {
      r: int.decode(rBytes),
      s: int.decode(sBytes)
    };
  },
  hexFromSig(sig) {
    const {
      _tlv: tlv,
      _int: int
    } = DER;
    const seq = `${tlv.encode(0x02, int.encode(sig.r))}${tlv.encode(0x02, int.encode(sig.s))}`;
    return tlv.encode(0x30, seq);
  }
};
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0),
  _1n$1 = BigInt(1);
  BigInt(2);
  const _3n = BigInt(3);
  BigInt(4);
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const {
    Fp
  } = CURVE; // All curves has same field / group length as for now, but they can differ
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const toBytes = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes(Uint8Array.from([0x04]), Fp.toBytes(a.x), Fp.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || (bytes => {
    // const head = bytes[0];
    const tail = bytes.subarray(1);
    // if (head !== 0x04) throw new Error('Only non-compressed encoding is supported');
    const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
    const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
    return {
      x,
      y
    };
  });
  /**
   * y² = x³ + ax + b: Short weierstrass curve formula
   * @returns y²
   */
  function weierstrassEquation(x) {
    const {
      a,
      b
    } = CURVE;
    const x2 = Fp.sqr(x); // x * x
    const x3 = Fp.mul(x2, x); // x2 * x
    return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x3 + a * x + b
  }
  // Validate whether the passed curve params are valid.
  // We check if curve equation works for generator point.
  // `assertValidity()` won't work: `isTorsionFree()` is not available at this point in bls12-381.
  // ProjectivePoint class has not been initialized yet.
  if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx))) throw new Error('bad generator point: equation left != right');
  // Valid group elements reside in range 1..n-1
  function isWithinCurveOrder(num) {
    return inRange(num, _1n$1, CURVE.n);
  }
  // Validates if priv key is valid and converts it to bigint.
  // Supports options allowedPrivateKeyLengths and wrapPrivateKey.
  function normPrivateKeyToScalar(key) {
    const {
      allowedPrivateKeyLengths: lengths,
      nByteLength,
      wrapPrivateKey,
      n: N
    } = CURVE;
    if (lengths && typeof key !== 'bigint') {
      if (isBytes(key)) key = bytesToHex(key);
      // Normalize to hex string, pad. E.g. P521 would norm 130-132 char hex to 132-char bytes
      if (typeof key !== 'string' || !lengths.includes(key.length)) throw new Error('Invalid key');
      key = key.padStart(nByteLength * 2, '0');
    }
    let num;
    try {
      num = typeof key === 'bigint' ? key : bytesToNumberBE(ensureBytes('private key', key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey) num = mod(num, N); // disabled by default, enabled for BLS
    aInRange('private key', num, _1n$1, N); // num in range [1..N-1]
    return num;
  }
  function assertPrjPoint(other) {
    if (!(other instanceof Point)) throw new Error('ProjectivePoint expected');
  }
  // Memoized toAffine / validity check. They are heavy. Points are immutable.
  // Converts Projective point to affine (x, y) coordinates.
  // Can accept precomputed Z^-1 - for example, from invertBatch.
  // (x, y, z) ∋ (x=x/z, y=y/z)
  const toAffineMemo = memoized((p, iz) => {
    const {
      px: x,
      py: y,
      pz: z
    } = p;
    // Fast-path for normalized points
    if (Fp.eql(z, Fp.ONE)) return {
      x,
      y
    };
    const is0 = p.is0();
    // If invZ was 0, we return zero point. However we still want to execute
    // all operations, so we replace invZ with a random number, 1.
    if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(z);
    const ax = Fp.mul(x, iz);
    const ay = Fp.mul(y, iz);
    const zz = Fp.mul(z, iz);
    if (is0) return {
      x: Fp.ZERO,
      y: Fp.ZERO
    };
    if (!Fp.eql(zz, Fp.ONE)) throw new Error('invZ was invalid');
    return {
      x: ax,
      y: ay
    };
  });
  // NOTE: on exception this will crash 'cached' and no value will be set.
  // Otherwise true will be return
  const assertValidMemo = memoized(p => {
    if (p.is0()) {
      // (0, 1, 0) aka ZERO is invalid in most contexts.
      // In BLS, ZERO can be serialized, so we allow it.
      // (0, 0, 0) is wrong representation of ZERO and is always invalid.
      if (CURVE.allowInfinityPoint && !Fp.is0(p.py)) return;
      throw new Error('bad point: ZERO');
    }
    // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
    const {
      x,
      y
    } = p.toAffine();
    // Check if x, y are valid field elements
    if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error('bad point: x or y not FE');
    const left = Fp.sqr(y); // y²
    const right = weierstrassEquation(x); // x³ + ax + b
    if (!Fp.eql(left, right)) throw new Error('bad point: equation left != right');
    if (!p.isTorsionFree()) throw new Error('bad point: not in prime-order subgroup');
    return true;
  });
  /**
   * Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
   * Default Point works in 2d / affine coordinates: (x, y)
   * We're doing calculations in projective, because its operations don't require costly inversion.
   */
  class Point {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp.isValid(px)) throw new Error('x required');
      if (py == null || !Fp.isValid(py)) throw new Error('y required');
      if (pz == null || !Fp.isValid(pz)) throw new Error('z required');
      Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const {
        x,
        y
      } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error('invalid affine point');
      if (p instanceof Point) throw new Error('projective point not allowed');
      const is0 = i => Fp.eql(i, Fp.ZERO);
      // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
      if (is0(x) && is0(y)) return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = Fp.invertBatch(points.map(p => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P = Point.fromAffine(fromBytes(ensureBytes('pointHex', hex)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const {
        y
      } = this.toAffine();
      if (Fp.isOdd) return !Fp.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      assertPrjPoint(other);
      const {
        px: X1,
        py: Y1,
        pz: Z1
      } = this;
      const {
        px: X2,
        py: Y2,
        pz: Z2
      } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point(this.px, Fp.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const {
        a,
        b
      } = CURVE;
      const b3 = Fp.mul(b, _3n);
      const {
        px: X1,
        py: Y1,
        pz: Z1
      } = this;
      let X3 = Fp.ZERO,
        Y3 = Fp.ZERO,
        Z3 = Fp.ZERO; // prettier-ignore
      let t0 = Fp.mul(X1, X1); // step 1
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3); // step 5
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3); // step 10
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3); // step 15
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0); // step 20
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1); // step 25
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3); // step 30
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      assertPrjPoint(other);
      const {
        px: X1,
        py: Y1,
        pz: Z1
      } = this;
      const {
        px: X2,
        py: Y2,
        pz: Z2
      } = other;
      let X3 = Fp.ZERO,
        Y3 = Fp.ZERO,
        Z3 = Fp.ZERO; // prettier-ignore
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n);
      let t0 = Fp.mul(X1, X2); // step 1
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2); // step 5
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2); // step 10
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2); // step 15
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2); // step 20
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0); // step 25
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2); // step 30
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4); // step 35
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0); // step 40
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      aInRange('scalar', sc, _0n, CURVE.n);
      const I = Point.ZERO;
      if (sc === _0n) return I;
      if (sc === _1n$1) return this;
      const {
        endo
      } = CURVE;
      if (!endo) return wnaf.unsafeLadder(this, sc);
      // Apply endomorphism
      let {
        k1neg,
        k1,
        k2neg,
        k2
      } = endo.splitScalar(sc);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n || k2 > _0n) {
        if (k1 & _1n$1) k1p = k1p.add(d);
        if (k2 & _1n$1) k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n$1;
        k2 >>= _1n$1;
      }
      if (k1neg) k1p = k1p.negate();
      if (k2neg) k2p = k2p.negate();
      k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const {
        endo,
        n: N
      } = CURVE;
      aInRange('scalar', scalar, _1n$1, N);
      let point, fake; // Fake point is used to const-time mult
      if (endo) {
        const {
          k1neg,
          k1,
          k2neg,
          k2
        } = endo.splitScalar(scalar);
        let {
          p: k1p,
          f: f1p
        } = this.wNAF(k1);
        let {
          p: k2p,
          f: f2p
        } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const {
          p,
          f
        } = this.wNAF(scalar);
        point = p;
        fake = f;
      }
      // Normalize `z` for both points, but return only real one
      return Point.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point.BASE; // No Strauss-Shamir trick: we have 10% faster G precomputes
      const mul = (P, a // Select faster multiply() method
      ) => a === _0n || a === _1n$1 || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? undefined : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const {
        h: cofactor,
        isTorsionFree
      } = CURVE;
      if (cofactor === _1n$1) return true; // No subgroups, always torsion-free
      if (isTorsionFree) return isTorsionFree(Point, this);
      throw new Error('isTorsionFree() has not been declared for the elliptic curve');
    }
    clearCofactor() {
      const {
        h: cofactor,
        clearCofactor
      } = CURVE;
      if (cofactor === _1n$1) return this; // Fast-path
      if (clearCofactor) return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool('isCompressed', isCompressed);
      this.assertValidity();
      return toBytes(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool('isCompressed', isCompressed);
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  // Validate if generator point is on curve
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: 'hash',
    hmac: 'function',
    randomBytes: 'function'
  }, {
    bits2int: 'function',
    bits2int_modN: 'function',
    lowS: 'boolean'
  });
  return Object.freeze({
    lowS: true,
    ...opts
  });
}
/**
 * Creates short weierstrass curve and ECDSA signature methods for it.
 * @example
 * import { Field } from '@noble/curves/abstract/modular';
 * // Before that, define BigInt-s: a, b, p, n, Gx, Gy
 * const curve = weierstrass({ a, b, Fp: Field(p), n, Gx, Gy, h: 1n })
 */
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const {
    Fp,
    n: CURVE_ORDER
  } = CURVE;
  const compressedLen = Fp.BYTES + 1; // e.g. 33 for 32
  const uncompressedLen = 2 * Fp.BYTES + 1; // e.g. 65 for 32
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const {
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp.toBytes(a.x);
      const cat = concatBytes;
      abool('isCompressed', isCompressed);
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 0x02 : 0x03]), x);
      } else {
        return cat(Uint8Array.from([0x04]), x, Fp.toBytes(a.y));
      }
    },
    fromBytes(bytes) {
      const len = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      // this.assertValidity() is done inside of fromHex
      if (len === compressedLen && (head === 0x02 || head === 0x03)) {
        const x = bytesToNumberBE(tail);
        if (!inRange(x, _1n$1, Fp.ORDER)) throw new Error('Point is not on curve');
        const y2 = weierstrassEquation(x); // y² = x³ + ax + b
        let y;
        try {
          y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ': ' + sqrtError.message : '';
          throw new Error('Point is not on curve' + suffix);
        }
        const isYOdd = (y & _1n$1) === _1n$1;
        // ECDSA
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd) y = Fp.neg(y);
        return {
          x,
          y
        };
      } else if (len === uncompressedLen && head === 0x04) {
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return {
          x,
          y
        };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = num => bytesToHex(numberToBytesBE(num, CURVE.nByteLength));
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n$1;
    return number > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  // slice bytes num
  const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
  /**
   * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
   */
  class Signature {
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const l = CURVE.nByteLength;
      hex = ensureBytes('compactSignature', hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const {
        r,
        s
      } = DER.toSig(ensureBytes('DER', hex));
      return new Signature(r, s);
    }
    assertValidity() {
      aInRange('r', this.r, _1n$1, CURVE_ORDER); // r in [1..N]
      aInRange('s', this.s, _1n$1, CURVE_ORDER); // s in [1..N]
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const {
        r,
        s,
        recovery: rec
      } = this;
      const h = bits2int_modN(ensureBytes('msgHash', msgHash)); // Truncate hash
      if (rec == null || ![0, 1, 2, 3].includes(rec)) throw new Error('recovery id invalid');
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp.ORDER) throw new Error('recovery id 2 or 3 invalid');
      const prefix = (rec & 1) === 0 ? '02' : '03';
      const R = Point.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj); // r^-1
      const u1 = modN(-h * ir); // -hr^-1
      const u2 = modN(s * ir); // sr^-1
      const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
      if (!Q) throw new Error('point at infinify'); // unsafe is fine: no priv data leaked
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig({
        r: this.r,
        s: this.s
      });
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar: normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3)); // 3 is arbitrary, just need any number here
      return point;
    }
  };
  /**
   * Computes public key for a private key. Checks for validity of the private key.
   * @param privateKey private key
   * @param isCompressed whether to return compact (default), or full key
   * @returns Public key, full when isCompressed=false; short when isCompressed=true
   */
  function getPublicKey(privateKey, isCompressed = true) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  /**
   * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
   */
  function isProbPub(item) {
    const arr = isBytes(item);
    const str = typeof item === 'string';
    const len = (arr || str) && item.length;
    if (arr) return len === compressedLen || len === uncompressedLen;
    if (str) return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point) return true;
    return false;
  }
  /**
   * ECDH (Elliptic Curve Diffie Hellman).
   * Computes shared public key from private key and public key.
   * Checks: 1) private key validity 2) shared key is on-curve.
   * Does NOT hash the result.
   * @param privateA private key
   * @param publicB different public key
   * @param isCompressed whether to return compact (default), or full key
   * @returns shared public key
   */
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA)) throw new Error('first arg must be private key');
    if (!isProbPub(publicB)) throw new Error('second arg must be public key');
    const b = Point.fromHex(publicB); // check for being on-curve
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
  // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
  // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
  // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
  const bits2int = CURVE.bits2int || function (bytes) {
    // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
    // for some cases, since bytes.length * 8 is not actual bitLength.
    const num = bytesToNumberBE(bytes); // check for == u8 done here
    const delta = bytes.length * 8 - CURVE.nBitLength; // truncate to nBitLength leftmost bits
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function (bytes) {
    return modN(bits2int(bytes)); // can't use bytesToNumberBE here
  };
  // NOTE: pads output with zero as per spec
  const ORDER_MASK = bitMask(CURVE.nBitLength);
  /**
   * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
   */
  function int2octets(num) {
    aInRange(`num < 2^${CURVE.nBitLength}`, num, _0n, ORDER_MASK);
    // works with order, can have different size than numToField!
    return numberToBytesBE(num, CURVE.nByteLength);
  }
  // Steps A, D of RFC6979 3.2
  // Creates RFC6979 seed; converts msg/privKey to numbers.
  // Used only in sign, not in verify.
  // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order, this will be wrong at least for P521.
  // Also it can be bigger for P224 + SHA256
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (['recovered', 'canonical'].some(k => k in opts)) throw new Error('sign() legacy options not supported');
    const {
      hash,
      randomBytes
    } = CURVE;
    let {
      lowS,
      prehash,
      extraEntropy: ent
    } = opts; // generates low-s sigs by default
    if (lowS == null) lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
    msgHash = ensureBytes('msgHash', msgHash);
    validateSigVerOpts(opts);
    if (prehash) msgHash = ensureBytes('prehashed msgHash', hash(msgHash));
    // We can't later call bits2octets, since nested bits2int is broken for curves
    // with nBitLength % 8 !== 0. Because of that, we unwrap it here as int2octets call.
    // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
    const seedArgs = [int2octets(d), int2octets(h1int)];
    // extraEntropy. RFC6979 3.6: additional k' (optional).
    if (ent != null && ent !== false) {
      // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
      const e = ent === true ? randomBytes(Fp.BYTES) : ent; // generate random bytes OR pass as-is
      seedArgs.push(ensureBytes('extraEntropy', e)); // check for being bytes
    }
    const seed = concatBytes(...seedArgs); // Step D of RFC6979 3.2
    const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
    // Converts signature params into point w r/s, checks result for validity.
    function k2sig(kBytes) {
      // RFC 6979 Section 3.2, step 3: k = bits2int(T)
      const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
      if (!isWithinCurveOrder(k)) return; // Important: all mod() calls here must be done over N
      const ik = invN(k); // k^-1 mod n
      const q = Point.BASE.multiply(k).toAffine(); // q = Gk
      const r = modN(q.x); // r = q.x mod n
      if (r === _0n) return;
      // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
      // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
      // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
      const s = modN(ik * modN(m + r * d)); // Not using blinding here
      if (s === _0n) return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$1); // recovery bit (2 or 3, when q.x > n)
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s); // if lowS was passed, ensure s is always
        recovery ^= 1; // // in the bottom half of N
      }
      return new Signature(r, normS, recovery); // use normS, not s
    }
    return {
      seed,
      k2sig
    };
  }
  const defaultSigOpts = {
    lowS: CURVE.lowS,
    prehash: false
  };
  const defaultVerOpts = {
    lowS: CURVE.lowS,
    prehash: false
  };
  /**
   * Signs message hash with a private key.
   * ```
   * sign(m, d, k) where
   *   (x, y) = G × k
   *   r = x mod n
   *   s = (m + dr)/k mod n
   * ```
   * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
   * @param privKey private key
   * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
   * @returns signature with recovery param
   */
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const {
      seed,
      k2sig
    } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig); // Steps B, C, D, E, F, G
  }
  // Enable precomputes. Slows down first publicKey computation by 20ms.
  Point.BASE._setWindowSize(8);
  // utils.precompute(8, ProjectivePoint.BASE)
  /**
   * Verifies a signature against message hash and public key.
   * Rejects lowS signatures by default: to override,
   * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
   *
   * ```
   * verify(r, s, h, P) where
   *   U1 = hs^-1 mod n
   *   U2 = rs^-1 mod n
   *   R = U1⋅G - U2⋅P
   *   mod(R.x, n) == r
   * ```
   */
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes('msgHash', msgHash);
    publicKey = ensureBytes('publicKey', publicKey);
    if ('strict' in opts) throw new Error('options.strict was renamed to lowS');
    validateSigVerOpts(opts);
    const {
      lowS,
      prehash
    } = opts;
    let _sig = undefined;
    let P;
    try {
      if (typeof sg === 'string' || isBytes(sg)) {
        // Signature can be represented in 2 ways: compact (2*nByteLength) & DER (variable-length).
        // Since DER can also be 2*nByteLength bytes, we check for it first.
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err)) throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === 'object' && typeof sg.r === 'bigint' && typeof sg.s === 'bigint') {
        const {
          r,
          s
        } = sg;
        _sig = new Signature(r, s);
      } else {
        throw new Error('PARSE');
      }
      P = Point.fromHex(publicKey);
    } catch (error) {
      if (error.message === 'PARSE') throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS()) return false;
    if (prehash) msgHash = CURVE.hash(msgHash);
    const {
      r,
      s
    } = _sig;
    const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
    const is = invN(s); // s^-1
    const u1 = modN(h * is); // u1 = hs^-1 mod n
    const u2 = modN(r * is); // u2 = rs^-1 mod n
    const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine(); // R = u1⋅G + u2⋅P
    if (!R) return false;
    const v = modN(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point,
    Signature,
    utils
  };
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// connects noble-curves to noble-hashes
function getHash(hash) {
  return {
    hash,
    hmac: (key, ...msgs) => hmac(hash, key, concatBytes$1(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create = hash => weierstrass({
    ...curveDef,
    ...getHash(hash)
  });
  return Object.freeze({
    ...create(defHash),
    create
  });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256k1P = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
const secp256k1N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
const _1n = BigInt(1);
const _2n = BigInt(2);
const divNearest = (a, b) => (a + b / _2n) / b;
/**
 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
 */
function sqrtMod(y) {
  const P = secp256k1P;
  // prettier-ignore
  const _3n = BigInt(3),
    _6n = BigInt(6),
    _11n = BigInt(11),
    _22n = BigInt(22);
  // prettier-ignore
  const _23n = BigInt(23),
    _44n = BigInt(44),
    _88n = BigInt(88);
  const b2 = y * y * y % P; // x^3, 11
  const b3 = b2 * b2 * y % P; // x^7
  const b6 = pow2(b3, _3n, P) * b3 % P;
  const b9 = pow2(b6, _3n, P) * b3 % P;
  const b11 = pow2(b9, _2n, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n, P);
  if (!Fp.eql(Fp.sqr(root), y)) throw new Error('Cannot find square root');
  return root;
}
const Fp = Field(secp256k1P, undefined, undefined, {
  sqrt: sqrtMod
});
/**
 * secp256k1 short weierstrass curve and ECDSA signatures over it.
 */
const secp256k1 = createCurve({
  a: BigInt(0),
  // equation params: a, b
  b: BigInt(7),
  // Seem to be rigid: bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975
  Fp,
  // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
  n: secp256k1N,
  // Curve order, total count of valid points in the field
  // Base point (x, y) aka generator point
  Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
  Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
  h: BigInt(1),
  // Cofactor
  lowS: true,
  // Allow only low-S signatures by default in sign() and verify()
  /**
   * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
   * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
   * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
   * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
   */
  endo: {
    beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
    splitScalar: k => {
      const n = secp256k1N;
      const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
      const b1 = -_1n * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
      const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
      const b2 = a1;
      const POW_2_128 = BigInt('0x100000000000000000000000000000000'); // (2n**128n).toString(16)
      const c1 = divNearest(b2 * k, n);
      const c2 = divNearest(-b1 * k, n);
      let k1 = mod(k - c1 * a1 - c2 * a2, n);
      let k2 = mod(-c1 * b1 - c2 * b2, n);
      const k1neg = k1 > POW_2_128;
      const k2neg = k2 > POW_2_128;
      if (k1neg) k1 = n - k1;
      if (k2neg) k2 = n - k2;
      if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error('splitScalar: Endomorphism failed, k=' + k);
      }
      return {
        k1neg,
        k1,
        k2neg,
        k2
      };
    }
  }
}, sha256);
// Schnorr signatures are superior to ECDSA from above. Below is Schnorr-specific BIP0340 code.
// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
BigInt(0);
secp256k1.ProjectivePoint;

export { secp256k1 };
