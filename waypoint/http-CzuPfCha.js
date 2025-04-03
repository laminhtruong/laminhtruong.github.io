import { s as stringify, H as HttpRequestError, c as UnknownRpcError, b as UserRejectedRequestError, S as SwitchChainError, C as ChainDisconnectedError, P as ProviderDisconnectedError, d as UnsupportedProviderMethodError, U as UnauthorizedProviderError, J as JsonRpcVersionUnsupportedError, L as LimitExceededRpcError, M as MethodNotSupportedRpcError, T as TransactionRejectedRpcError, R as ResourceUnavailableRpcError, e as ResourceNotFoundRpcError, f as InvalidInputRpcError, a as InternalRpcError, I as InvalidParamsRpcError, g as MethodNotFoundRpcError, h as InvalidRequestRpcError, i as ParseRpcError, j as TimeoutError, k as RpcRequestError } from './rpc-BGk0htDU.js';
import { B as BaseError } from './base-CC-Hj7CW.js';
import { d as stringToHex } from './toBytes-rCiiThej.js';
import { k as keccak256 } from './keccak256-B1CwQAsk.js';
import { L as LruMap } from './isAddress-BUhRlNtM.js';

function parseAccount(account) {
  if (typeof account === 'string') return {
    address: account,
    type: 'json-rpc'
  };
  return account;
}

const schedulerCache = /*#__PURE__*/new Map();
/** @internal */
function createBatchScheduler({
  fn,
  id,
  shouldSplitBatch,
  wait = 0,
  sort
}) {
  const exec = async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({
      args
    }) => args);
    if (args.length === 0) return;
    fn(args).then(data => {
      if (sort && Array.isArray(data)) data.sort(sort);
      for (let i = 0; i < scheduler.length; i++) {
        const {
          pendingPromise
        } = scheduler[i];
        pendingPromise.resolve?.([data[i], data]);
      }
    }).catch(err => {
      for (let i = 0; i < scheduler.length; i++) {
        const {
          pendingPromise
        } = scheduler[i];
        pendingPromise.reject?.(err);
      }
    });
  };
  const flush = () => schedulerCache.delete(id);
  const getBatchedArgs = () => getScheduler().map(({
    args
  }) => args);
  const getScheduler = () => schedulerCache.get(id) || [];
  const setScheduler = item => schedulerCache.set(id, [...getScheduler(), item]);
  return {
    flush,
    async schedule(args) {
      const pendingPromise = {};
      const promise = new Promise((resolve, reject) => {
        pendingPromise.resolve = resolve;
        pendingPromise.reject = reject;
      });
      const split = shouldSplitBatch?.([...getBatchedArgs(), args]);
      if (split) exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({
          args,
          pendingPromise
        });
        return promise;
      }
      setScheduler({
        args,
        pendingPromise
      });
      setTimeout(exec, wait);
      return promise;
    }
  };
}

async function wait(time) {
  return new Promise(res => setTimeout(res, time));
}

const size = 256;
let index = size;
let buffer;
function uid(length = 11) {
  if (!buffer || index + length > size * 2) {
    buffer = '';
    index = 0;
    for (let i = 0; i < size; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

function createClient(parameters) {
  const {
    batch,
    cacheTime = parameters.pollingInterval ?? 4_000,
    ccipRead,
    key = 'base',
    name = 'Base Client',
    pollingInterval = 4_000,
    type = 'base'
  } = parameters;
  const chain = parameters.chain;
  const account = parameters.account ? parseAccount(parameters.account) : undefined;
  const {
    config,
    request,
    value
  } = parameters.transport({
    chain,
    pollingInterval
  });
  const transport = {
    ...config,
    ...value
  };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain,
    key,
    name,
    pollingInterval,
    request,
    transport,
    type,
    uid: uid()
  };
  function extend(base) {
    return extendFn => {
      const extended = extendFn(base);
      for (const key in client) delete extended[key];
      const combined = {
        ...base,
        ...extended
      };
      return Object.assign(combined, {
        extend: extend(combined)
      });
    };
  }
  return Object.assign(client, {
    extend: extend(client)
  });
}

/** @internal */
const promiseCache = /*#__PURE__*/new LruMap(8192);
/** Deduplicates in-flight promises. */
function withDedupe(fn, {
  enabled = true,
  id
}) {
  if (!enabled || !id) return fn();
  if (promiseCache.get(id)) return promiseCache.get(id);
  const promise = fn().finally(() => promiseCache.delete(id));
  promiseCache.set(id, promise);
  return promise;
}

function withRetry(fn, {
  delay: delay_ = 100,
  retryCount = 2,
  shouldRetry = () => true
} = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = async ({
      count = 0
    } = {}) => {
      const retry = async ({
        error
      }) => {
        const delay = typeof delay_ === 'function' ? delay_({
          count,
          error
        }) : delay_;
        if (delay) await wait(delay);
        attemptRetry({
          count: count + 1
        });
      };
      try {
        const data = await fn();
        resolve(data);
      } catch (err) {
        if (count < retryCount && (await shouldRetry({
          count,
          error: err
        }))) return retry({
          error: err
        });
        reject(err);
      }
    };
    attemptRetry();
  });
}

function buildRequest(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const {
      dedupe = false,
      retryDelay = 150,
      retryCount = 3,
      uid
    } = {
      ...options,
      ...overrideOptions
    };
    const requestId = dedupe ? keccak256(stringToHex(`${uid}.${stringify(args)}`)) : undefined;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args);
      } catch (err_) {
        const err = err_;
        switch (err.code) {
          // -32700
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          // -32600
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          // -32601
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, {
              method: args.method
            });
          // -32602
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          // -32603
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          // -32000
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          // -32001
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          // -32002
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          // -32003
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          // -32004
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          // -32005
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          // -32006
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          // 4001
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          // 4100
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          // 4200
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          // 4900
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          // 4901
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          // 4902
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          // CAIP-25: User Rejected Error
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
          case 5000:
            throw new UserRejectedRequestError(err);
          default:
            if (err_ instanceof BaseError) throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({
        count,
        error
      }) => {
        // If we find a Retry-After header, let's retry after the given time.
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get('Retry-After');
          if (retryAfter?.match(/\d/)) return Number.parseInt(retryAfter) * 1000;
        }
        // Otherwise, let's retry with an exponential backoff.
        return ~~(1 << count) * retryDelay;
      },
      retryCount,
      shouldRetry: ({
        error
      }) => shouldRetry(error)
    }), {
      enabled: dedupe,
      id: requestId
    });
  };
}
/** @internal */
function shouldRetry(error) {
  if ('code' in error && typeof error.code === 'number') {
    if (error.code === -1) return true; // Unknown error
    if (error.code === LimitExceededRpcError.code) return true;
    if (error.code === InternalRpcError.code) return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    // Forbidden
    if (error.status === 403) return true;
    // Request Timeout
    if (error.status === 408) return true;
    // Request Entity Too Large
    if (error.status === 413) return true;
    // Too Many Requests
    if (error.status === 429) return true;
    // Internal Server Error
    if (error.status === 500) return true;
    // Bad Gateway
    if (error.status === 502) return true;
    // Service Unavailable
    if (error.status === 503) return true;
    // Gateway Timeout
    if (error.status === 504) return true;
    return false;
  }
  return true;
}

/**
 * @description Creates an transport intended to be used with a client.
 */
function createTransport({
  key,
  name,
  request,
  retryCount = 3,
  retryDelay = 150,
  timeout,
  type
}, value) {
  const uid$1 = uid();
  return {
    config: {
      key,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest(request, {
      retryCount,
      retryDelay,
      uid: uid$1
    }),
    value
  };
}

class UrlRequiredError extends BaseError {
  constructor() {
    super('No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.', {
      docsPath: '/docs/clients/intro',
      name: 'UrlRequiredError'
    });
  }
}

function withTimeout(fn, {
  errorInstance = new Error('timed out'),
  timeout,
  signal
}) {
  return new Promise((resolve, reject) => {
    (async () => {
      let timeoutId;
      try {
        const controller = new AbortController();
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout); // need to cast because bun globals.d.ts overrides @types/node
        }
        resolve(await fn({
          signal: controller?.signal || null
        }));
      } catch (err) {
        if (err?.name === 'AbortError') reject(errorInstance);
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}

function createIdStore() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
}
const idCache = /*#__PURE__*/createIdStore();

function getHttpRpcClient(url, options = {}) {
  return {
    async request(params) {
      const {
        body,
        onRequest = options.onRequest,
        onResponse = options.onResponse,
        timeout = options.timeout ?? 10_000
      } = params;
      const fetchOptions = {
        ...(options.fetchOptions ?? {}),
        ...(params.fetchOptions ?? {})
      };
      const {
        headers,
        method,
        signal: signal_
      } = fetchOptions;
      try {
        const response = await withTimeout(async ({
          signal
        }) => {
          const init = {
            ...fetchOptions,
            body: Array.isArray(body) ? stringify(body.map(body => ({
              jsonrpc: '2.0',
              id: body.id ?? idCache.take(),
              ...body
            }))) : stringify({
              jsonrpc: '2.0',
              id: body.id ?? idCache.take(),
              ...body
            }),
            headers: {
              'Content-Type': 'application/json',
              ...headers
            },
            method: method || 'POST',
            signal: signal_ || (timeout > 0 ? signal : null)
          };
          const request = new Request(url, init);
          if (onRequest) await onRequest(request);
          const response = await fetch(url, init);
          return response;
        }, {
          errorInstance: new TimeoutError({
            body,
            url
          }),
          timeout,
          signal: true
        });
        if (onResponse) await onResponse(response);
        let data;
        if (response.headers.get('Content-Type')?.startsWith('application/json')) data = await response.json();else {
          data = await response.text();
          try {
            data = JSON.parse(data || '{}');
          } catch (err) {
            if (response.ok) throw err;
            data = {
              error: data
            };
          }
        }
        if (!response.ok) {
          throw new HttpRequestError({
            body,
            details: stringify(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (err instanceof HttpRequestError) throw err;
        if (err instanceof TimeoutError) throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}

/**
 * @description Creates a HTTP transport that connects to a JSON-RPC API.
 */
function http(/** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
url, config = {}) {
  const {
    batch,
    fetchOptions,
    key = 'http',
    name = 'HTTP JSON-RPC',
    onFetchRequest,
    onFetchResponse,
    retryDelay
  } = config;
  return ({
    chain,
    retryCount: retryCount_,
    timeout: timeout_
  }) => {
    const {
      batchSize = 1000,
      wait = 0
    } = typeof batch === 'object' ? batch : {};
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 10_000;
    const url_ = url || chain?.rpcUrls.default.http[0];
    if (!url_) throw new UrlRequiredError();
    const rpcClient = getHttpRpcClient(url_, {
      fetchOptions,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key,
      name,
      async request({
        method,
        params
      }) {
        const body = {
          method,
          params
        };
        const {
          schedule
        } = createBatchScheduler({
          id: url_,
          wait,
          shouldSplitBatch(requests) {
            return requests.length > batchSize;
          },
          fn: body => rpcClient.request({
            body
          }),
          sort: (a, b) => a.id - b.id
        });
        const fn = async body => batch ? schedule(body) : [await rpcClient.request({
          body
        })];
        const [{
          error,
          result
        }] = await fn(body);
        if (error) throw new RpcRequestError({
          body,
          error,
          url: url_
        });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: 'http'
    }, {
      fetchOptions,
      url: url_
    });
  };
}

export { createClient as c, http as h };
