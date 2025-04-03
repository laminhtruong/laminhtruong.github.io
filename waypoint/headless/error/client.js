var HeadlessClientErrorCode;
(function (HeadlessClientErrorCode) {
  // * param error
  HeadlessClientErrorCode[HeadlessClientErrorCode["InvalidWaypointTokenError"] = -1100] = "InvalidWaypointTokenError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["InvalidClientShardError"] = -1101] = "InvalidClientShardError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["UnsupportedTransactionTypeError"] = -1102] = "UnsupportedTransactionTypeError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["PrepareTransactionError"] = -1103] = "PrepareTransactionError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["UnsupportedChainIdError"] = -1104] = "UnsupportedChainIdError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["AddressIsNotMatch"] = -1105] = "AddressIsNotMatch";
  HeadlessClientErrorCode[HeadlessClientErrorCode["ParseTypedDataError"] = -1106] = "ParseTypedDataError";
  // * socket error
  HeadlessClientErrorCode[HeadlessClientErrorCode["OpenSocketError"] = -2200] = "OpenSocketError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["ListenSocketMessageError"] = -2201] = "ListenSocketMessageError";
  // * when client do NOT process frame with type = DATA | DONE from socket
  HeadlessClientErrorCode[HeadlessClientErrorCode["MissingMessageError"] = -2202] = "MissingMessageError";
  // * wasm init error
  HeadlessClientErrorCode[HeadlessClientErrorCode["WebAssemblyNotSupportedError"] = -3300] = "WebAssemblyNotSupportedError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["InstantiateError"] = -3301] = "InstantiateError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["SetupGoWasmEnvError"] = -3302] = "SetupGoWasmEnvError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["CreateWasmInstanceError"] = -3303] = "CreateWasmInstanceError";
  // * wasm action error
  HeadlessClientErrorCode[HeadlessClientErrorCode["HandlerNotFoundError"] = -3304] = "HandlerNotFoundError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["WasmGetProtocolResultError"] = -3305] = "WasmGetProtocolResultError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["WasmReceiveSocketDataError"] = -3306] = "WasmReceiveSocketDataError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["WasmTriggerSignError"] = -3307] = "WasmTriggerSignError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["WasmTriggerKeygenError"] = -3308] = "WasmTriggerKeygenError";
  // * action error
  HeadlessClientErrorCode[HeadlessClientErrorCode["AuthenticateError"] = -4400] = "AuthenticateError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["DecryptClientShardError"] = -4401] = "DecryptClientShardError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["EncryptClientShardError"] = -4402] = "EncryptClientShardError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["BackupClientShardError"] = -4403] = "BackupClientShardError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["InvalidSignatureError"] = -4404] = "InvalidSignatureError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["SendTransactionError"] = -4405] = "SendTransactionError";
  HeadlessClientErrorCode[HeadlessClientErrorCode["UnknownError"] = -9900] = "UnknownError";
})(HeadlessClientErrorCode || (HeadlessClientErrorCode = {}));
class HeadlessClientError extends Error {
  name = "HeadlessClientError";
  code;
  shortMessage;
  constructor({
    code,
    message,
    cause
  }) {
    const fullMessage = ["", `code: ${code}`, `message: ${message}`].join("\n• ");
    super(fullMessage, cause ? {
      cause
    } : undefined);
    this.code = code;
    this.name = HeadlessClientErrorCode[code];
    this.shortMessage = message;
  }
}

export { HeadlessClientError, HeadlessClientErrorCode };
