import { secp256k1 } from './secp256k1-BWEYsKUq.js';
import { HeadlessClientError, HeadlessClientErrorCode } from './headless/error/client.js';
import { base64ToBytes, bytesToJson } from './headless/utils/convertor.js';
import { c as checksumAddress } from './isAddress-BUhRlNtM.js';
import { k as keccak256 } from './keccak256-B1CwQAsk.js';

/**
 * @description Converts an ECDSA public key to an address.
 *
 * @param publicKey The public key to convert.
 *
 * @returns The address.
 */
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}

const getAddressFromShard = clientShard => {
  if (!clientShard) {
    throw new HeadlessClientError({
      cause: undefined,
      code: HeadlessClientErrorCode.InvalidClientShardError,
      message: `Unable to get address from client shard. The parameter clientShard="${clientShard}" is NOT valid."`
    });
  }
  try {
    const shardInBytes = base64ToBytes(clientShard);
    const shard = bytesToJson(shardInBytes);
    const {
      publicPoint: compressedPublicKeyInBase64
    } = shard;
    const compressedPublicKeyInBytes = base64ToBytes(compressedPublicKeyInBase64);
    const projPoint = secp256k1.ProjectivePoint.fromHex(compressedPublicKeyInBytes);
    const uncompressedPublicKey = `0x${projPoint.toHex(false)}`;
    return publicKeyToAddress(uncompressedPublicKey);
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.InvalidClientShardError,
      message: `Unable to get address from client shard. The parameter clientShard="${clientShard}" is NOT valid."`
    });
  }
};
const getSecretFromShard = clientShard => {
  try {
    const shardInBytes = base64ToBytes(clientShard);
    const shard = bytesToJson(shardInBytes);
    const {
      secretShare: secretShareInBase64
    } = shard;
    const secretShareInBytes = base64ToBytes(secretShareInBase64);
    return secretShareInBytes;
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.InvalidClientShardError,
      message: `Unable to get secret from client shard. The parameter clientShard="${clientShard}" is NOT valid."`
    });
  }
};

export { getSecretFromShard as a, getAddressFromShard as g, publicKeyToAddress as p };
