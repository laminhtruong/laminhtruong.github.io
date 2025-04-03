import { secp256k1 } from '../../secp256k1-BWEYsKUq.js';
import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { decodeServerError } from '../error/server.js';
import { BackupType, BackupRequestSchema, CreateBackupParamsSchema, BackupResponseSchema, ChallengeInfoSchema } from '../proto/backup.js';
import { Type, FrameSchema } from '../proto/rpc.js';
import { createTracker, HeadlessEventName } from '../track/track.js';
import { bytesToBase64 } from '../utils/convertor.js';
import { encryptShard } from './encrypt-shard.js';
import { a as getSecretFromShard } from '../../get-address-BA4hanCB.js';
import { sendAuthenticate, decodeAuthenticateData } from './helpers/authenticate.js';
import { checkWeakBk } from './helpers/check-weak-bk.js';
import { openSocket, createFrameQueue } from './helpers/open-socket.js';
import { t as toBinary } from '../../to-binary-CeOgQbf1.js';
import { c as create, a as fromBinary } from '../../file-8Ag42MRZ.js';
import { k as keccak256 } from '../../keccak256-B1CwQAsk.js';
import { s as stringToBytes } from '../../toBytes-rCiiThej.js';
import '../../sha256-E5MvF2nn.js';
import '../../utils-CKEBUnDS.js';
import '../../enum-DxRJVtGK.js';
import '../../index-B3KPQWEG.js';
import '../../common/version.js';
import '../utils/service-url.js';
import '../../v4-CU-e4i5S.js';
import '../../sha256-scJRO6jx.js';
import '../../size-CssOTqqV.js';
import './helpers/key.js';
import '../../concat-CZcWoY2n.js';
import '../../base-CC-Hj7CW.js';
import '../../isAddress-BUhRlNtM.js';
import '../proto/auth.js';
import '../utils/token.js';

const sendBackupRequest = socket => {
  const backupRequest = create(BackupRequestSchema, {
    type: BackupType.CHALLENGE
  });
  const frame = create(FrameSchema, {
    type: Type.DATA,
    data: toBinary(BackupRequestSchema, backupRequest)
  });
  socket.send(toBinary(FrameSchema, frame));
};
const sendEncryptedShard = (socket, encryptedShard, signature) => {
  const createBackupParams = create(CreateBackupParamsSchema, {
    encryptedKey: encryptedShard,
    signResult: bytesToBase64(signature)
  });
  const backupRequest = create(BackupRequestSchema, {
    type: BackupType.CREATE,
    params: toBinary(CreateBackupParamsSchema, createBackupParams)
  });
  const frame = create(FrameSchema, {
    type: Type.DATA,
    data: toBinary(BackupRequestSchema, backupRequest)
  });
  socket.send(toBinary(FrameSchema, frame));
};
const decodeSignChallenge = challengeResponseFrame => {
  if (challengeResponseFrame.type !== Type.DATA) throw decodeServerError(challengeResponseFrame);
  try {
    const challengeResponse = fromBinary(BackupResponseSchema, challengeResponseFrame.data);
    const {
      challengeString
    } = fromBinary(ChallengeInfoSchema, challengeResponse.result);
    const signChallenge = keccak256(stringToBytes(challengeString), "bytes");
    return signChallenge;
  } catch (error) {
    throw new HeadlessClientError({
      code: HeadlessClientErrorCode.BackupClientShardError,
      message: `Unable to decode frame data received from the server. The data should be in a sign challenge schema.`,
      cause: error
    });
  }
};
const signChallenge = (signChallenge, secret) => {
  try {
    const signature = secp256k1.sign(signChallenge, secret);
    return signature.toCompactRawBytes();
  } catch (error) {
    throw new HeadlessClientError({
      code: HeadlessClientErrorCode.BackupClientShardError,
      message: `Unable to sign the challenge with the client shard.`,
      cause: error
    });
  }
};
const _backupShard = async params => {
  const {
    waypointToken,
    clientShard,
    recoveryPassword,
    wsUrl
  } = params;
  const secret = getSecretFromShard(clientShard);
  const encryptedShard = await encryptShard({
    clientShard,
    recoveryPassword,
    waypointToken
  });
  console.debug("🔐 BACKUP: start");
  const socket = await openSocket(`${wsUrl}/v1/public/ws/backup/keys`);
  const {
    waitAndDequeue
  } = createFrameQueue(socket);
  console.debug("🔐 BACKUP: socket is ready");
  try {
    sendAuthenticate(socket, waypointToken);
    const authFrame = await waitAndDequeue();
    const authData = decodeAuthenticateData(authFrame);
    console.debug("🔐 BACKUP: authenticated", authData.uuid);
    sendBackupRequest(socket);
    const challengeFrame = await waitAndDequeue();
    const challenge = decodeSignChallenge(challengeFrame);
    const signature = signChallenge(challenge, secret);
    sendEncryptedShard(socket, encryptedShard, signature);
    const doneFrame = await waitAndDequeue();
    if (doneFrame.type !== Type.DONE) throw decodeServerError(doneFrame);
    console.debug("🔐 BACKUP: done");
    return encryptedShard;
  } finally {
    socket.close();
  }
};
const backupShard = async params => {
  const {
    recoveryPassword,
    waypointToken,
    wsUrl
  } = params;
  const tracker = createTracker({
    event: HeadlessEventName.backupShard,
    waypointToken,
    productionFactor: wsUrl
  });
  try {
    const result = await _backupShard(params);
    tracker.trackOk({
      request: {
        isWeakBk: checkWeakBk(recoveryPassword)
      }
    });
    return result;
  } catch (error) {
    tracker.trackError(error);
    throw error;
  }
};

export { backupShard };
