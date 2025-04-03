import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { createTracker, HeadlessEventName } from '../track/track.js';
import { g as getAddressFromShard } from '../../get-address-BA4hanCB.js';
import { h as hashTypedData, p as prepareTypedData } from '../../prepare-typed-data-DR4j5Z4o.js';
import { _sign } from './sign.js';
import { g as getAddress } from '../../isAddress-BUhRlNtM.js';
import { i as isAddressEqual } from '../../isAddressEqual-CF4ISrAH.js';
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
import '../../size-CssOTqqV.js';
import '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../../secp256k1-BWEYsKUq.js';
import '../utils/convertor.js';
import '../../keccak256-B1CwQAsk.js';
import '../../concat-CZcWoY2n.js';
import '../../slice-zoF_Vuu1.js';
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

async function recoverTypedDataAddress(parameters) {
  const {
    domain,
    message,
    primaryType,
    signature,
    types
  } = parameters;
  return recoverAddress({
    hash: hashTypedData({
      domain,
      message,
      primaryType,
      types
    }),
    signature
  });
}

/**
 * Verify that typed data was signed by the provided address.
 *
 * Note:  Only supports Externally Owned Accounts. Does not support Contract Accounts.
 *        It is highly recommended to use `publicClient.verifyTypedData` instead to ensure
 *        wallet interoperability.
 *
 * - Docs {@link https://viem.sh/docs/utilities/verifyTypedData}
 *
 * @param parameters - {@link VerifyTypedDataParameters}
 * @returns Whether or not the signature is valid. {@link VerifyTypedDataReturnType}
 */
async function verifyTypedData(parameters) {
  const {
    address,
    domain,
    message,
    primaryType,
    signature,
    types
  } = parameters;
  return isAddressEqual(getAddress(address), await recoverTypedDataAddress({
    domain,
    message,
    primaryType,
    signature,
    types
  }));
}

const signTypedData = async params => {
  const tracker = createTracker({
    event: HeadlessEventName.signTypedData,
    waypointToken: params.waypointToken,
    productionFactor: params.wsUrl,
    wasmUrl: params.wasmUrl
  });
  try {
    const {
      typedData,
      ...restParams
    } = params;
    const address = getAddressFromShard(params.clientShard);
    const rawMessage = prepareTypedData(typedData);
    const signature = await _sign({
      ...restParams,
      rawMessage: rawMessage
    });
    const isValid = await verifyTypedData({
      ...typedData,
      address: address,
      signature
    });
    if (!isValid) throw new HeadlessClientError({
      cause: undefined,
      code: HeadlessClientErrorCode.InvalidSignatureError,
      message: `Unable to verify the signature="${signature}" with the given address="${address}".`
    });
    tracker.trackOk({
      request: {
        typedData
      }
    });
    return signature;
  } catch (error) {
    tracker.trackError(error);
    throw error;
  }
};

export { signTypedData };
