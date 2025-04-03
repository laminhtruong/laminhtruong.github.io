import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { createTracker, HeadlessEventName } from '../track/track.js';
import { bytesToJson } from '../utils/convertor.js';
import { sendAuthenticate, decodeAuthenticateData } from './helpers/authenticate.js';
import { wasmGetKeygenHandler } from './helpers/get-keygen-handler.js';
import { openSocket, createFrameQueue } from './helpers/open-socket.js';
import { decodeSessionAndTransferToWasm, decodeProtocolDataAndTransferToWasm, wasmGetProtocolData, sendProtocolData } from './helpers/send-round-data.js';
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
import '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../proto/auth.js';
import '../utils/token.js';
import '../../to-binary-CeOgQbf1.js';
import '../wasm/create.js';
import '../wasm/instantiate.js';

const wasmTriggerKeygen = async keygenHandler => {
  try {
    const doResponse = await keygenHandler.do("");
    const result = bytesToJson(doResponse);
    return result;
  } catch (error) {
    throw new HeadlessClientError({
      cause: error,
      code: HeadlessClientErrorCode.WasmTriggerKeygenError,
      message: `Unable to trigger the WASM keygen process. This could be due to a wrong version of WASM.`
    });
  }
};
const _keygen = async params => {
  const {
    waypointToken,
    wasmUrl,
    wsUrl
  } = params;
  console.debug("🔐 KEYGEN: start");
  const keygenHandler = await wasmGetKeygenHandler(wasmUrl);
  console.debug("🔐 KEYGEN: wasm is ready");
  const socket = await openSocket(`${wsUrl}/v1/public/ws/keygen`);
  const {
    waitAndDequeue
  } = createFrameQueue(socket);
  console.debug("🔐 KEYGEN: socket is ready");
  try {
    sendAuthenticate(socket, waypointToken);
    const authFrame = await waitAndDequeue();
    const authData = decodeAuthenticateData(authFrame);
    console.debug("🔐 KEYGEN: authenticated", authData.uuid);
    const keygenResultPromise = wasmTriggerKeygen(keygenHandler);
    console.debug("🔐 KEYGEN: trigger wasm keygen");
    const sessionFrame = await waitAndDequeue();
    decodeSessionAndTransferToWasm(keygenHandler, sessionFrame);
    const socketR1 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(keygenHandler, socketR1);
    console.debug("🔐 KEYGEN: socket - round 1");
    const wasmR1 = await wasmGetProtocolData(keygenHandler);
    sendProtocolData(socket, wasmR1);
    console.debug("🔐 KEYGEN: wasm - round 1");
    const socketR2 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(keygenHandler, socketR2);
    console.debug("🔐 KEYGEN: socket - round 2");
    const wasmR2 = await wasmGetProtocolData(keygenHandler);
    sendProtocolData(socket, wasmR2);
    console.debug("🔐 KEYGEN: wasm - round 2");
    const socketR3 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(keygenHandler, socketR3);
    console.debug("🔐 KEYGEN: socket - round 3");
    const keygenResult = await keygenResultPromise;
    console.debug("🔐 KEYGEN: done");
    return keygenResult.data.key;
  } finally {
    socket.close();
  }
};
const keygen = async params => {
  const {
    waypointToken,
    wasmUrl,
    wsUrl
  } = params;
  const tracker = createTracker({
    event: HeadlessEventName.keygen,
    waypointToken,
    productionFactor: wsUrl,
    wasmUrl
  });
  try {
    const result = await _keygen(params);
    tracker.trackOk({});
    return result;
  } catch (error) {
    tracker.trackError(error);
    throw error;
  }
};

export { keygen };
