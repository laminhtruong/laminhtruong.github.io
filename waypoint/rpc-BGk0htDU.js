import { B as BaseError } from './base-CC-Hj7CW.js';

const stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
  const value = typeof value_ === 'bigint' ? value_.toString() : value_;
  return typeof replacer === 'function' ? replacer(key, value) : value;
}, space);

const getUrl = url => url;

class HttpRequestError extends BaseError {
  constructor({
    body,
    cause,
    details,
    headers,
    status,
    url
  }) {
    super('HTTP request failed.', {
      cause,
      details,
      metaMessages: [status && `Status: ${status}`, `URL: ${getUrl(url)}`, body && `Request body: ${stringify(body)}`].filter(Boolean),
      name: 'HttpRequestError'
    });
    Object.defineProperty(this, "body", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "headers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "status", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.body = body;
    this.headers = headers;
    this.status = status;
    this.url = url;
  }
}
class RpcRequestError extends BaseError {
  constructor({
    body,
    error,
    url
  }) {
    super('RPC Request failed.', {
      cause: error,
      details: error.message,
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
      name: 'RpcRequestError'
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.code = error.code;
  }
}
class TimeoutError extends BaseError {
  constructor({
    body,
    url
  }) {
    super('The request took too long to respond.', {
      details: 'The request timed out.',
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
      name: 'TimeoutError'
    });
  }
}

const unknownErrorCode = -1;
class RpcError extends BaseError {
  constructor(cause, {
    code,
    docsPath,
    metaMessages,
    name,
    shortMessage
  }) {
    super(shortMessage, {
      cause,
      docsPath,
      metaMessages: metaMessages || cause?.metaMessages,
      name: name || 'RpcError'
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = name || cause.name;
    this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
  }
}
class ProviderRpcError extends RpcError {
  constructor(cause, options) {
    super(cause, options);
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = options.data;
  }
}
class ParseRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ParseRpcError.code,
      name: 'ParseRpcError',
      shortMessage: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.'
    });
  }
}
Object.defineProperty(ParseRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32700
});
class InvalidRequestRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidRequestRpcError.code,
      name: 'InvalidRequestRpcError',
      shortMessage: 'JSON is not a valid request object.'
    });
  }
}
Object.defineProperty(InvalidRequestRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32600
});
class MethodNotFoundRpcError extends RpcError {
  constructor(cause, {
    method
  } = {}) {
    super(cause, {
      code: MethodNotFoundRpcError.code,
      name: 'MethodNotFoundRpcError',
      shortMessage: `The method${method ? ` "${method}"` : ''} does not exist / is not available.`
    });
  }
}
Object.defineProperty(MethodNotFoundRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32601
});
class InvalidParamsRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidParamsRpcError.code,
      name: 'InvalidParamsRpcError',
      shortMessage: ['Invalid parameters were provided to the RPC method.', 'Double check you have provided the correct parameters.'].join('\n')
    });
  }
}
Object.defineProperty(InvalidParamsRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32602
});
class InternalRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InternalRpcError.code,
      name: 'InternalRpcError',
      shortMessage: 'An internal error was received.'
    });
  }
}
Object.defineProperty(InternalRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32603
});
class InvalidInputRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidInputRpcError.code,
      name: 'InvalidInputRpcError',
      shortMessage: ['Missing or invalid parameters.', 'Double check you have provided the correct parameters.'].join('\n')
    });
  }
}
Object.defineProperty(InvalidInputRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32000
});
class ResourceNotFoundRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ResourceNotFoundRpcError.code,
      name: 'ResourceNotFoundRpcError',
      shortMessage: 'Requested resource not found.'
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 'ResourceNotFoundRpcError'
    });
  }
}
Object.defineProperty(ResourceNotFoundRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32001
});
class ResourceUnavailableRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ResourceUnavailableRpcError.code,
      name: 'ResourceUnavailableRpcError',
      shortMessage: 'Requested resource not available.'
    });
  }
}
Object.defineProperty(ResourceUnavailableRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32002
});
class TransactionRejectedRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: TransactionRejectedRpcError.code,
      name: 'TransactionRejectedRpcError',
      shortMessage: 'Transaction creation failed.'
    });
  }
}
Object.defineProperty(TransactionRejectedRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32003
});
class MethodNotSupportedRpcError extends RpcError {
  constructor(cause, {
    method
  } = {}) {
    super(cause, {
      code: MethodNotSupportedRpcError.code,
      name: 'MethodNotSupportedRpcError',
      shortMessage: `Method${method ? ` "${method}"` : ''} is not implemented.`
    });
  }
}
Object.defineProperty(MethodNotSupportedRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32004
});
class LimitExceededRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: LimitExceededRpcError.code,
      name: 'LimitExceededRpcError',
      shortMessage: 'Request exceeds defined limit.'
    });
  }
}
Object.defineProperty(LimitExceededRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32005
});
class JsonRpcVersionUnsupportedError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: JsonRpcVersionUnsupportedError.code,
      name: 'JsonRpcVersionUnsupportedError',
      shortMessage: 'Version of JSON-RPC protocol is not supported.'
    });
  }
}
Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32006
});
class UserRejectedRequestError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: UserRejectedRequestError.code,
      name: 'UserRejectedRequestError',
      shortMessage: 'User rejected the request.'
    });
  }
}
Object.defineProperty(UserRejectedRequestError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4001
});
class UnauthorizedProviderError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: UnauthorizedProviderError.code,
      name: 'UnauthorizedProviderError',
      shortMessage: 'The requested method and/or account has not been authorized by the user.'
    });
  }
}
Object.defineProperty(UnauthorizedProviderError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4100
});
class UnsupportedProviderMethodError extends ProviderRpcError {
  constructor(cause, {
    method
  } = {}) {
    super(cause, {
      code: UnsupportedProviderMethodError.code,
      name: 'UnsupportedProviderMethodError',
      shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ''}.`
    });
  }
}
Object.defineProperty(UnsupportedProviderMethodError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4200
});
class ProviderDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: ProviderDisconnectedError.code,
      name: 'ProviderDisconnectedError',
      shortMessage: 'The Provider is disconnected from all chains.'
    });
  }
}
Object.defineProperty(ProviderDisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4900
});
class ChainDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: ChainDisconnectedError.code,
      name: 'ChainDisconnectedError',
      shortMessage: 'The Provider is not connected to the requested chain.'
    });
  }
}
Object.defineProperty(ChainDisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4901
});
class SwitchChainError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: SwitchChainError.code,
      name: 'SwitchChainError',
      shortMessage: 'An error occurred when attempting to switch chain.'
    });
  }
}
Object.defineProperty(SwitchChainError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4902
});
class UnknownRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      name: 'UnknownRpcError',
      shortMessage: 'An unknown RPC error occurred.'
    });
  }
}

export { ChainDisconnectedError as C, HttpRequestError as H, InvalidParamsRpcError as I, JsonRpcVersionUnsupportedError as J, LimitExceededRpcError as L, MethodNotSupportedRpcError as M, ProviderDisconnectedError as P, ResourceUnavailableRpcError as R, SwitchChainError as S, TransactionRejectedRpcError as T, UnauthorizedProviderError as U, InternalRpcError as a, UserRejectedRequestError as b, UnknownRpcError as c, UnsupportedProviderMethodError as d, ResourceNotFoundRpcError as e, InvalidInputRpcError as f, MethodNotFoundRpcError as g, InvalidRequestRpcError as h, ParseRpcError as i, TimeoutError as j, RpcRequestError as k, stringify as s };
