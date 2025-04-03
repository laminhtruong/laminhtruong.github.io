import { s as sha256$1 } from './sha256-E5MvF2nn.js';
import { i as isHex } from './size-CssOTqqV.js';
import { e as toBytes, t as toHex } from './toBytes-rCiiThej.js';

function sha256(value, to_) {
  const to = to_ || 'hex';
  const bytes = sha256$1(isHex(value, {
    strict: false
  }) ? toBytes(value) : value);
  if (to === 'bytes') return bytes;
  return toHex(bytes);
}

export { sha256 as s };
