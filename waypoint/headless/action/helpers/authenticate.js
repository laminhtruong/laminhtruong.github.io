import { HeadlessClientError, HeadlessClientErrorCode } from '../../error/client.js';
import { decodeServerError } from '../../error/server.js';
import { AuthenticateRequestSchema, AuthenticateResponseSchema } from '../../proto/auth.js';
import { Type, FrameSchema } from '../../proto/rpc.js';
import { addBearerPrefix } from '../../utils/token.js';
import { c as create, a as fromBinary } from '../../../file-8Ag42MRZ.js';
import { v as v4 } from '../../../v4-CU-e4i5S.js';
import { t as toBinary } from '../../../to-binary-CeOgQbf1.js';
import '../../../enum-DxRJVtGK.js';
import '../../../index-B3KPQWEG.js';

const sendAuthenticate = (socket, waypointToken) => {
  const authRequest = create(AuthenticateRequestSchema, {
    token: addBearerPrefix(waypointToken),
    optionalData: {
      requestId: v4()
    }
  });
  const frame = create(FrameSchema, {
    data: toBinary(AuthenticateRequestSchema, authRequest),
    type: Type.DATA
  });
  socket.send(toBinary(FrameSchema, frame));
};
const decodeAuthenticateData = authFrame => {
  if (authFrame.type !== Type.DATA) throw decodeServerError(authFrame);
  try {
    const authResponse = fromBinary(AuthenticateResponseSchema, authFrame.data);
    return authResponse;
  } catch (error) {
    throw new HeadlessClientError({
      code: HeadlessClientErrorCode.AuthenticateError,
      message: `Unable to decode frame data received from the server. The data should be in a authenticate response schema.`,
      cause: error
    });
  }
};

export { decodeAuthenticateData, sendAuthenticate };
