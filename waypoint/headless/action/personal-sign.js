import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { createTracker, HeadlessEventName } from '../track/track.js';
import { g as getAddressFromShard } from '../../get-address-BA4hanCB.js';
import { _sign } from './sign.js';
import { a as concat } from '../../concat-CZcWoY2n.js';
import { s as size } from '../../size-CssOTqqV.js';
import { d as stringToHex, b as bytesToHex } from '../../toBytes-rCiiThej.js';
import { g as getAddress } from '../../isAddress-BUhRlNtM.js';
import { i as isAddressEqual } from '../../isAddressEqual-CF4ISrAH.js';
import { k as keccak256 } from '../../keccak256-B1CwQAsk.js';
import { r as recoverAddress } from '../../recoverAddress-HX-s_kS6.js';
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
import '../../base-CC-Hj7CW.js';
import '../../secp256k1-BWEYsKUq.js';
import '../utils/convertor.js';
import '../proto/sign.js';
import '../utils/signature.js';
import './helpers/authenticate.js';
import '../proto/auth.js';
import '../utils/token.js';
import '../../to-binary-CeOgQbf1.js';
import './helpers/get-sign-handler.js';
import '../wasm/create.js';
import '../wasm/instantiate.js';
import './helpers/open-socket.js';
import './helpers/send-round-data.js';
import './helpers/trigger-sign.js';

const presignMessagePrefix = '\x19Ethereum Signed Message:\n';

function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === 'string') return stringToHex(message_);
    if (typeof message_.raw === 'string') return message_.raw;
    return bytesToHex(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
  return concat([prefix, message]);
}

function hashMessage(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}

async function recoverMessageAddress({
  message,
  signature
}) {
  return recoverAddress({
    hash: hashMessage(message),
    signature
  });
}

/**
 * Verify that a message was signed by the provided address.
 *
 * Note:  Only supports Externally Owned Accounts. Does not support Contract Accounts.
 *        It is highly recommended to use `publicClient.verifyMessage` instead to ensure
 *        wallet interoperability.
 *
 * - Docs {@link https://viem.sh/docs/utilities/verifyMessage}
 *
 * @param parameters - {@link VerifyMessageParameters}
 * @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
 */
async function verifyMessage({
  address,
  message,
  signature
}) {
  return isAddressEqual(getAddress(address), await recoverMessageAddress({
    message,
    signature
  }));
}

const personalSign = async params => {
  const tracker = createTracker({
    event: HeadlessEventName.personalSign,
    waypointToken: params.waypointToken,
    productionFactor: params.wsUrl,
    wasmUrl: params.wasmUrl
  });
  try {
    const {
      message,
      ...restParams
    } = params;
    const address = getAddressFromShard(params.clientShard);
    const prefixedMessage = toPrefixedMessage(message);
    const signature = await _sign({
      ...restParams,
      rawMessage: prefixedMessage
    });
    const isValid = await verifyMessage({
      address: address,
      message,
      signature
    });
    if (!isValid) throw new HeadlessClientError({
      cause: undefined,
      code: HeadlessClientErrorCode.InvalidSignatureError,
      message: `Unable to verify the signature="${signature}" with the given address="${address}".`
    });
    tracker.trackOk({
      request: {
        message
      }
    });
    return signature;
  } catch (error) {
    tracker.trackError(error);
    throw error;
  }
};

export { personalSign };
