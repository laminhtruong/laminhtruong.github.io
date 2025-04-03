import { ServerError } from '../error/server.js';
import { request } from './helpers/request/request.js';
import { R as RONIN_GAS_SPONSOR_TYPE } from '../../common-DU-D5PxS.js';
import { toTransactionInServerFormat } from './send-transaction/prepare-tx.js';
import '../proto/rpc.js';
import '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';
import '../error/client.js';
import '../utils/token.js';
import '../../index-B3KPQWEG.js';
import './helpers/request/abort-controller.js';
import './helpers/request/configurations.js';
import '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../../size-CssOTqqV.js';
import '../../isAddress-BUhRlNtM.js';
import '../../keccak256-B1CwQAsk.js';
import '../../utils-CKEBUnDS.js';
import '../../sha256-scJRO6jx.js';
import '../../sha256-E5MvF2nn.js';
import '../../concat-CZcWoY2n.js';
import '../../slice-zoF_Vuu1.js';
import '../../http-CzuPfCha.js';
import '../../rpc-BGk0htDU.js';

const validateSponsorTransaction = async params => {
  const {
    httpUrl,
    waypointToken,
    transaction,
    chain,
    currentAddress
  } = params;
  const sponsoredTx = {
    ...transaction,
    type: RONIN_GAS_SPONSOR_TYPE
  };
  const serverTxData = await toTransactionInServerFormat({
    chain,
    transaction: sponsoredTx,
    currentAddress
  });
  const {
    data,
    error
  } = await request(`post ${httpUrl}/v1/public/tx-sponsor/validate`, {
    headers: {
      authorization: waypointToken
    },
    body: {
      tx: serverTxData
    }
  });
  if (data) {
    return data.data;
  }
  throw new ServerError({
    code: error.code,
    message: error.errorMessage
  });
};

export { validateSponsorTransaction };
