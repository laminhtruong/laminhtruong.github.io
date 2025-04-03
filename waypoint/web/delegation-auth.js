import { getDelegationScopesParams } from '../common/scope.js';
import { parseRedirectUrl } from './auth.js';
import { generateKeyPair, stringifyKeyPair, decryptClientShard, buildPrivateKey } from './utils/key-helper.js';
import { setStorage, STORAGE_SHARD_TRANSFER_KEY, getStorage } from './utils/storage.js';
import { validateIdAddress } from './utils/validate-address.js';
import { replaceUrl, openPopup } from '../common/popup.js';
import { v as v4 } from '../v4-CU-e4i5S.js';
import { CommunicateHelper } from '../common/communicate.js';
import { RONIN_WAYPOINT_ORIGIN_PROD } from '../common/gate.js';
import '../common/crypto.js';
import '../isAddress-BUhRlNtM.js';
import '../base-CC-Hj7CW.js';
import '../toBytes-rCiiThej.js';
import '../size-CssOTqqV.js';
import '../keccak256-B1CwQAsk.js';
import '../utils-CKEBUnDS.js';
import '../rpc-BGk0htDU.js';
import '../common/defer.js';
import '../common/waypoint-error.js';

const delegationAuthorize = async opts => {
  const {
    mode,
    clientId,
    scopes,
    waypointOrigin = RONIN_WAYPOINT_ORIGIN_PROD,
    redirectUrl = window.location.origin
  } = opts;
  const keyPair = await generateKeyPair();
  const stringifiedKeyPair = await stringifyKeyPair(keyPair);
  if (mode === "redirect") {
    setStorage(STORAGE_SHARD_TRANSFER_KEY, JSON.stringify(stringifiedKeyPair));
    replaceUrl(`${waypointOrigin}/client/${clientId}/authorize`, {
      redirect: redirectUrl,
      state: opts.state ?? v4(),
      scope: getDelegationScopesParams(scopes),
      publicKey: stringifiedKeyPair.publicKey
    });
    return undefined;
  }
  const helper = new CommunicateHelper(waypointOrigin);
  const authData = await helper.sendRequest(state => openPopup(`${waypointOrigin}/client/${clientId}/authorize`, {
    state,
    redirect: redirectUrl,
    origin: window.location.origin,
    scope: getDelegationScopesParams(scopes),
    publicKey: stringifiedKeyPair.publicKey
  }));
  const {
    id_token: token,
    address: rawAddress,
    secondary_address: secondaryAddress,
    wallet_key: encryptedShard
  } = authData ?? {};
  const clientShard = await decryptClientShard(encryptedShard, keyPair.privateKey);
  return {
    token,
    address: validateIdAddress(rawAddress),
    secondaryAddress: validateIdAddress(secondaryAddress),
    clientShard
  };
};
const parseRedirectUrlWithShard = async () => {
  const authData = parseRedirectUrl();
  const url = new URL(window.location.href);
  const encryptedShard = url.searchParams.get("wallet_key");
  if (!encryptedShard) {
    throw "parseRedirectUrl: encrypted shard not found";
  }
  const keyPair = getStorage(STORAGE_SHARD_TRANSFER_KEY);
  if (!keyPair) {
    throw "parseRedirectUrl: client shard key pair not found";
  }
  const privateKey = JSON.parse(keyPair).privateKey;
  const builtPrivateKey = await buildPrivateKey(privateKey);
  const clientShard = await decryptClientShard(encryptedShard, builtPrivateKey);
  return {
    ...authData,
    clientShard
  };
};

export { delegationAuthorize, parseRedirectUrlWithShard };
