function isHex(value, {
  strict = true
} = {}) {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size(value) {
  if (isHex(value, {
    strict: false
  })) return Math.ceil((value.length - 2) / 2);
  return value.length;
}

export { isHex as i, size as s };
