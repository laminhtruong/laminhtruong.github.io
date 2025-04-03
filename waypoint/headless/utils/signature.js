import { secp256k1 } from '../../secp256k1-BWEYsKUq.js';
import { i as hexToBigInt, c as hexToBytes, j as numberToHex } from '../../toBytes-rCiiThej.js';
import '../../sha256-E5MvF2nn.js';
import '../../utils-CKEBUnDS.js';
import '../../base-CC-Hj7CW.js';
import '../../size-CssOTqqV.js';

/**
 * @description Converts a signature into hex format.
 *
 * @param signature The signature to convert.
 * @returns The signature in hex format.
 *
 * @example
 * serializeSignature({
 *   r: '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
 *   s: '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8',
 *   yParity: 1
 * })
 * // "0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c"
 */
function serializeSignature({
  r,
  s,
  to = 'hex',
  v,
  yParity
}) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1) return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n)) return v % 2n === 0n ? 1 : 0;
    throw new Error('Invalid `v` or `yParity` value');
  })();
  const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? '1b' : '1c'}`;
  if (to === 'hex') return signature;
  return hexToBytes(signature);
}

/**
 * @description Parses a hex formatted signature into a structured signature.
 *
 * @param signatureHex Signature in hex format.
 * @returns The structured signature.
 *
 * @example
 * parseSignature('0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c')
 * // { r: '0x...', s: '0x...', v: 28n }
 */
function parseSignature(signatureHex) {
  const {
    r,
    s
  } = secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
  const yParityOrV = Number(`0x${signatureHex.slice(130)}`);
  const [v, yParity] = (() => {
    if (yParityOrV === 0 || yParityOrV === 1) return [undefined, yParityOrV];
    if (yParityOrV === 27) return [BigInt(yParityOrV), 0];
    if (yParityOrV === 28) return [BigInt(yParityOrV), 1];
    throw new Error('Invalid yParityOrV value');
  })();
  if (typeof v !== 'undefined') return {
    r: numberToHex(r, {
      size: 32
    }),
    s: numberToHex(s, {
      size: 32
    }),
    v,
    yParity
  };
  return {
    r: numberToHex(r, {
      size: 32
    }),
    s: numberToHex(s, {
      size: 32
    }),
    yParity
  };
}

const toEthereumSignature = sig => serializeSignature(parseSignature(sig));

export { toEthereumSignature };
