import { decodeServerError } from '../../error/server.js';
import { Type } from '../../proto/rpc.js';
import { createTracker, HeadlessEventName } from '../../track/track.js';
import { g as getAddressFromShard } from '../../../get-address-BA4hanCB.js';
import { sendAuthenticate, decodeAuthenticateData } from '../helpers/authenticate.js';
import { wasmGetSignHandler } from '../helpers/get-sign-handler.js';
import { openSocket, createFrameQueue } from '../helpers/open-socket.js';
import { decodeSessionAndTransferToWasm, decodeProtocolDataAndTransferToWasm, wasmGetProtocolData, sendProtocolData } from '../helpers/send-round-data.js';
import { wasmTriggerSign } from '../helpers/trigger-sign.js';
import { toTransactionInServerFormat, serializeLegacyTransaction } from './prepare-tx.js';
import { sendTransactionRequest } from './send-tx-request.js';
import { toTxHash } from './to-tx-hash.js';
import { k as keccak256 } from '../../../keccak256-B1CwQAsk.js';
import '../../error/client.js';
import '../../../file-8Ag42MRZ.js';
import '../../../enum-DxRJVtGK.js';
import '../../../index-B3KPQWEG.js';
import '../../../common/version.js';
import '../../utils/service-url.js';
import '../../../v4-CU-e4i5S.js';
import '../../../sha256-scJRO6jx.js';
import '../../../sha256-E5MvF2nn.js';
import '../../../utils-CKEBUnDS.js';
import '../../../size-CssOTqqV.js';
import '../../../toBytes-rCiiThej.js';
import '../../../base-CC-Hj7CW.js';
import '../../../secp256k1-BWEYsKUq.js';
import '../../utils/convertor.js';
import '../../../isAddress-BUhRlNtM.js';
import '../../proto/auth.js';
import '../../utils/token.js';
import '../../../to-binary-CeOgQbf1.js';
import '../../wasm/create.js';
import '../../wasm/instantiate.js';
import '../../../common-DU-D5PxS.js';
import '../../../concat-CZcWoY2n.js';
import '../../../slice-zoF_Vuu1.js';
import '../../../http-CzuPfCha.js';
import '../../../rpc-BGk0htDU.js';
import '../../proto/sign.js';

const _sendLegacyTransaction = async params => {
  const {
    waypointToken,
    clientShard,
    transaction,
    chain,
    wasmUrl,
    wsUrl
  } = params;
  const address = getAddressFromShard(clientShard);
  const txInServerFormat = await toTransactionInServerFormat({
    chain,
    transaction,
    currentAddress: address
  });
  const serializedTx = serializeLegacyTransaction(txInServerFormat);
  const keccakSerializedTx = keccak256(serializedTx, "bytes");
  console.debug("🔏 SEND TX: start");
  const signHandler = await wasmGetSignHandler(wasmUrl);
  console.debug("🔏 SEND TX: wasm is ready");
  const socket = await openSocket(`${wsUrl}/v1/public/ws/send`);
  const {
    waitAndDequeue
  } = createFrameQueue(socket);
  console.debug("🔏 SEND TX: socket is ready");
  try {
    sendAuthenticate(socket, waypointToken);
    const authFrame = await waitAndDequeue();
    const authData = decodeAuthenticateData(authFrame);
    console.debug("🔏 SEND TX: authenticated", authData.uuid);
    const signResultPromise = wasmTriggerSign(signHandler, keccakSerializedTx, clientShard);
    console.debug("🔏 SEND TX: trigger wasm sign");
    sendTransactionRequest(socket, txInServerFormat, chain);
    console.debug("🔏 SEND TX: trigger socket sign");
    const sessionFrame = await waitAndDequeue();
    decodeSessionAndTransferToWasm(signHandler, sessionFrame);
    const socketR1 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR1);
    console.debug("🔏 SEND TX: socket - round 1");
    const wasmR1 = await wasmGetProtocolData(signHandler);
    sendProtocolData(socket, wasmR1);
    console.debug("🔏 SEND TX: wasm - round 1");
    const socketR2 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR2);
    console.debug("🔏 SEND TX: socket - round 2");
    const wasmR2 = await wasmGetProtocolData(signHandler);
    sendProtocolData(socket, wasmR2);
    console.debug("🔏 SEND TX: wasm - round 2");
    const socketR3 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR3);
    console.debug("🔏 SEND TX: socket - round 3");
    const sessionR2Frame = await waitAndDequeue();
    decodeSessionAndTransferToWasm(signHandler, sessionR2Frame);
    const socketR4 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR4);
    console.debug("🔏 SEND TX: socket - round 4");
    const wasmR3 = await wasmGetProtocolData(signHandler);
    sendProtocolData(socket, wasmR3);
    console.debug("🔏 SEND TX: wasm - round 3");
    const socketR5 = await waitAndDequeue();
    decodeProtocolDataAndTransferToWasm(signHandler, socketR5);
    console.debug("🔏 SEND TX: socket - round 5");
    const sendTransactionResponseFrame = await waitAndDequeue();
    const txHash = toTxHash(sendTransactionResponseFrame);
    const doneFrame = await waitAndDequeue();
    if (doneFrame.type !== Type.DONE) throw decodeServerError(doneFrame);
    const signature = await signResultPromise;
    console.debug("🔏 SEND TX: done");
    return {
      txHash: txHash,
      signature
    };
  } finally {
    socket.close();
  }
};
const sendLegacyTransaction = async params => {
  const {
    chain,
    transaction,
    wasmUrl,
    waypointToken,
    wsUrl
  } = params;
  const tracker = createTracker({
    event: HeadlessEventName.sendLegacyTransaction,
    waypointToken,
    productionFactor: wsUrl,
    wasmUrl
  });
  try {
    const result = await _sendLegacyTransaction(params);
    const {
      txHash
    } = result;
    tracker.trackOk({
      request: {
        transaction,
        chain
      },
      response: {
        txHash
      }
    });
    return result;
  } catch (error) {
    tracker.trackError(error);
    throw error;
  }
};

export { sendLegacyTransaction };
