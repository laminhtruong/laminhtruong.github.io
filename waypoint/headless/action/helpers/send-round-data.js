import { HeadlessClientError, HeadlessClientErrorCode } from '../../error/client.js';
import { decodeServerError } from '../../error/server.js';
import { Type, SessionSchema, FrameSchema } from '../../proto/rpc.js';
import { bytesToJson, bytesToBase64, jsonToBytes, base64ToBytes } from '../../utils/convertor.js';
import { a as fromBinary, c as create } from '../../../file-8Ag42MRZ.js';
import { t as toBinary } from '../../../to-binary-CeOgQbf1.js';
import '../../../enum-DxRJVtGK.js';
import '../../../toBytes-rCiiThej.js';
import '../../../base-CC-Hj7CW.js';
import '../../../size-CssOTqqV.js';

const wasmGetProtocolData = async signHandler => {
  try {
    const wasmResultInBytes = await signHandler.rx();
    const wasmResult = bytesToJson(wasmResultInBytes);
    const {
      kind,
      data
    } = wasmResult ?? {};
    if (kind === "mpc_protocol" && data) {
      return data;
    }
    throw "Protocol data received from WASM is not valid.";
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.WasmGetProtocolResultError,
      message: `Unable to receive the protocol round data from WASM process.`
    });
  }
};
const decodeProtocolDataAndTransferToWasm = (signHandler, frame) => {
  if (frame.type !== Type.DATA) throw decodeServerError(frame);
  try {
    const txParams = {
      kind: "mpc_protocol",
      data: bytesToBase64(frame.data)
    };
    signHandler.tx(jsonToBytes(txParams));
    return;
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.WasmReceiveSocketDataError,
      message: `Unable to transfer the protocol data from the socket to WASM.`
    });
  }
};
const decodeSessionAndTransferToWasm = (signHandler, frame) => {
  if (frame.type !== Type.DATA) throw decodeServerError(frame);
  try {
    const session = fromBinary(SessionSchema, frame.data);
    const txParams = {
      kind: "mpc_protocol",
      data: {
        sessionID: session.sessionId
      }
    };
    signHandler.tx(jsonToBytes(txParams));
    return;
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.WasmReceiveSocketDataError,
      message: `Unable to transfer the session data from the socket to WASM.`
    });
  }
};
const sendProtocolData = (socket, base64Data) => {
  const frame = create(FrameSchema, {
    type: Type.DATA,
    data: base64ToBytes(base64Data)
  });
  socket.send(toBinary(FrameSchema, frame));
};

export { decodeProtocolDataAndTransferToWasm, decodeSessionAndTransferToWasm, sendProtocolData, wasmGetProtocolData };
