import { B as BaseError } from './base-CC-Hj7CW.js';
import { s as size, i as isHex } from './size-CssOTqqV.js';

class SliceOffsetOutOfBoundsError extends BaseError {
  constructor({
    offset,
    position,
    size
  }) {
    super(`Slice ${position === 'start' ? 'starting' : 'ending'} at offset "${offset}" is out-of-bounds (size: ${size}).`, {
      name: 'SliceOffsetOutOfBoundsError'
    });
  }
}
class SizeExceedsPaddingSizeError extends BaseError {
  constructor({
    size,
    targetSize,
    type
  }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, {
      name: 'SizeExceedsPaddingSizeError'
    });
  }
}

function pad(hexOrBytes, {
  dir,
  size = 32
} = {}) {
  if (typeof hexOrBytes === 'string') return padHex(hexOrBytes, {
    dir,
    size
  });
  return padBytes(hexOrBytes, {
    dir,
    size
  });
}
function padHex(hex_, {
  dir,
  size = 32
} = {}) {
  if (size === null) return hex_;
  const hex = hex_.replace('0x', '');
  if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
    size: Math.ceil(hex.length / 2),
    targetSize: size,
    type: 'hex'
  });
  return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`;
}
function padBytes(bytes, {
  dir,
  size = 32
} = {}) {
  if (size === null) return bytes;
  if (bytes.length > size) throw new SizeExceedsPaddingSizeError({
    size: bytes.length,
    targetSize: size,
    type: 'bytes'
  });
  const paddedBytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    const padEnd = dir === 'right';
    paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}

class IntegerOutOfRangeError extends BaseError {
  constructor({
    max,
    min,
    signed,
    size,
    value
  }) {
    super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? 'signed' : 'unsigned'} ` : ''}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, {
      name: 'IntegerOutOfRangeError'
    });
  }
}
class SizeOverflowError extends BaseError {
  constructor({
    givenSize,
    maxSize
  }) {
    super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, {
      name: 'SizeOverflowError'
    });
  }
}

function trim(hexOrBytes, {
  dir = 'left'
} = {}) {
  let data = typeof hexOrBytes === 'string' ? hexOrBytes.replace('0x', '') : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === 'left' ? i : data.length - i - 1].toString() === '0') sliceLength++;else break;
  }
  data = dir === 'left' ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === 'string') {
    if (data.length === 1 && dir === 'right') data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}

function assertSize(hexOrBytes, {
  size: size$1
}) {
  if (size(hexOrBytes) > size$1) throw new SizeOverflowError({
    givenSize: size(hexOrBytes),
    maxSize: size$1
  });
}
/**
 * Decodes a hex value into a bigint.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns BigInt value.
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x1a4', { signed: true })
 * // 420n
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420n
 */
function hexToBigInt(hex, opts = {}) {
  const {
    signed
  } = opts;
  if (opts.size) assertSize(hex, {
    size: opts.size
  });
  const value = BigInt(hex);
  if (!signed) return value;
  const size = (hex.length - 2) / 2;
  const max = (1n << BigInt(size) * 8n - 1n) - 1n;
  if (value <= max) return value;
  return value - BigInt(`0x${'f'.padStart(size * 2, 'f')}`) - 1n;
}
/**
 * Decodes a hex string into a number.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns Number value.
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToNumber('0x1a4')
 * // 420
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420
 */
function hexToNumber(hex, opts = {}) {
  return Number(hexToBigInt(hex, opts));
}
/**
 * Decodes a hex value into a UTF-8 string.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextostring
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns String value.
 *
 * @example
 * import { hexToString } from 'viem'
 * const data = hexToString('0x48656c6c6f20576f726c6421')
 * // 'Hello world!'
 *
 * @example
 * import { hexToString } from 'viem'
 * const data = hexToString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
 *  size: 32,
 * })
 * // 'Hello world'
 */
function hexToString(hex, opts = {}) {
  let bytes = hexToBytes(hex);
  if (opts.size) {
    assertSize(bytes, {
      size: opts.size
    });
    bytes = trim(bytes, {
      dir: 'right'
    });
  }
  return new TextDecoder().decode(bytes);
}

const hexes = /*#__PURE__*/Array.from({
  length: 256
}, (_v, i) => i.toString(16).padStart(2, '0'));
/**
 * Encodes a string, number, bigint, or ByteArray into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex
 * - Example: https://viem.sh/docs/utilities/toHex#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world')
 * // '0x48656c6c6f20776f726c6421'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex(420)
 * // '0x1a4'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world', { size: 32 })
 * // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
 */
function toHex(value, opts = {}) {
  if (typeof value === 'number' || typeof value === 'bigint') return numberToHex(value, opts);
  if (typeof value === 'string') {
    return stringToHex(value, opts);
  }
  if (typeof value === 'boolean') return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
/**
 * Encodes a boolean into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#booltohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true)
 * // '0x1'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(false)
 * // '0x0'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true, { size: 32 })
 * // '0x0000000000000000000000000000000000000000000000000000000000000001'
 */
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === 'number') {
    assertSize(hex, {
      size: opts.size
    });
    return pad(hex, {
      size: opts.size
    });
  }
  return hex;
}
/**
 * Encodes a bytes array into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function bytesToHex(value, opts = {}) {
  let string = '';
  for (let i = 0; i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === 'number') {
    assertSize(hex, {
      size: opts.size
    });
    return pad(hex, {
      dir: 'right',
      size: opts.size
    });
  }
  return hex;
}
/**
 * Encodes a number or bigint into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420)
 * // '0x1a4'
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420, { size: 32 })
 * // '0x00000000000000000000000000000000000000000000000000000000000001a4'
 */
function numberToHex(value_, opts = {}) {
  const {
    signed,
    size
  } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size) {
    if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
  } else if (typeof value_ === 'number') {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === 'bigint' && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === 'bigint' ? 'n' : '';
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : undefined,
      min: `${minValue}${suffix}`,
      signed,
      size,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
  if (size) return pad(hex, {
    size
  });
  return hex;
}
const encoder$1 = /*#__PURE__*/new TextEncoder();
/**
 * Encodes a UTF-8 string into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!')
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!', { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function stringToHex(value_, opts = {}) {
  const value = encoder$1.encode(value_);
  return bytesToHex(value, opts);
}

const encoder = /*#__PURE__*/new TextEncoder();
/**
 * Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes
 * - Example: https://viem.sh/docs/utilities/toBytes#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes('Hello world')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function toBytes(value, opts = {}) {
  if (typeof value === 'number' || typeof value === 'bigint') return numberToBytes(value, opts);
  if (typeof value === 'boolean') return boolToBytes(value, opts);
  if (isHex(value)) return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
/**
 * Encodes a boolean into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
 *
 * @param value Boolean value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true)
 * // Uint8Array([1])
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true, { size: 32 })
 * // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
 */
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === 'number') {
    assertSize(bytes, {
      size: opts.size
    });
    return pad(bytes, {
      size: opts.size
    });
  }
  return bytes;
}
// We use very optimized technique to convert hex string to byte array
const charCodeMap = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
  return undefined;
}
/**
 * Encodes a hex string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
 *
 * @param hex Hex string to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, {
      size: opts.size
    });
    hex = pad(hex, {
      dir: 'right',
      size: opts.size
    });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2) hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === undefined || nibbleRight === undefined) {
      throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
/**
 * Encodes a number into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
 *
 * @param value Number to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
/**
 * Encodes a UTF-8 string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
 *
 * @param value String to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function stringToBytes(value, opts = {}) {
  const bytes = encoder.encode(value);
  if (typeof opts.size === 'number') {
    assertSize(bytes, {
      size: opts.size
    });
    return pad(bytes, {
      dir: 'right',
      size: opts.size
    });
  }
  return bytes;
}

export { SliceOffsetOutOfBoundsError as S, hexToString as a, bytesToHex as b, hexToBytes as c, stringToHex as d, toBytes as e, assertSize as f, trim as g, hexToNumber as h, hexToBigInt as i, numberToHex as j, boolToHex as k, numberToBytes as n, padHex as p, stringToBytes as s, toHex as t };
