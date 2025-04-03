import { j as numberToHex } from './toBytes-rCiiThej.js';
import { B as BaseError } from './base-CC-Hj7CW.js';

const gweiUnits = {
  ether: -9,
  wei: 9
};

class InvalidDecimalNumberError extends BaseError {
  constructor({
    value
  }) {
    super(`Number \`${value}\` is not a valid decimal number.`, {
      name: 'InvalidDecimalNumberError'
    });
  }
}

/**
 * Multiplies a string representation of a number by a given exponent of base 10 (10exponent).
 *
 * - Docs: https://viem.sh/docs/utilities/parseUnits
 *
 * @example
 * import { parseUnits } from 'viem'
 *
 * parseUnits('420', 9)
 * // 420000000000n
 */
function parseUnits(value, decimals) {
  if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value)) throw new InvalidDecimalNumberError({
    value
  });
  let [integer, fraction = '0'] = value.split('.');
  const negative = integer.startsWith('-');
  if (negative) integer = integer.slice(1);
  // trim trailing zeros.
  fraction = fraction.replace(/(0+)$/, '');
  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1) integer = `${BigInt(integer) + 1n}`;
    fraction = '';
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [fraction.slice(0, decimals - 1), fraction.slice(decimals - 1, decimals), fraction.slice(decimals)];
    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9) fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, '0');else fraction = `${left}${rounded}`;
    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + 1n}`;
    }
    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, '0');
  }
  return BigInt(`${negative ? '-' : ''}${integer}${fraction}`);
}

/**
 * Converts a string representation of gwei to numerical wei.
 *
 * - Docs: https://viem.sh/docs/utilities/parseGwei
 *
 * @example
 * import { parseGwei } from 'viem'
 *
 * parseGwei('420')
 * // 420000000000n
 */
function parseGwei(ether, unit = 'wei') {
  return parseUnits(ether, gweiUnits[unit]);
}

const LEGACY_TYPE = "0x0";
const RONIN_GAS_SPONSOR_TYPE = "0x64";
const RONIN_GAS_PRICE = numberToHex(parseGwei("21"));
const PAYER_INFO = {
  s: "0x3caeb99cc6659c5ca4c66b91b1686a86fe0493e1122bdd09f2babdf72e54041a",
  r: "0xdbdbd0989f595c0921acaf9c80342bbeff3b8ea6d2a9ad3167e63010715de3fd",
  v: "0x1"
};

export { LEGACY_TYPE as L, PAYER_INFO as P, RONIN_GAS_SPONSOR_TYPE as R, RONIN_GAS_PRICE as a, gweiUnits as g };
