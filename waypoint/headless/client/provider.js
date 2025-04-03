import { E as EventEmitter } from '../../_polyfill-node.events-BiZUWMRj.js';
import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { U as UnauthorizedProviderError, a as InternalRpcError } from '../../rpc-BGk0htDU.js';
import { i as isAddressEqual } from '../../isAddressEqual-CF4ISrAH.js';
import { t as toHex } from '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../../isAddress-BUhRlNtM.js';
import '../../keccak256-B1CwQAsk.js';
import '../../utils-CKEBUnDS.js';
import '../../size-CssOTqqV.js';

// ! Keep the same interface with internal libs
class HeadlessProvider extends EventEmitter {
  core;
  constructor(core) {
    super();
    this.core = core;
  }
  static fromHeadlessCore = core => {
    return new HeadlessProvider(core);
  };
  getAccounts = () => {
    try {
      const address = this.core.getAddress();
      const signable = this.core.isSignable();
      if (address && signable) {
        return [address];
      }
    } catch (error) {
      /* empty */
    }
    return [];
  };
  requestAccounts = () => {
    try {
      const address = this.core.getAddress();
      const signable = this.core.isSignable();
      if (address && signable) {
        return [address];
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new UnauthorizedProviderError(err);
      }
    }
    throw new UnauthorizedProviderError(new Error("The headless core is not signable."));
  };
  personalSign = async params => {
    const [data, address] = params;
    const [currentAddress] = this.requestAccounts();
    if (!isAddressEqual(address, currentAddress)) {
      const notMatchError = new HeadlessClientError({
        cause: undefined,
        code: HeadlessClientErrorCode.AddressIsNotMatch,
        message: `Unable to sign message, currentAddress="${currentAddress}" is different from requestedAddress="${address}".`
      });
      throw new UnauthorizedProviderError(notMatchError);
    }
    try {
      return await this.core.signMessage({
        raw: data
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalRpcError(err);
      }
      const unknownErr = new HeadlessClientError({
        cause: err,
        code: HeadlessClientErrorCode.UnknownError,
        message: "Unable to perform personal sign."
      });
      throw new InternalRpcError(unknownErr);
    }
  };
  signTypedDataV4 = async params => {
    const [address, data] = params;
    let typedData;
    try {
      if (typeof data === "string") {
        typedData = JSON.parse(data);
      } else {
        typedData = data;
      }
    } catch (err) {
      const parseError = new HeadlessClientError({
        cause: err,
        code: HeadlessClientErrorCode.ParseTypedDataError,
        message: `Unable to parse typedData="${data}".`
      });
      throw new InternalRpcError(parseError);
    }
    const [currentAddress] = this.requestAccounts();
    if (!isAddressEqual(address, currentAddress)) {
      const notMatchError = new HeadlessClientError({
        cause: undefined,
        code: HeadlessClientErrorCode.AddressIsNotMatch,
        message: `Unable to sign typed data, currentAddress="${currentAddress}" is different from requestedAddress="${address}".`
      });
      throw new UnauthorizedProviderError(notMatchError);
    }
    try {
      return await this.core.signTypedData(typedData);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalRpcError(err);
      }
      const unknownErr = new HeadlessClientError({
        cause: err,
        code: HeadlessClientErrorCode.UnknownError,
        message: "Unable to sign typed data."
      });
      throw new InternalRpcError(unknownErr);
    }
  };
  request = async args => {
    const {
      params,
      method
    } = args;
    switch (method) {
      case "eth_accounts":
        {
          const result = this.getAccounts();
          return result;
        }
      case "eth_requestAccounts":
        {
          const result = await this.requestAccounts();
          return result;
        }
      case "eth_chainId":
        {
          return toHex(this.core.chainId);
        }
      case "personal_sign":
        {
          return this.personalSign(params);
        }
      case "eth_signTypedData_v4":
        {
          return this.signTypedDataV4(params);
        }
      case "eth_sendTransaction":
        {
          try {
            const [tx] = params;
            const transaction = await this.core.sendTransaction(tx);
            return transaction.txHash;
          } catch (err) {
            if (err instanceof Error) {
              throw new InternalRpcError(err);
            }
            const unknownErr = new HeadlessClientError({
              cause: err,
              code: HeadlessClientErrorCode.UnknownError,
              message: "Unable to send transaction."
            });
            throw new InternalRpcError(unknownErr);
          }
        }
      default:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.core.publicClient.request(args);
    }
  };
}

export { HeadlessProvider };
