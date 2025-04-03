import { HeadlessClientError, HeadlessClientErrorCode } from '../../error/client.js';
import { decodeServerError } from '../../error/server.js';
import { Type } from '../../proto/rpc.js';
import { SendTransactionResponseSchema } from '../../proto/sign.js';
import { a as fromBinary } from '../../../file-8Ag42MRZ.js';
import { i as isHex, s as size } from '../../../size-CssOTqqV.js';
import '../../../enum-DxRJVtGK.js';

function isHash(hash) {
  return isHex(hash) && size(hash) === 32;
}

const toTxHash = sendTxResponseFrame => {
  if (sendTxResponseFrame.type !== Type.DATA) throw decodeServerError(sendTxResponseFrame);
  try {
    const {
      txHash
    } = fromBinary(SendTransactionResponseSchema, sendTxResponseFrame.data);
    if (!isHash(txHash)) {
      throw "Invalid transaction hash";
    }
    return txHash;
  } catch (error) {
    throw new HeadlessClientError({
      code: HeadlessClientErrorCode.SendTransactionError,
      message: `Unable to decode frame data received from the server. The data should be in a transaction hash schema.`,
      cause: error
    });
  }
};

export { toTxHash };
