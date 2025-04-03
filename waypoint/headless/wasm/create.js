import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { injectSkymavisMpc } from './instantiate.js';

let currentInstance;
let currentUrl;
const createWasmInstance = async url => {
  const cached = currentInstance !== undefined;
  const sameUrl = currentUrl === url;
  if (cached && sameUrl) {
    return currentInstance;
  }
  await injectSkymavisMpc(url);
  if (globalThis.skymavismpc) {
    currentInstance = globalThis.skymavismpc;
    currentUrl = url;
    return currentInstance;
  }
  throw new HeadlessClientError({
    code: HeadlessClientErrorCode.CreateWasmInstanceError,
    message: `Unable to create WASM instance. The variable "globalThis.skymavismpc" is undefined.`,
    cause: undefined
  });
};

export { createWasmInstance };
