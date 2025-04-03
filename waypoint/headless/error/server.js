import { Type, ErrorSchema } from '../proto/rpc.js';
import { HeadlessClientError, HeadlessClientErrorCode } from './client.js';
import { a as fromBinary } from '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';

var ServerErrorCode;
(function (ServerErrorCode) {
  ServerErrorCode[ServerErrorCode["OK"] = 0] = "OK";
  ServerErrorCode[ServerErrorCode["Canceled"] = 1] = "Canceled";
  ServerErrorCode[ServerErrorCode["Unknown"] = 2] = "Unknown";
  ServerErrorCode[ServerErrorCode["InvalidArgument"] = 3] = "InvalidArgument";
  ServerErrorCode[ServerErrorCode["DeadlineExceeded"] = 4] = "DeadlineExceeded";
  ServerErrorCode[ServerErrorCode["NotFound"] = 5] = "NotFound";
  ServerErrorCode[ServerErrorCode["AlreadyExists"] = 6] = "AlreadyExists";
  ServerErrorCode[ServerErrorCode["PermissionDenied"] = 7] = "PermissionDenied";
  ServerErrorCode[ServerErrorCode["ResourceExhausted"] = 8] = "ResourceExhausted";
  ServerErrorCode[ServerErrorCode["FailedPrecondition"] = 9] = "FailedPrecondition";
  ServerErrorCode[ServerErrorCode["Aborted"] = 10] = "Aborted";
  ServerErrorCode[ServerErrorCode["OutOfRange"] = 11] = "OutOfRange";
  ServerErrorCode[ServerErrorCode["Unimplemented"] = 12] = "Unimplemented";
  ServerErrorCode[ServerErrorCode["Internal"] = 13] = "Internal";
  ServerErrorCode[ServerErrorCode["Unavailable"] = 14] = "Unavailable";
  ServerErrorCode[ServerErrorCode["DataLoss"] = 15] = "DataLoss";
  ServerErrorCode[ServerErrorCode["Unauthenticated"] = 16] = "Unauthenticated";
  ServerErrorCode[ServerErrorCode["NotSupported"] = 17] = "NotSupported";
  // Custom Error
  ServerErrorCode[ServerErrorCode["MPCInitializeProtocolFailed"] = 20] = "MPCInitializeProtocolFailed";
  ServerErrorCode[ServerErrorCode["MPCHandshakeProtocolFailed"] = 21] = "MPCHandshakeProtocolFailed";
  ServerErrorCode[ServerErrorCode["MPCBadSignature"] = 22] = "MPCBadSignature";
  ServerErrorCode[ServerErrorCode["MPCSignatureVerifyFailed"] = 23] = "MPCSignatureVerifyFailed";
  ServerErrorCode[ServerErrorCode["MPCServerStoreKeyFailed"] = 24] = "MPCServerStoreKeyFailed";
  ServerErrorCode[ServerErrorCode["MPCBadResult"] = 25] = "MPCBadResult";
  ServerErrorCode[ServerErrorCode["MPCSendTxRequestFailed"] = 26] = "MPCSendTxRequestFailed";
  ServerErrorCode[ServerErrorCode["MPCBadKey"] = 27] = "MPCBadKey";
  ServerErrorCode[ServerErrorCode["MPCSignMessageFailed"] = 28] = "MPCSignMessageFailed";
  ServerErrorCode[ServerErrorCode["MPCSendTxFailed"] = 29] = "MPCSendTxFailed";
  ServerErrorCode[ServerErrorCode["MPCAddressAlreadyExisted"] = 30] = "MPCAddressAlreadyExisted";
  ServerErrorCode[ServerErrorCode["MPCChallengeFailed"] = 31] = "MPCChallengeFailed";
  ServerErrorCode[ServerErrorCode["MPCGetNonceFailed"] = 32] = "MPCGetNonceFailed";
  ServerErrorCode[ServerErrorCode["DialSocketFailed"] = 100] = "DialSocketFailed";
  ServerErrorCode[ServerErrorCode["WriteDataFailed"] = 101] = "WriteDataFailed";
  ServerErrorCode[ServerErrorCode["ReadDataFailed"] = 102] = "ReadDataFailed";
  ServerErrorCode[ServerErrorCode["BadRPCData"] = 103] = "BadRPCData";
  ServerErrorCode[ServerErrorCode["BadSignMessageData"] = 104] = "BadSignMessageData";
  ServerErrorCode[ServerErrorCode["BadTxData"] = 105] = "BadTxData";
  ServerErrorCode[ServerErrorCode["InitHTTPFailed"] = 106] = "InitHTTPFailed";
  ServerErrorCode[ServerErrorCode["DoHTTPFailed"] = 107] = "DoHTTPFailed";
  ServerErrorCode[ServerErrorCode["BadHTTPData"] = 108] = "BadHTTPData";
  ServerErrorCode[ServerErrorCode["DialRPCNodeFailed"] = 109] = "DialRPCNodeFailed";
  ServerErrorCode[ServerErrorCode["HitRateLimitUUID"] = 110] = "HitRateLimitUUID";
  ServerErrorCode[ServerErrorCode["InvalidNonce"] = 111] = "InvalidNonce";
  ServerErrorCode[ServerErrorCode["BadPayerSignature"] = 112] = "BadPayerSignature";
  ServerErrorCode[ServerErrorCode["GetPayerSignatureFailed"] = 113] = "GetPayerSignatureFailed";
  ServerErrorCode[ServerErrorCode["DecodePayerSignatureFailed"] = 114] = "DecodePayerSignatureFailed";
  ServerErrorCode[ServerErrorCode["InitSiweMessageFailed"] = 115] = "InitSiweMessageFailed";
  ServerErrorCode[ServerErrorCode["ParseSiweResourceFailed"] = 116] = "ParseSiweResourceFailed";
  ServerErrorCode[ServerErrorCode["BadExpiredTime"] = 117] = "BadExpiredTime";
  ServerErrorCode[ServerErrorCode["GetPayerAccessTokenFailed"] = 118] = "GetPayerAccessTokenFailed";
  ServerErrorCode[ServerErrorCode["BadRPCURL"] = 119] = "BadRPCURL";
  ServerErrorCode[ServerErrorCode["TxNotSponsored"] = 120] = "TxNotSponsored";
  ServerErrorCode[ServerErrorCode["TxSponsorNoAppLocalSponsorProgram"] = 121] = "TxSponsorNoAppLocalSponsorProgram";
  ServerErrorCode[ServerErrorCode["TxSponsorExceedcap"] = 122] = "TxSponsorExceedcap";
  // Policy rules
  ServerErrorCode[ServerErrorCode["PolicyFailed"] = 1001] = "PolicyFailed";
  ServerErrorCode[ServerErrorCode["UserIDNotAllowed"] = 1002] = "UserIDNotAllowed";
  ServerErrorCode[ServerErrorCode["PolicyMatchDenyList"] = 1003] = "PolicyMatchDenyList";
  ServerErrorCode[ServerErrorCode["DailyNativeTokenTransferredReachLimit"] = 1005] = "DailyNativeTokenTransferredReachLimit";
  ServerErrorCode[ServerErrorCode["TxToAddressNotAllowed"] = 1006] = "TxToAddressNotAllowed";
  ServerErrorCode[ServerErrorCode["TxValueReachedLimit"] = 1007] = "TxValueReachedLimit";
})(ServerErrorCode || (ServerErrorCode = {}));
class ServerError extends Error {
  name = "MpcServerError";
  code;
  shortMessage;
  constructor({
    code,
    message
  }) {
    const fullMessage = ["", `code: ${code}`, `message: ${message}`].join("\n• ");
    super(fullMessage);
    this.code = code;
    this.shortMessage = message;
  }
}
const decodeServerError = frame => {
  if (frame.type === Type.ERROR) {
    const error = fromBinary(ErrorSchema, frame.data);
    return new ServerError({
      code: Number(error.code),
      message: error.message
    });
  }
  if (frame.type === Type.UNSPECIFIED) {
    return new ServerError({
      code: ServerErrorCode.Unknown,
      message: "unspecified server response"
    });
  }
  return new HeadlessClientError({
    cause: undefined,
    code: HeadlessClientErrorCode.MissingMessageError,
    message: "The client has not processed the message from socket. This is most likely the SDK bug, please upgrade to the latest version."
  });
};

export { ServerError, ServerErrorCode, decodeServerError };
