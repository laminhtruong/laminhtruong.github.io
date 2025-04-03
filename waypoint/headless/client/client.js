import { HeadlessCore } from './core.js';
import './provider.js';
import '../../get-address-BA4hanCB.js';
import '../action/decrypt-shard.js';
import '../action/encrypt-shard.js';
import '../action/backup-shard.js';
import '../action/keygen.js';
import '../action/personal-sign.js';
import '../action/sign-typed-data.js';
import '../action/send-transaction/send-legacy.js';
import '../action/send-transaction/send-sponsored.js';
import '../../common-DU-D5PxS.js';
import '../action/get-backup-shard.js';
import '../action/get-user-profile.js';
import '../action/validate-sponsor-tx.js';
import '../error/client.js';
import '../error/server.js';
import '../utils/token.js';
import '../wasm/cdn.js';
import '../utils/service-url.js';
import '../../http-CzuPfCha.js';
import '../../rpc-BGk0htDU.js';
import '../../base-CC-Hj7CW.js';
import '../../toBytes-rCiiThej.js';
import '../../size-CssOTqqV.js';
import '../../keccak256-B1CwQAsk.js';
import '../../utils-CKEBUnDS.js';
import '../../isAddress-BUhRlNtM.js';
import '../../common/chain.js';
import '../../secp256k1-BWEYsKUq.js';
import '../../sha256-E5MvF2nn.js';
import '../proto/rpc.js';
import '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';
import '../proto/backup.js';
import '../track/track.js';
import '../../index-B3KPQWEG.js';
import '../../common/version.js';
import '../../v4-CU-e4i5S.js';
import '../../sha256-scJRO6jx.js';
import '../utils/convertor.js';
import '../action/helpers/authenticate.js';
import '../proto/auth.js';
import '../../to-binary-CeOgQbf1.js';
import '../action/helpers/check-weak-bk.js';
import '../action/helpers/open-socket.js';
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

class HeadlessClient {
  core;
  constructor(opts) {
    const {
      chainId,
      overrideRpcUrl,
      wasmUrl,
      serviceEnv = "prod"
    } = opts;
    this.core = HeadlessCore.create({
      chainId,
      overrideRpcUrl,
      wasmUrl,
      serviceEnv
    });
  }
  static create = opts => {
    return new HeadlessClient(opts);
  };
  connect = params => {
    const {
      clientShard,
      waypointToken
    } = params;
    const {
      core
    } = this;
    core.setWaypointToken(waypointToken);
    core.setClientShard(clientShard);
    const address = core.getAddress();
    const provider = core.getProvider();
    return {
      address,
      provider
    };
  };
  connectWithPassword = async params => {
    const {
      recoveryPassword,
      waypointToken
    } = params;
    const {
      core
    } = this;
    core.setWaypointToken(waypointToken);
    const {
      key: backupShard
    } = await core.getBackupClientShard();
    const clientShard = await core.decryptClientShard(backupShard, recoveryPassword);
    const address = core.getAddress();
    const provider = core.getProvider();
    return {
      address,
      provider,
      clientShard
    };
  };
  isSignable = () => {
    return this.core.isSignable();
  };
  getAddress = () => {
    return this.core.getAddress();
  };
  getProvider = () => {
    return this.core.getProvider();
  };
  getUserProfile = () => {
    return this.core.getUserProfile();
  };
  validateSponsorTx = transaction => {
    return this.core.validateSponsorTx(transaction);
  };
}

export { HeadlessClient };
