import { p as publicKeyToAddress } from './get-address-BA4hanCB.js';
import { i as isHex } from './size-CssOTqqV.js';
import { t as toHex, i as hexToBigInt, h as hexToNumber } from './toBytes-rCiiThej.js';

async function recoverPublicKey({
  hash,
  signature
}) {
  const hashHex = isHex(hash) ? hash : toHex(hash);
  const {
    secp256k1
  } = await import('./secp256k1-BWEYsKUq.js');
  const signature_ = (() => {
    // typeof signature: `Signature`
    if (typeof signature === 'object' && 'r' in signature && 's' in signature) {
      const {
        r,
        s,
        v,
        yParity
      } = signature;
      const yParityOrV = Number(yParity ?? v);
      const recoveryBit = toRecoveryBit(yParityOrV);
      return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit);
    }
    // typeof signature: `Hex | ByteArray`
    const signatureHex = isHex(signature) ? signature : toHex(signature);
    const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
  })();
  const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
  return `0x${publicKey}`;
}
function toRecoveryBit(yParityOrV) {
  if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
  if (yParityOrV === 27) return 0;
  if (yParityOrV === 28) return 1;
  throw new Error('Invalid yParityOrV value');
}

async function recoverAddress({
  hash,
  signature
}) {
  return publicKeyToAddress(await recoverPublicKey({
    hash: hash,
    signature
  }));
}

export { recoverAddress as r };
