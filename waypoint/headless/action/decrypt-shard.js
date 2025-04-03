import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { createTracker, HeadlessEventName } from '../track/track.js';
import { base64ToBytes } from '../utils/convertor.js';
import { IV_LENGTH_BYTE, TAG_LENGTH_BYTE } from './encrypt-shard.js';
import { checkWeakBk } from './helpers/check-weak-bk.js';
import { deriveKey } from './helpers/key.js';
import { c as concatBytes } from '../../concat-CZcWoY2n.js';
import { f as assertSize, g as trim } from '../../toBytes-rCiiThej.js';
import '../../index-B3KPQWEG.js';
import '../../common/version.js';
import '../error/server.js';
import '../proto/rpc.js';
import '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';
import '../utils/service-url.js';
import '../../v4-CU-e4i5S.js';
import '../../sha256-scJRO6jx.js';
import '../../sha256-E5MvF2nn.js';
import '../../utils-CKEBUnDS.js';
import '../../size-CssOTqqV.js';
import '../../base-CC-Hj7CW.js';

/**
 * Decodes a byte array into a UTF-8 string.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes#bytestostring
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns String value.
 *
 * @example
 * import { bytesToString } from 'viem'
 * const data = bytesToString(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
 * // 'Hello world'
 */
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== 'undefined') {
    assertSize(bytes, {
      size: opts.size
    });
    bytes = trim(bytes, {
      dir: 'right'
    });
  }
  return new TextDecoder().decode(bytes);
}

const unpackEncryptedContent = packedContent => {
  const l2InBytes = base64ToBytes(packedContent);
  const l1InBase64 = bytesToString(l2InBytes);
  const content = base64ToBytes(l1InBase64);
  const ivSize = content[0] ?? IV_LENGTH_BYTE; // * 1st byte: iv size
  const authTagSize = content[1] ?? TAG_LENGTH_BYTE; // * 2nd byte: auth tag size
  const iv = content.slice(2, 2 + ivSize);
  const cipherText = content.slice(2 + ivSize, content.length - authTagSize);
  const authTag = content.slice(content.length - authTagSize);
  return {
    iv,
    authTag,
    cipherText
  };
};
const getV1PackedContent = encryptedData => {
  const parts = encryptedData.split(".");
  const v1Content = parts[0];
  if (!v1Content) {
    throw "Encrypted content is empty.";
  }
  return v1Content;
};
const decryptShard = async params => {
  const {
    waypointToken,
    recoveryPassword,
    encryptedData
  } = params;
  const tracker = createTracker({
    event: HeadlessEventName.decryptShard,
    waypointToken,
    // * decrypt function is not environment dependent - always track as production
    productionFactor: true
  });
  try {
    const v1PackedContent = getV1PackedContent(encryptedData);
    const {
      authTag,
      cipherText,
      iv
    } = unpackEncryptedContent(v1PackedContent);
    const key = await deriveKey(waypointToken, recoveryPassword);
    const shardInBytes = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv
    }, key, concatBytes([cipherText, authTag]));
    const shardInBase64 = bytesToString(new Uint8Array(shardInBytes));
    tracker.trackOk({
      request: {
        isWeakBk: checkWeakBk(recoveryPassword)
      }
    });
    return shardInBase64;
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.DecryptClientShardError,
      message: "Unable to decrypt the client shard. It is probably the wrong recovery password."
    });
  }
};

export { decryptShard };
