import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { bytesToBase64 } from '../utils/convertor.js';
import { deriveKey } from './helpers/key.js';
import { s as stringToBytes, n as numberToBytes } from '../../toBytes-rCiiThej.js';
import { c as concatBytes } from '../../concat-CZcWoY2n.js';
import '../../index-B3KPQWEG.js';
import '../../base-CC-Hj7CW.js';
import '../../size-CssOTqqV.js';

const packEncryptedContent = (cipherText, iv, authTag) => {
  // * format: [nonceSize][authTagSize][nonce][authTag][cipherText]
  const content = concatBytes([numberToBytes(iv.length), numberToBytes(authTag.length), iv, cipherText, authTag]);
  // * 2 layer base64 encoding
  const l1InBase64 = bytesToBase64(content);
  const l2InBytes = stringToBytes(l1InBase64);
  const l2InBase64 = bytesToBase64(l2InBytes);
  return l2InBase64;
};
const TAG_LENGTH_BIT = 128;
const TAG_LENGTH_BYTE = TAG_LENGTH_BIT / 8;
const IV_LENGTH_BYTE = 12;
// ! DO NOT tracking on ecrypt shard
// * Already tracking on backup shard
const encryptShard = async params => {
  try {
    const {
      waypointToken,
      recoveryPassword,
      clientShard
    } = params;
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTE)); // Generate a 12-byte IV for AES-GCM
    const shardInBytes = stringToBytes(clientShard);
    const key = await deriveKey(waypointToken, recoveryPassword);
    const content = await crypto.subtle.encrypt({
      name: "AES-GCM",
      iv,
      tagLength: TAG_LENGTH_BIT
    }, key, shardInBytes);
    const cipherText = new Uint8Array(content.slice(0, content.byteLength - TAG_LENGTH_BYTE));
    const authTag = new Uint8Array(content.slice(content.byteLength - TAG_LENGTH_BYTE));
    const packed = packEncryptedContent(cipherText, iv, authTag);
    return packed;
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.EncryptClientShardError,
      message: "Unable to encrypt the client shard."
    });
  }
};

export { IV_LENGTH_BYTE, TAG_LENGTH_BYTE, encryptShard };
