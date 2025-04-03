import { Type, FrameSchema } from '../proto/rpc.js';
import { SignType, SignRequestSchema } from '../proto/sign.js';
import { jsonToBytes, hexToBase64 } from '../utils/convertor.js';
import { toEthereumSignature } from '../utils/signature.js';
import { sendAuthenticate, decodeAuthenticateData } from './helpers/authenticate.js';
import { wasmGetSignHandler } from './helpers/get-sign-handler.js';
import { openSocket, createFrameQueue } from './helpers/open-socket.js';
import { decodeSessionAndTransferToWasm, decodeProtocolDataAndTransferToWasm, wasmGetProtocolData, sendProtocolData } from './helpers/send-round-data.js';
import { wasmTriggerSign } from './helpers/trigger-sign.js';
import { k as keccak256 } from '../../keccak256-B1CwQAsk.js';
import { t as toBinary } from '../../to-binary-CeOgQbf1.js';
import { c as create } from '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';
import '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../../size-CssOTqqV.js';
import '../../secp256k1-BWEYsKUq.js';
import '../../sha256-E5MvF2nn.js';
import '../../utils-CKEBUnDS.js';
import '../error/client.js';
import '../error/server.js';
import '../proto/auth.js';
import '../utils/token.js';
import '../../index-B3KPQWEG.js';
import '../../v4-CU-e4i5S.js';
import '../wasm/create.js';
import '../wasm/instantiate.js';

const sendSignMessageRequest = (socket, rawMessage) => {
  const signRequest = create(SignRequestSchema, {
    params: jsonToBytes(hexToBase64(rawMessage)),
    type: SignType.MESSAGE
  });
  const frame = create(FrameSchema, {
    type: Type.DATA,
    data: toBinary(SignRequestSchema, signRequest)
  });
  socket.send(toBinary(FrameSchema, frame));
};
const _sign = async params => {
  const {
    waypointToken,
    clientShard,
    rawMessage,
    wasmUrl,
    wsUrl
  } = params;
  const keccakMessage = keccak256(rawMessage, "bytes");
  console.debug("🔏 SIGN: start");
  const signHandler = await wasmGetSignHandler(wasmUrl);
  console.debug("🔏 SIGN: wasm is ready");
  const socket = await openSocket(`${wsUrl}/v1/public/ws/sign-v2`);
  const {
    waitAndDequeue
  } = createFrameQueue(socket);
  console.debug("🔏 SIGN: socket is ready");
  try {
    sendAuthenticate(socket, waypointToken);
    const authFrame = await waitAndDequeue();
    const authData = decodeAuthenticateData(authFrame);
    console.debug("🔏 SIGN: authenticated", authData.uuid);
    const signResultPromise = wasmTriggerSign(signHandler, keccakMessage, clientShard);
    console.debug("🔏 SIGN: trigger wasm sign");
    sendSignMessageRequest(socket, rawMessage);
    console.debug("🔏 SIGN: trigger socket sign");
    const sessionFrame = await waitAndDequeue();
    decodeSessionAndTransferToWasm(signHandler, sessionFrame);
    const socketR1 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR1);
    console.debug("🔏 SIGN: socket - round 1");
    const wasmR1 = await wasmGetProtocolData(signHandler);
    sendProtocolData(socket, wasmR1);
    console.debug("🔏 SIGN: wasm - round 1");
    const socketR2 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR2);
    console.debug("🔏 SIGN: socket - round 2");
    const wasmR2 = await wasmGetProtocolData(signHandler);
    sendProtocolData(socket, wasmR2);
    console.debug("🔏 SIGN: wasm - round 2");
    const socketR3 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR3);
    console.debug("🔏 SIGN: socket - round 3");
    const sessionR2Frame = await waitAndDequeue();
    decodeSessionAndTransferToWasm(signHandler, sessionR2Frame);
    const socketR4 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR4);
    console.debug("🔏 SIGN: socket - round 4");
    const wasmR3 = await wasmGetProtocolData(signHandler);
    sendProtocolData(socket, wasmR3);
    console.debug("🔏 SIGN: wasm - round 3");
    const socketR5 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR5);
    console.debug("🔏 SIGN: socket - round 5");
    const signature = await signResultPromise;
    console.debug("🔏 SIGN: done");
    return toEthereumSignature(signature);
  } finally {
    socket.close();
  }
};

export { _sign };
