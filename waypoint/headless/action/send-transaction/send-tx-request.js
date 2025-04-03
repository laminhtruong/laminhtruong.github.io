import { Type, FrameSchema } from '../../proto/rpc.js';
import { SignType, SignRequestSchema } from '../../proto/sign.js';
import { jsonToBytes } from '../../utils/convertor.js';
import { t as toBinary } from '../../../to-binary-CeOgQbf1.js';
import { c as create } from '../../../file-8Ag42MRZ.js';
import '../../../enum-DxRJVtGK.js';
import '../../../toBytes-rCiiThej.js';
import '../../../base-CC-Hj7CW.js';
import '../../../size-CssOTqqV.js';

const sendTransactionRequest = (socket, txData, chain) => {
  const sendTransactionParams = {
    tx: txData,
    clientParams: {
      url: chain.rpcUrl,
      chainId: chain.chainId
    }
  };
  const signRequest = create(SignRequestSchema, {
    params: jsonToBytes(sendTransactionParams),
    type: SignType.TRANSACTION
  });
  const frame = create(FrameSchema, {
    data: toBinary(SignRequestSchema, signRequest),
    type: Type.DATA
  });
  socket.send(toBinary(FrameSchema, frame));
};

export { sendTransactionRequest };
