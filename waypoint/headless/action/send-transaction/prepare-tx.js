import { HeadlessClientError, HeadlessClientErrorCode } from '../../error/client.js';
import { g as gweiUnits, L as LEGACY_TYPE, R as RONIN_GAS_SPONSOR_TYPE, P as PAYER_INFO, a as RONIN_GAS_PRICE } from '../../../common-DU-D5PxS.js';
import { i as isAddress, I as InvalidAddressError } from '../../../isAddress-BUhRlNtM.js';
import { s as size, i as isHex } from '../../../size-CssOTqqV.js';
import { b as bytesToHex, c as hexToBytes, j as numberToHex, h as hexToNumber, t as toHex, g as trim, i as hexToBigInt } from '../../../toBytes-rCiiThej.js';
import { B as BaseError } from '../../../base-CC-Hj7CW.js';
import { s as sha256 } from '../../../sha256-scJRO6jx.js';
import { b as concatHex } from '../../../concat-CZcWoY2n.js';
import { s as slice } from '../../../slice-zoF_Vuu1.js';
import { c as createClient, h as http } from '../../../http-CzuPfCha.js';
import '../../../keccak256-B1CwQAsk.js';
import '../../../utils-CKEBUnDS.js';
import '../../../sha256-E5MvF2nn.js';
import '../../../rpc-BGk0htDU.js';

class NegativeOffsetError extends BaseError {
  constructor({
    offset
  }) {
    super(`Offset \`${offset}\` cannot be negative.`, {
      name: 'NegativeOffsetError'
    });
  }
}
class PositionOutOfBoundsError extends BaseError {
  constructor({
    length,
    position
  }) {
    super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, {
      name: 'PositionOutOfBoundsError'
    });
  }
}
class RecursiveReadLimitExceededError extends BaseError {
  constructor({
    count,
    limit
  }) {
    super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, {
      name: 'RecursiveReadLimitExceededError'
    });
  }
}

const staticCursor = {
  bytes: new Uint8Array(),
  dataView: new DataView(new ArrayBuffer(0)),
  position: 0,
  positionReadCount: new Map(),
  recursiveReadCount: 0,
  recursiveReadLimit: Number.POSITIVE_INFINITY,
  assertReadLimit() {
    if (this.recursiveReadCount >= this.recursiveReadLimit) throw new RecursiveReadLimitExceededError({
      count: this.recursiveReadCount + 1,
      limit: this.recursiveReadLimit
    });
  },
  assertPosition(position) {
    if (position < 0 || position > this.bytes.length - 1) throw new PositionOutOfBoundsError({
      length: this.bytes.length,
      position
    });
  },
  decrementPosition(offset) {
    if (offset < 0) throw new NegativeOffsetError({
      offset
    });
    const position = this.position - offset;
    this.assertPosition(position);
    this.position = position;
  },
  getReadCount(position) {
    return this.positionReadCount.get(position || this.position) || 0;
  },
  incrementPosition(offset) {
    if (offset < 0) throw new NegativeOffsetError({
      offset
    });
    const position = this.position + offset;
    this.assertPosition(position);
    this.position = position;
  },
  inspectByte(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectBytes(length, position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + length - 1);
    return this.bytes.subarray(position, position + length);
  },
  inspectUint8(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectUint16(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 1);
    return this.dataView.getUint16(position);
  },
  inspectUint24(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 2);
    return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
  },
  inspectUint32(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 3);
    return this.dataView.getUint32(position);
  },
  pushByte(byte) {
    this.assertPosition(this.position);
    this.bytes[this.position] = byte;
    this.position++;
  },
  pushBytes(bytes) {
    this.assertPosition(this.position + bytes.length - 1);
    this.bytes.set(bytes, this.position);
    this.position += bytes.length;
  },
  pushUint8(value) {
    this.assertPosition(this.position);
    this.bytes[this.position] = value;
    this.position++;
  },
  pushUint16(value) {
    this.assertPosition(this.position + 1);
    this.dataView.setUint16(this.position, value);
    this.position += 2;
  },
  pushUint24(value) {
    this.assertPosition(this.position + 2);
    this.dataView.setUint16(this.position, value >> 8);
    this.dataView.setUint8(this.position + 2, value & ~4294967040);
    this.position += 3;
  },
  pushUint32(value) {
    this.assertPosition(this.position + 3);
    this.dataView.setUint32(this.position, value);
    this.position += 4;
  },
  readByte() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectByte();
    this.position++;
    return value;
  },
  readBytes(length, size) {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectBytes(length);
    this.position += size ?? length;
    return value;
  },
  readUint8() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint8();
    this.position += 1;
    return value;
  },
  readUint16() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint16();
    this.position += 2;
    return value;
  },
  readUint24() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint24();
    this.position += 3;
    return value;
  },
  readUint32() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint32();
    this.position += 4;
    return value;
  },
  get remaining() {
    return this.bytes.length - this.position;
  },
  setPosition(position) {
    const oldPosition = this.position;
    this.assertPosition(position);
    this.position = position;
    return () => this.position = oldPosition;
  },
  _touch() {
    if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
    const count = this.getReadCount();
    this.positionReadCount.set(this.position, count + 1);
    if (count > 0) this.recursiveReadCount++;
  }
};
function createCursor(bytes, {
  recursiveReadLimit = 8_192
} = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * @example
 * import { formatUnits } from 'viem'
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
function formatUnits(value, decimals) {
  let display = value.toString();
  const negative = display.startsWith('-');
  if (negative) display = display.slice(1);
  display = display.padStart(decimals, '0');
  let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)];
  fraction = fraction.replace(/(0+)$/, '');
  return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
}

/**
 * Converts numerical wei to a string representation of gwei.
 *
 * - Docs: https://viem.sh/docs/utilities/formatGwei
 *
 * @example
 * import { formatGwei } from 'viem'
 *
 * formatGwei(1000000000n)
 * // '1'
 */
function formatGwei(wei, unit = 'wei') {
  return formatUnits(wei, gweiUnits[unit]);
}

function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === undefined || value === false) return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join('\n');
}
class InvalidLegacyVError extends BaseError {
  constructor({
    v
  }) {
    super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
      name: 'InvalidLegacyVError'
    });
  }
}
class InvalidSerializableTransactionError extends BaseError {
  constructor({
    transaction
  }) {
    super('Cannot infer a transaction type from provided transaction.', {
      metaMessages: ['Provided Transaction:', '{', prettyPrint(transaction), '}', '', 'To infer the type, either provide:', '- a `type` to the Transaction, or', '- an EIP-1559 Transaction with `maxFeePerGas`, or', '- an EIP-2930 Transaction with `gasPrice` & `accessList`, or', '- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or', '- an EIP-7702 Transaction with `authorizationList`, or', '- a Legacy Transaction with `gasPrice`'],
      name: 'InvalidSerializableTransactionError'
    });
  }
}
class InvalidStorageKeySizeError extends BaseError {
  constructor({
    storageKey
  }) {
    super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, {
      name: 'InvalidStorageKeySizeError'
    });
  }
}

function toRlp(bytes, to = 'hex') {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === 'hex') return bytesToHex(cursor.bytes);
  return cursor.bytes;
}
function getEncodable(bytes) {
  if (Array.isArray(bytes)) return getEncodableList(bytes.map(x => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55) return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(0xc0 + bodyLength);
      } else {
        cursor.pushByte(0xc0 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1) cursor.pushUint8(bodyLength);else if (sizeOfBodyLength === 2) cursor.pushUint16(bodyLength);else if (sizeOfBodyLength === 3) cursor.pushUint24(bodyLength);else cursor.pushUint32(bodyLength);
      }
      for (const {
        encode
      } of list) {
        encode(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === 'string' ? hexToBytes(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 0x80) return 1;
    if (bytes.length <= 55) return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 0x80) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(0x80 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(0x80 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1) cursor.pushUint8(bytes.length);else if (sizeOfBytesLength === 2) cursor.pushUint16(bytes.length);else if (sizeOfBytesLength === 3) cursor.pushUint24(bytes.length);else cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8) return 1;
  if (length < 2 ** 16) return 2;
  if (length < 2 ** 24) return 3;
  if (length < 2 ** 32) return 4;
  throw new BaseError('Length is too large.');
}

class FeeCapTooHighError extends BaseError {
  constructor({
    cause,
    maxFeePerGas
  } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}) cannot be higher than the maximum allowed value (2^256-1).`, {
      cause,
      name: 'FeeCapTooHighError'
    });
  }
}
Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
class TipAboveFeeCapError extends BaseError {
  constructor({
    cause,
    maxPriorityFeePerGas,
    maxFeePerGas
  } = {}) {
    super([`The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ''}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}).`].join('\n'), {
      cause,
      name: 'TipAboveFeeCapError'
    });
  }
}
Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});

const maxUint256 = 2n ** 256n - 1n;

/**
 * Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has sent.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransactionCount
 * - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionCountParameters}
 * @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransactionCount } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transactionCount = await getTransactionCount(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
async function getTransactionCount(client, {
  address,
  blockTag = 'latest',
  blockNumber
}) {
  const count = await client.request({
    method: 'eth_getTransactionCount',
    params: [address, blockNumber ? numberToHex(blockNumber) : blockTag]
  }, {
    dedupe: Boolean(blockNumber)
  });
  return hexToNumber(count);
}

/**
 * Compute commitments from a list of blobs.
 *
 * @example
 * ```ts
 * import { blobsToCommitments, toBlobs } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * ```
 */
function blobsToCommitments(parameters) {
  const {
    kzg
  } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
  const blobs = typeof parameters.blobs[0] === 'string' ? parameters.blobs.map(x => hexToBytes(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs) commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === 'bytes' ? commitments : commitments.map(x => bytesToHex(x));
}

/**
 * Compute the proofs for a list of blobs and their commitments.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 * ```
 */
function blobsToProofs(parameters) {
  const {
    kzg
  } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
  const blobs = typeof parameters.blobs[0] === 'string' ? parameters.blobs.map(x => hexToBytes(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === 'string' ? parameters.commitments.map(x => hexToBytes(x)) : parameters.commitments;
  const proofs = [];
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === 'bytes' ? proofs : proofs.map(x => bytesToHex(x));
}

/**
 * Transform a commitment to it's versioned hash.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentToVersionedHash,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const [commitment] = blobsToCommitments({ blobs, kzg })
 * const versionedHash = commitmentToVersionedHash({ commitment })
 * ```
 */
function commitmentToVersionedHash(parameters) {
  const {
    commitment,
    version = 1
  } = parameters;
  const to = parameters.to ?? (typeof commitment === 'string' ? 'hex' : 'bytes');
  const versionedHash = sha256(commitment, 'bytes');
  versionedHash.set([version], 0);
  return to === 'bytes' ? versionedHash : bytesToHex(versionedHash);
}

/**
 * Transform a list of commitments to their versioned hashes.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentsToVersionedHashes,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const versionedHashes = commitmentsToVersionedHashes({ commitments })
 * ```
 */
function commitmentsToVersionedHashes(parameters) {
  const {
    commitments,
    version
  } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === 'string' ? 'hex' : 'bytes');
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version
    }));
  }
  return hashes;
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4844.md#parameters
/** Blob limit per transaction. */
const blobsPerTransaction = 6;
/** The number of bytes in a BLS scalar field element. */
const bytesPerFieldElement = 32;
/** The number of field elements in a blob. */
const fieldElementsPerBlob = 4096;
/** The number of bytes in a blob. */
const bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
/** Blob bytes limit per transaction. */
const maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction -
// terminator byte (0x80).
1 -
// zero byte (0x00) appended to each field element.
1 * fieldElementsPerBlob * blobsPerTransaction;

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4844.md#parameters
const versionedHashVersionKzg = 1;

class BlobSizeTooLargeError extends BaseError {
  constructor({
    maxSize,
    size
  }) {
    super('Blob size is too large.', {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size} bytes`],
      name: 'BlobSizeTooLargeError'
    });
  }
}
class EmptyBlobError extends BaseError {
  constructor() {
    super('Blob data must not be empty.', {
      name: 'EmptyBlobError'
    });
  }
}
class InvalidVersionedHashSizeError extends BaseError {
  constructor({
    hash,
    size
  }) {
    super(`Versioned hash "${hash}" size is invalid.`, {
      metaMessages: ['Expected: 32', `Received: ${size}`],
      name: 'InvalidVersionedHashSizeError'
    });
  }
}
class InvalidVersionedHashVersionError extends BaseError {
  constructor({
    hash,
    version
  }) {
    super(`Versioned hash "${hash}" version is invalid.`, {
      metaMessages: [`Expected: ${versionedHashVersionKzg}`, `Received: ${version}`],
      name: 'InvalidVersionedHashVersionError'
    });
  }
}

/**
 * Transforms arbitrary data to blobs.
 *
 * @example
 * ```ts
 * import { toBlobs, stringToHex } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * ```
 */
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === 'string' ? 'hex' : 'bytes');
  const data = typeof parameters.data === 'string' ? hexToBytes(parameters.data) : parameters.data;
  const size_ = size(data);
  if (!size_) throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction) throw new BlobSizeTooLargeError({
    maxSize: maxBytesPerTransaction,
    size: size_
  });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size = 0;
    while (size < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      // Push a zero byte so the field element doesn't overflow the BLS modulus.
      blob.pushByte(0x00);
      // Push the current segment of data bytes.
      blob.pushBytes(bytes);
      // If we detect that the current segment of data bytes is less than 31 bytes,
      // we can stop processing and push a terminator byte to indicate the end of the blob.
      if (bytes.length < 31) {
        blob.pushByte(0x80);
        active = false;
        break;
      }
      size++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === 'bytes' ? blobs.map(x => x.bytes) : blobs.map(x => bytesToHex(x.bytes));
}

/**
 * Transforms arbitrary data (or blobs, commitments, & proofs) into a sidecar array.
 *
 * @example
 * ```ts
 * import { toBlobSidecars, stringToHex } from 'viem'
 *
 * const sidecars = toBlobSidecars({ data: stringToHex('hello world') })
 * ```
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs,
 *   blobsToProofs,
 *   toBlobSidecars,
 *   stringToHex
 * } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 *
 * const sidecars = toBlobSidecars({ blobs, commitments, proofs })
 * ```
 */
function toBlobSidecars(parameters) {
  const {
    data,
    kzg,
    to
  } = parameters;
  const blobs = parameters.blobs ?? toBlobs({
    data: data,
    to
  });
  const commitments = parameters.commitments ?? blobsToCommitments({
    blobs,
    kzg: kzg,
    to
  });
  const proofs = parameters.proofs ?? blobsToProofs({
    blobs,
    commitments,
    kzg: kzg,
    to
  });
  const sidecars = [];
  for (let i = 0; i < blobs.length; i++) sidecars.push({
    blob: blobs[i],
    commitment: commitments[i],
    proof: proofs[i]
  });
  return sidecars;
}

function getTransactionType(transaction) {
  if (transaction.type) return transaction.type;
  if (typeof transaction.authorizationList !== 'undefined') return 'eip7702';
  if (typeof transaction.blobs !== 'undefined' || typeof transaction.blobVersionedHashes !== 'undefined' || typeof transaction.maxFeePerBlobGas !== 'undefined' || typeof transaction.sidecars !== 'undefined') return 'eip4844';
  if (typeof transaction.maxFeePerGas !== 'undefined' || typeof transaction.maxPriorityFeePerGas !== 'undefined') {
    return 'eip1559';
  }
  if (typeof transaction.gasPrice !== 'undefined') {
    if (typeof transaction.accessList !== 'undefined') return 'eip2930';
    return 'legacy';
  }
  throw new InvalidSerializableTransactionError({
    transaction
  });
}

class InvalidChainIdError extends BaseError {
  constructor({
    chainId
  }) {
    super(typeof chainId === 'number' ? `Chain ID "${chainId}" is invalid.` : 'Chain ID is invalid.', {
      name: 'InvalidChainIdError'
    });
  }
}

function assertTransactionEIP7702(transaction) {
  const {
    authorizationList
  } = transaction;
  if (authorizationList) {
    for (const authorization of authorizationList) {
      const {
        contractAddress,
        chainId
      } = authorization;
      if (!isAddress(contractAddress)) throw new InvalidAddressError({
        address: contractAddress
      });
      if (chainId <= 0) throw new InvalidChainIdError({
        chainId
      });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP4844(transaction) {
  const {
    blobVersionedHashes
  } = transaction;
  if (blobVersionedHashes) {
    if (blobVersionedHashes.length === 0) throw new EmptyBlobError();
    for (const hash of blobVersionedHashes) {
      const size_ = size(hash);
      const version = hexToNumber(slice(hash, 0, 1));
      if (size_ !== 32) throw new InvalidVersionedHashSizeError({
        hash,
        size: size_
      });
      if (version !== versionedHashVersionKzg) throw new InvalidVersionedHashVersionError({
        hash,
        version
      });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP1559(transaction) {
  const {
    chainId,
    maxPriorityFeePerGas,
    maxFeePerGas,
    to
  } = transaction;
  if (chainId <= 0) throw new InvalidChainIdError({
    chainId
  });
  if (to && !isAddress(to)) throw new InvalidAddressError({
    address: to
  });
  if (maxFeePerGas && maxFeePerGas > maxUint256) throw new FeeCapTooHighError({
    maxFeePerGas
  });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas) throw new TipAboveFeeCapError({
    maxFeePerGas,
    maxPriorityFeePerGas
  });
}
function assertTransactionEIP2930(transaction) {
  const {
    chainId,
    maxPriorityFeePerGas,
    gasPrice,
    maxFeePerGas,
    to
  } = transaction;
  if (chainId <= 0) throw new InvalidChainIdError({
    chainId
  });
  if (to && !isAddress(to)) throw new InvalidAddressError({
    address: to
  });
  if (maxPriorityFeePerGas || maxFeePerGas) throw new BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.');
  if (gasPrice && gasPrice > maxUint256) throw new FeeCapTooHighError({
    maxFeePerGas: gasPrice
  });
}
function assertTransactionLegacy(transaction) {
  const {
    chainId,
    maxPriorityFeePerGas,
    gasPrice,
    maxFeePerGas,
    to
  } = transaction;
  if (to && !isAddress(to)) throw new InvalidAddressError({
    address: to
  });
  if (typeof chainId !== 'undefined' && chainId <= 0) throw new InvalidChainIdError({
    chainId
  });
  if (maxPriorityFeePerGas || maxFeePerGas) throw new BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.');
  if (gasPrice && gasPrice > maxUint256) throw new FeeCapTooHighError({
    maxFeePerGas: gasPrice
  });
}

/*
 * Serializes an EIP-7702 authorization list.
 */
function serializeAuthorizationList(authorizationList) {
  if (!authorizationList || authorizationList.length === 0) return [];
  const serializedAuthorizationList = [];
  for (const authorization of authorizationList) {
    const {
      contractAddress,
      chainId,
      nonce,
      ...signature
    } = authorization;
    serializedAuthorizationList.push([toHex(chainId), contractAddress, nonce ? toHex(nonce) : '0x', ...toYParitySignatureArray({}, signature)]);
  }
  return serializedAuthorizationList;
}

/*
 * Serialize an  EIP-2930 access list
 * @remarks
 * Use to create a transaction serializer with support for EIP-2930 access lists
 *
 * @param accessList - Array of objects of address and arrays of Storage Keys
 * @throws InvalidAddressError, InvalidStorageKeySizeError
 * @returns Array of hex strings
 */
function serializeAccessList(accessList) {
  if (!accessList || accessList.length === 0) return [];
  const serializedAccessList = [];
  for (let i = 0; i < accessList.length; i++) {
    const {
      address,
      storageKeys
    } = accessList[i];
    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({
          storageKey: storageKeys[j]
        });
      }
    }
    if (!isAddress(address, {
      strict: false
    })) {
      throw new InvalidAddressError({
        address
      });
    }
    serializedAccessList.push([address, storageKeys]);
  }
  return serializedAccessList;
}

function serializeTransaction(transaction, signature) {
  const type = getTransactionType(transaction);
  if (type === 'eip1559') return serializeTransactionEIP1559(transaction, signature);
  if (type === 'eip2930') return serializeTransactionEIP2930(transaction, signature);
  if (type === 'eip4844') return serializeTransactionEIP4844(transaction, signature);
  if (type === 'eip7702') return serializeTransactionEIP7702(transaction, signature);
  return serializeTransactionLegacy(transaction, signature);
}
function serializeTransactionEIP7702(transaction, signature) {
  const {
    authorizationList,
    chainId,
    gas,
    nonce,
    to,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    accessList,
    data
  } = transaction;
  assertTransactionEIP7702(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
  return concatHex(['0x04', toRlp([toHex(chainId), nonce ? toHex(nonce) : '0x', maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x', maxFeePerGas ? toHex(maxFeePerGas) : '0x', gas ? toHex(gas) : '0x', to ?? '0x', value ? toHex(value) : '0x', data ?? '0x', serializedAccessList, serializedAuthorizationList, ...toYParitySignatureArray(transaction, signature)])]);
}
function serializeTransactionEIP4844(transaction, signature) {
  const {
    chainId,
    gas,
    nonce,
    to,
    value,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    accessList,
    data
  } = transaction;
  assertTransactionEIP4844(transaction);
  let blobVersionedHashes = transaction.blobVersionedHashes;
  let sidecars = transaction.sidecars;
  // If `blobs` are passed, we will need to compute the KZG commitments & proofs.
  if (transaction.blobs && (typeof blobVersionedHashes === 'undefined' || typeof sidecars === 'undefined')) {
    const blobs = typeof transaction.blobs[0] === 'string' ? transaction.blobs : transaction.blobs.map(x => bytesToHex(x));
    const kzg = transaction.kzg;
    const commitments = blobsToCommitments({
      blobs,
      kzg
    });
    if (typeof blobVersionedHashes === 'undefined') blobVersionedHashes = commitmentsToVersionedHashes({
      commitments
    });
    if (typeof sidecars === 'undefined') {
      const proofs = blobsToProofs({
        blobs,
        commitments,
        kzg
      });
      sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs
      });
    }
  }
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [toHex(chainId), nonce ? toHex(nonce) : '0x', maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x', maxFeePerGas ? toHex(maxFeePerGas) : '0x', gas ? toHex(gas) : '0x', to ?? '0x', value ? toHex(value) : '0x', data ?? '0x', serializedAccessList, maxFeePerBlobGas ? toHex(maxFeePerBlobGas) : '0x', blobVersionedHashes ?? [], ...toYParitySignatureArray(transaction, signature)];
  const blobs = [];
  const commitments = [];
  const proofs = [];
  if (sidecars) for (let i = 0; i < sidecars.length; i++) {
    const {
      blob,
      commitment,
      proof
    } = sidecars[i];
    blobs.push(blob);
    commitments.push(commitment);
    proofs.push(proof);
  }
  return concatHex(['0x03', sidecars ?
  // If sidecars are enabled, envelope turns into a "wrapper":
  toRlp([serializedTransaction, blobs, commitments, proofs]) :
  // If sidecars are disabled, standard envelope is used:
  toRlp(serializedTransaction)]);
}
function serializeTransactionEIP1559(transaction, signature) {
  const {
    chainId,
    gas,
    nonce,
    to,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    accessList,
    data
  } = transaction;
  assertTransactionEIP1559(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [toHex(chainId), nonce ? toHex(nonce) : '0x', maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x', maxFeePerGas ? toHex(maxFeePerGas) : '0x', gas ? toHex(gas) : '0x', to ?? '0x', value ? toHex(value) : '0x', data ?? '0x', serializedAccessList, ...toYParitySignatureArray(transaction, signature)];
  return concatHex(['0x02', toRlp(serializedTransaction)]);
}
function serializeTransactionEIP2930(transaction, signature) {
  const {
    chainId,
    gas,
    data,
    nonce,
    to,
    value,
    accessList,
    gasPrice
  } = transaction;
  assertTransactionEIP2930(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [toHex(chainId), nonce ? toHex(nonce) : '0x', gasPrice ? toHex(gasPrice) : '0x', gas ? toHex(gas) : '0x', to ?? '0x', value ? toHex(value) : '0x', data ?? '0x', serializedAccessList, ...toYParitySignatureArray(transaction, signature)];
  return concatHex(['0x01', toRlp(serializedTransaction)]);
}
function serializeTransactionLegacy(transaction, signature) {
  const {
    chainId = 0,
    gas,
    data,
    nonce,
    to,
    value,
    gasPrice
  } = transaction;
  assertTransactionLegacy(transaction);
  let serializedTransaction = [nonce ? toHex(nonce) : '0x', gasPrice ? toHex(gasPrice) : '0x', gas ? toHex(gas) : '0x', to ?? '0x', value ? toHex(value) : '0x', data ?? '0x'];
  if (signature) {
    const v = (() => {
      // EIP-155 (inferred chainId)
      if (signature.v >= 35n) {
        const inferredChainId = (signature.v - 35n) / 2n;
        if (inferredChainId > 0) return signature.v;
        return 27n + (signature.v === 35n ? 0n : 1n);
      }
      // EIP-155 (explicit chainId)
      if (chainId > 0) return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
      // Pre-EIP-155 (no chainId)
      const v = 27n + (signature.v === 27n ? 0n : 1n);
      if (signature.v !== v) throw new InvalidLegacyVError({
        v: signature.v
      });
      return v;
    })();
    const r = trim(signature.r);
    const s = trim(signature.s);
    serializedTransaction = [...serializedTransaction, toHex(v), r === '0x00' ? '0x' : r, s === '0x00' ? '0x' : s];
  } else if (chainId > 0) {
    serializedTransaction = [...serializedTransaction, toHex(chainId), '0x', '0x'];
  }
  return toRlp(serializedTransaction);
}
function toYParitySignatureArray(transaction, signature_) {
  const signature = signature_ ?? transaction;
  const {
    v,
    yParity
  } = signature;
  if (typeof signature.r === 'undefined') return [];
  if (typeof signature.s === 'undefined') return [];
  if (typeof v === 'undefined' && typeof yParity === 'undefined') return [];
  const r = trim(signature.r);
  const s = trim(signature.s);
  const yParity_ = (() => {
    if (typeof yParity === 'number') return yParity ? toHex(1) : '0x';
    if (v === 0n) return '0x';
    if (v === 1n) return toHex(1);
    return v === 27n ? '0x' : toHex(1);
  })();
  return [yParity_, r === '0x00' ? '0x' : r, s === '0x00' ? '0x' : s];
}

const toTransactionInServerFormat = async params => {
  const {
    chain: {
      chainId,
      rpcUrl
    },
    currentAddress,
    transaction
  } = params;
  const {
    type = LEGACY_TYPE,
    from = currentAddress,
    to,
    value = "0x0",
    data = "0x",
    input,
    gasPrice = RONIN_GAS_PRICE,
    // * need rpc call to fill
    gas,
    nonce
  } = transaction;
  if (type !== LEGACY_TYPE && type !== RONIN_GAS_SPONSOR_TYPE) {
    throw new HeadlessClientError({
      cause: undefined,
      code: HeadlessClientErrorCode.UnsupportedTransactionTypeError,
      message: `The transaction with type="${type}" is not supported. Please switch to legacy transaction with type="0x0" or sponsored transaction with type="0x64".`
    });
  }
  if (!to || !isAddress(to)) {
    throw new HeadlessClientError({
      cause: undefined,
      code: HeadlessClientErrorCode.UnsupportedTransactionTypeError,
      message: `The transaction with to="${to}" (deploying new contracts) is not supported.`
    });
  }
  if (!from || !isAddress(from)) {
    throw new HeadlessClientError({
      cause: undefined,
      code: HeadlessClientErrorCode.PrepareTransactionError,
      message: `The transaction with from="${from}" is not valid.`
    });
  }
  if (!gas || !isHex(gas)) {
    throw new HeadlessClientError({
      cause: undefined,
      code: HeadlessClientErrorCode.PrepareTransactionError,
      message: `The transaction with gas="${gas}" is not valid.`
    });
  }
  const fillNonce = async () => {
    try {
      if (isHex(nonce)) {
        return hexToNumber(nonce);
      }
      const client = createClient({
        transport: http(rpcUrl)
      });
      return await getTransactionCount(client, {
        address: from,
        blockTag: "pending"
      });
    } catch (error) {
      throw new HeadlessClientError({
        cause: error,
        code: HeadlessClientErrorCode.PrepareTransactionError,
        message: `Unable to get nonce when preparing the transaction. This could be due to a slow network or an RPC status.`
      });
    }
  };
  const filledNonce = await fillNonce();
  try {
    const formattedTransaction = {
      type,
      from,
      to,
      value,
      input: input ?? data,
      gasPrice,
      gas,
      nonce: numberToHex(filledNonce),
      chainId: numberToHex(chainId),
      // placeholder fields
      r: "0x0",
      v: "0x0",
      s: "0x0",
      payerS: PAYER_INFO.s,
      payerR: PAYER_INFO.r,
      payerV: PAYER_INFO.v,
      maxFeePerGas: RONIN_GAS_PRICE,
      maxPriorityFeePerGas: RONIN_GAS_PRICE,
      expiredTime: "0x5208"
    };
    return formattedTransaction;
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.PrepareTransactionError,
      message: `Unable to transform transaction data to server format.`
    });
  }
};
const serializeLegacyTransaction = tx => {
  const {
    to,
    gasPrice,
    value,
    input,
    gas,
    nonce,
    chainId
  } = tx;
  const serializableTx = {
    type: "legacy",
    to: to,
    gasPrice: hexToBigInt(gasPrice),
    value: hexToBigInt(value),
    data: input,
    gas: hexToBigInt(gas),
    nonce: hexToNumber(nonce),
    chainId: hexToNumber(chainId)
  };
  const serializedTx = serializeTransaction(serializableTx);
  return serializedTx;
};

export { serializeLegacyTransaction, toTransactionInServerFormat };
