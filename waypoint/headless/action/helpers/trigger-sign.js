import { HeadlessClientError, HeadlessClientErrorCode } from '../../error/client.js';
import { bytesToBase64, bytesToJson, base64ToHex } from '../../utils/convertor.js';
import '../../../toBytes-rCiiThej.js';
import '../../../base-CC-Hj7CW.js';
import '../../../size-CssOTqqV.js';

// * trigger signing process in wasm
const wasmTriggerSign = async (signHandler, keccakMessage, clientShard) => {
  try {
    const wasmSignParams = {
      key: clientShard,
      signMessage: bytesToBase64(keccakMessage)
    };
    const doResponse = await signHandler.do(JSON.stringify(wasmSignParams));
    const result = bytesToJson(doResponse);
    if (result?.data?.signature) {
      return base64ToHex(result.data.signature);
    }
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.WasmTriggerSignError,
      message: `Unable to trigger the WASM signing process.`
    });
  }
  throw new HeadlessClientError({
    cause: undefined,
    code: HeadlessClientErrorCode.WasmTriggerSignError,
    message: `Unable to get signature from WASM sign handler.`
  });
};

export { wasmTriggerSign };
