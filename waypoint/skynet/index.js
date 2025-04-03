const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
  // eslint-disable-next-line unicorn/prefer-at
  value[0] === '"' && value.endsWith('"') && !value.includes("\\")) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(_value => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter(k => query[k] !== void 0).map(k => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = {
      acceptRelative: opts
    };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = {
    ...parseQuery(parsed.search),
    ...query
  };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter(url2 => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, {
    acceptRelative: true
  })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const {
    pathname,
    search,
    hash
  } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(message, ctx.error ? {
    cause: ctx.error
  } : void 0);
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [["data", "_data"], ["status", "status"], ["statusCode", "status"], ["statusText", "statusText"], ["statusMessage", "statusText"]]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */new Set(["image/svg", "application/xml", "application/xhtml", "application/html"]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(input?.headers ?? request?.headers, defaults?.headers, Headers);
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}
const retryStatusCodes = /* @__PURE__ */new Set([408,
// Request Timeout
409,
// Conflict
425,
// Too Early (Experimental)
429,
// Too Many Requests
500,
// Internal Server Error
502,
// Bad Gateway
503,
// Service Unavailable
504
// Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(_request, _options, globalOptions.defaults, Headers),
      response: void 0,
      error: void 0
    };
    context.options.method = context.options.method?.toUpperCase();
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
      // ReadableStream Body
      "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" ||
      // Node.js Stream Body
      typeof context.options.body.pipe === "function") {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error("[TimeoutError]: The operation was aborted due to timeout");
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(context.request, context.options);
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(context, context.options.onRequestError);
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = context.response.body && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json":
          {
            const data = await context.response.text();
            const parseFunction = context.options.parseResponse || destr;
            context.response._data = parseFunction(data);
            break;
          }
        case "stream":
          {
            context.response._data = context.response.body;
            break;
          }
        default:
          {
            context.response._data = await context.response[responseType]();
          }
      }
    }
    if (context.options.onResponse) {
      await callHooks(context, context.options.onResponse);
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(context, context.options.onResponseError);
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

const _globalThis = function () {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis.fetch ? (...args) => _globalThis.fetch(...args) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!"));
const Headers = _globalThis.Headers;
const AbortController = _globalThis.AbortController;
const ofetch = createFetch({
  fetch,
  Headers,
  AbortController
});

const SKYNET_BASE_URL = "https://api-gateway.skymavis.com/skynet/ronin/web3/v2";
const RequestKey = {
  // Accounts
  searchAccountActivities: "/accounts/{address}/activities/search",
  getNFTsFromAddress: "/accounts/{address}/nfts",
  getBalanceFromAddress: "/accounts/{address}/fungible_tokens",
  getCollectionsFromAddress: "/accounts/{address}/collections",
  getNFTsFromAddressAndContract: "/accounts/{address}/contracts/{contractAddress}/tokens",
  getBalanceFromAddressAndContract: "/accounts/{address}/contracts/{contractAddress}",
  getBalancesFromAddressAndContracts: "/accounts/{address}/contracts",
  getTokenTransfersFromAddress: "/accounts/{address}/tokens/transfers",
  getTokenTransfersFromAddressAndContract: "/accounts/{address}/tokens/{contractAddress}/transfers",
  getTransitionsFromAddress: "/accounts/{address}/txs",
  getInternalTransactionTransfersFromAddress: "/accounts/{address}/internal_txs/transfers",
  // Blocks
  getFinalizedBlockNumber: "/blocks/finalized/number",
  getLatestBlockNumber: "/blocks/latest/number",
  getTransactionsByBlockNumber: "/blocks/{blockNumber}/txs",
  getBlockByNumber: "/blocks/{blockNumber}",
  getBlock: "/blocks",
  // Collection
  getNFTOwners: "/collections/{contractAddress}/tokens/{tokenId}/owners",
  getNFTTransfers: "/collections/{contractAddress}/tokens/{tokenId}/transfers",
  getNFTDetails: "/collections/{contractAddress}/tokens/{tokenId}",
  refreshNFTMetadata: "/collections/{contractAddress}/tokens/metadata/refresh_sync",
  refreshNFTMetadataAsync: "/collections/{contractAddress}/tokens/metadata/refresh_async",
  getNFTsDetails: "/collections/{contractAddress}/tokens",
  getNFTsFromCollection: "/collections/{contractAddress}/tokens",
  getTotalCollectionFromAddress: "/collections/{contractAddress}/owners/{address}",
  getOwnersFromCollection: "/collections/{contractAddress}/owners",
  getCollectionTransfers: "/collections/{contractAddress}/transfers",
  getCollectionDetails: "/collections/{contractAddress}",
  getCollectionsDetails: "/collections",
  // Contracts
  getContractDetails: "/contracts/{contractAddress}",
  getContractsDetails: "/contracts",
  // Transactions
  getInternalTransactionsFromTransaction: "/txs/{txHash}/internal_txs",
  getTransactionDetails: "/txs/{txHash}",
  getTransactionsDetails: "/txs/"
};
const constructUrl = (path, pathParams) => {
  return Object.entries(pathParams).reduce((acc, [key, value]) => acc.replace(`{${key}}`, value), path);
};
class Skynet {
  apiKey;
  fetcher;
  constructor(config) {
    this.apiKey = config.apiKey;
    this.fetcher = ofetch.create({
      baseURL: config.skynetBaseUrl ?? SKYNET_BASE_URL,
      headers: {
        "x-api-key": this.apiKey
      }
    });
  }
  async apiCall(method, path, params) {
    let query, body;
    if (params && "query" in params) {
      query = params.query;
      delete params.query;
    }
    if (params && "body" in params) {
      body = params.body;
      delete params.body;
    }
    const url = constructUrl(path, params ?? {});
    return this.fetcher(url, {
      method,
      query: query,
      body: body
    });
  }
  async searchAccountActivities(params) {
    return this.apiCall("post", RequestKey.searchAccountActivities, params);
  }
  async getNFTsFromAddress(params) {
    return this.apiCall("get", RequestKey.getNFTsFromAddress, params);
  }
  async getBalanceFromAddress(params) {
    return this.apiCall("get", RequestKey.getBalanceFromAddress, params);
  }
  async getCollectionsFromAddress(params) {
    return this.apiCall("get", RequestKey.getCollectionsFromAddress, params);
  }
  async getNFTsFromAddressAndContract(params) {
    return this.apiCall("get", RequestKey.getNFTsFromAddressAndContract, params);
  }
  async getBalanceFromAddressAndContract(params) {
    return this.apiCall("get", RequestKey.getBalanceFromAddressAndContract, params);
  }
  async getBalancesFromAddressAndContracts(params) {
    return this.apiCall("post", RequestKey.getBalancesFromAddressAndContracts, params);
  }
  async getTokenTransfersFromAddress(params) {
    return this.apiCall("get", RequestKey.getTokenTransfersFromAddress, params);
  }
  async getTokenTransfersFromAddressAndContract(params) {
    return this.apiCall("get", RequestKey.getTokenTransfersFromAddressAndContract, params);
  }
  async getTransitionsFromAddress(params) {
    return this.apiCall("get", RequestKey.getTransitionsFromAddress, params);
  }
  async getInternalTransactionTransfersFromAddress(params) {
    return this.apiCall("get", RequestKey.getInternalTransactionTransfersFromAddress, params);
  }
  async getFinalizedBlockNumber() {
    return this.apiCall("get", RequestKey.getFinalizedBlockNumber);
  }
  async getLatestBlockNumber() {
    return this.apiCall("get", RequestKey.getLatestBlockNumber);
  }
  async getTransactionsByBlockNumber(params) {
    return this.apiCall("get", RequestKey.getTransactionsByBlockNumber, params);
  }
  async getBlockByNumber(params) {
    return this.apiCall("get", RequestKey.getBlockByNumber, params);
  }
  async getBlock(params) {
    return this.apiCall("get", RequestKey.getBlock, params);
  }
  async getNFTOwners(params) {
    return this.apiCall("get", RequestKey.getNFTOwners, params);
  }
  async getNFTTransfers(params) {
    return this.apiCall("get", RequestKey.getNFTTransfers, params);
  }
  async getNFTDetails(params) {
    return this.apiCall("get", RequestKey.getNFTDetails, params);
  }
  async refreshNFTMetadata(params) {
    return this.apiCall("post", RequestKey.refreshNFTMetadata, params);
  }
  async refreshNFTMetadataAsync(params) {
    return this.apiCall("post", RequestKey.refreshNFTMetadataAsync, params);
  }
  async getNFTsDetails(params) {
    return this.apiCall("post", RequestKey.getNFTsDetails, params);
  }
  async getNFTsFromCollection(params) {
    return this.apiCall("get", RequestKey.getNFTsFromCollection, params);
  }
  async getTotalCollectionFromAddress(params) {
    return this.apiCall("get", RequestKey.getTotalCollectionFromAddress, params);
  }
  async getOwnersFromCollection(params) {
    return this.apiCall("get", RequestKey.getOwnersFromCollection, params);
  }
  async getCollectionTransfers(params) {
    return this.apiCall("get", RequestKey.getCollectionTransfers, params);
  }
  async getCollectionDetails(params) {
    return this.apiCall("get", RequestKey.getCollectionDetails, params);
  }
  async getCollectionsDetails(params) {
    return this.apiCall("post", RequestKey.getCollectionsDetails, params);
  }
  async getContractDetails(params) {
    return this.apiCall("get", RequestKey.getContractDetails, params);
  }
  async getContractsDetails(params) {
    return this.apiCall("post", RequestKey.getContractsDetails, params);
  }
  async getInternalTransactionsFromTransaction(params) {
    return this.apiCall("get", RequestKey.getInternalTransactionsFromTransaction, params);
  }
  async getTransactionDetails(params) {
    return this.apiCall("get", RequestKey.getTransactionDetails, params);
  }
  async getTransactionsDetails(params) {
    return this.apiCall("post", RequestKey.getTransactionsDetails, params);
  }
}

export { Skynet };
