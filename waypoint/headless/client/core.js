import { backupShard } from '../action/backup-shard.js';
import { decryptShard } from '../action/decrypt-shard.js';
import { encryptShard } from '../action/encrypt-shard.js';
import { g as getAddressFromShard } from '../../get-address-BA4hanCB.js';
import { getBackupClientShard } from '../action/get-backup-shard.js';
import { getUserProfile } from '../action/get-user-profile.js';
import { keygen } from '../action/keygen.js';
import { personalSign } from '../action/personal-sign.js';
import { R as RONIN_GAS_SPONSOR_TYPE } from '../../common-DU-D5PxS.js';
import { sendLegacyTransaction } from '../action/send-transaction/send-legacy.js';
import { sendSponsoredTransaction } from '../action/send-transaction/send-sponsored.js';
import { signTypedData } from '../action/sign-typed-data.js';
import { validateSponsorTransaction } from '../action/validate-sponsor-tx.js';
import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { getServiceUrls } from '../utils/service-url.js';
import { validateToken } from '../utils/token.js';
import { WASM_URL } from '../wasm/cdn.js';
import { HeadlessProvider } from './provider.js';
import { c as createClient, h as http } from '../../http-CzuPfCha.js';
import { VIEM_CHAIN_MAPPING } from '../../common/chain.js';
import { i as isAddress } from '../../isAddress-BUhRlNtM.js';
import '../../secp256k1-BWEYsKUq.js';
import '../../sha256-E5MvF2nn.js';
import '../../utils-CKEBUnDS.js';
import '../error/server.js';
import '../proto/rpc.js';
import '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';
import '../proto/backup.js';
import '../track/track.js';
import '../../index-B3KPQWEG.js';
import '../../common/version.js';
import '../../v4-CU-e4i5S.js';
import '../../sha256-scJRO6jx.js';
import '../../size-CssOTqqV.js';
import '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../utils/convertor.js';
import '../action/helpers/authenticate.js';
import '../proto/auth.js';
import '../../to-binary-CeOgQbf1.js';
import '../action/helpers/check-weak-bk.js';
import '../action/helpers/open-socket.js';
import '../../keccak256-B1CwQAsk.js';
import '../action/helpers/key.js';
import '../../concat-CZcWoY2n.js';
import '../action/helpers/request/abort-key.js';
import '../action/helpers/request/request.js';
import '../action/helpers/request/abort-controller.js';
import '../action/helpers/request/configurations.js';
import '../action/helpers/get-keygen-handler.js';
import '../wasm/create.js';
import '../wasm/instantiate.js';
import '../action/helpers/send-round-data.js';
import '../action/sign.js';
import '../proto/sign.js';
import '../utils/signature.js';
import '../action/helpers/get-sign-handler.js';
import '../action/helpers/trigger-sign.js';
import '../../isAddressEqual-CF4ISrAH.js';
import '../../recoverAddress-HX-s_kS6.js';
import '../action/send-transaction/prepare-tx.js';
import '../../slice-zoF_Vuu1.js';
import '../action/send-transaction/send-tx-request.js';
import '../action/send-transaction/to-tx-hash.js';
import '../proto/message.js';
import '../../prepare-typed-data-DR4j5Z4o.js';
import '../../_polyfill-node.events-BiZUWMRj.js';
import '../../rpc-BGk0htDU.js';

// ! Keep the same interface with internal libs
class HeadlessCore {
  chainId;
  rpcUrl;
  publicClient;
  waypointToken;
  clientShard;
  httpUrl;
  wsUrl;
  wasmUrl;
  constructor(opts) {
    const {
      chainId,
      overrideRpcUrl,
      waypointToken = "",
      clientShard = "",
      serviceEnv = "prod",
      wasmUrl = WASM_URL
    } = opts;
    const {
      httpUrl,
      wsUrl
    } = getServiceUrls(serviceEnv);
    this.waypointToken = waypointToken;
    this.clientShard = clientShard;
    this.httpUrl = httpUrl;
    this.wsUrl = wsUrl;
    this.wasmUrl = wasmUrl;
    this.chainId = chainId;
    if (overrideRpcUrl) {
      this.rpcUrl = overrideRpcUrl;
      this.publicClient = createClient({
        transport: http(overrideRpcUrl)
      });
    } else {
      const rpcUrl = VIEM_CHAIN_MAPPING[chainId]?.rpcUrls?.default?.http[0];
      if (!rpcUrl) {
        throw new HeadlessClientError({
          cause: undefined,
          code: HeadlessClientErrorCode.UnsupportedChainIdError,
          message: `Unsupported chain. Unable to find rpcUrl for chainId="${chainId}". Please provide an "overrideRpcUrl" parameter.`
        });
      }
      this.rpcUrl = rpcUrl;
      this.publicClient = createClient({
        chain: VIEM_CHAIN_MAPPING[chainId],
        transport: http()
      });
    }
  }
  static create = opts => {
    return new HeadlessCore(opts);
  };
  setWaypointToken = newToken => {
    this.waypointToken = newToken;
  };
  setClientShard = newShard => {
    this.clientShard = newShard;
  };
  isSignable = () => {
    const {
      waypointToken,
      clientShard
    } = this;
    try {
      const isValidShard = isAddress(getAddressFromShard(clientShard));
      const isValidToken = validateToken(waypointToken);
      return isValidShard && isValidToken;
    } catch (error) {
      /* empty */
    }
    return false;
  };
  genMpc = async () => {
    const {
      wasmUrl,
      wsUrl,
      waypointToken,
      setClientShard
    } = this;
    const clientShard = await keygen({
      wasmUrl,
      waypointToken,
      wsUrl
    });
    // ? set client shard for future action
    setClientShard(clientShard);
    return clientShard;
  };
  encryptClientShard = recoveryPassword => {
    const {
      clientShard,
      waypointToken
    } = this;
    return encryptShard({
      clientShard: clientShard,
      waypointToken,
      recoveryPassword
    });
  };
  decryptClientShard = async (encryptedShard, recoveryPassword) => {
    const {
      waypointToken,
      setClientShard
    } = this;
    const clientShard = await decryptShard({
      encryptedData: encryptedShard,
      recoveryPassword,
      waypointToken
    });
    // ? set client shard for future action
    setClientShard(clientShard);
    return clientShard;
  };
  backupClientShard = recoveryPassword => {
    const {
      wsUrl,
      waypointToken,
      clientShard
    } = this;
    return backupShard({
      clientShard: clientShard,
      waypointToken,
      recoveryPassword,
      wsUrl
    });
  };
  getAddress = () => {
    const {
      clientShard
    } = this;
    return getAddressFromShard(clientShard);
  };
  signMessage = message => {
    const {
      clientShard,
      wsUrl,
      waypointToken,
      wasmUrl
    } = this;
    return personalSign({
      message,
      clientShard,
      waypointToken,
      wsUrl,
      wasmUrl
    });
  };
  signTypedData = typedData => {
    const {
      clientShard,
      wsUrl,
      waypointToken,
      wasmUrl
    } = this;
    return signTypedData({
      typedData,
      clientShard,
      waypointToken,
      wsUrl,
      wasmUrl
    });
  };
  sendTransaction = transaction => {
    const {
      clientShard,
      waypointToken,
      wsUrl,
      wasmUrl,
      chainId,
      rpcUrl
    } = this;
    if (transaction.type === RONIN_GAS_SPONSOR_TYPE) {
      return sendSponsoredTransaction({
        clientShard,
        waypointToken,
        wsUrl,
        wasmUrl,
        transaction,
        chain: {
          chainId,
          rpcUrl
        }
      });
    }
    return sendLegacyTransaction({
      clientShard,
      waypointToken,
      wsUrl,
      wasmUrl,
      transaction,
      chain: {
        chainId,
        rpcUrl
      }
    });
  };
  getBackupClientShard = () => {
    const {
      httpUrl,
      waypointToken
    } = this;
    return getBackupClientShard({
      httpUrl,
      waypointToken
    });
  };
  getUserProfile = () => {
    const {
      httpUrl,
      waypointToken
    } = this;
    return getUserProfile({
      httpUrl,
      waypointToken
    });
  };
  validateSponsorTx = async transaction => {
    const {
      httpUrl,
      waypointToken,
      chainId,
      rpcUrl,
      getAddress
    } = this;
    const currentAddress = getAddress();
    return await validateSponsorTransaction({
      httpUrl,
      waypointToken,
      chain: {
        chainId,
        rpcUrl
      },
      transaction,
      currentAddress
    });
  };
  getProvider = () => {
    return HeadlessProvider.fromHeadlessCore(this);
  };
}

export { HeadlessCore };
