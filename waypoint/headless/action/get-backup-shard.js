import { ServerError } from '../error/server.js';
import { AbortKey } from './helpers/request/abort-key.js';
import { request } from './helpers/request/request.js';
import '../proto/rpc.js';
import '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';
import '../error/client.js';
import '../utils/token.js';
import '../../index-B3KPQWEG.js';
import './helpers/request/abort-controller.js';
import './helpers/request/configurations.js';

const getBackupClientShard = async params => {
  const {
    httpUrl,
    waypointToken
  } = params;
  const {
    data,
    error
  } = await request(`get ${httpUrl}/v1/public/backup/keys`, {
    headers: {
      authorization: waypointToken
    },
    key: AbortKey.getBackupClientShard
  });
  if (data) {
    return data.data;
  }
  throw new ServerError({
    code: error.code,
    message: error.errorMessage
  });
};

export { getBackupClientShard };
