import { E as EventEmitter } from '../_polyfill-node.events-BiZUWMRj.js';
import { VIEM_CHAIN_MAPPING } from '../common/chain.js';
import { CommunicateHelper } from '../common/communicate.js';
import { Eip1193EventName } from '../common/eip1193.js';
import { RONIN_WAYPOINT_ORIGIN_PROD } from '../common/gate.js';
import { openPopup } from '../common/popup.js';
import { getScopesParams } from '../common/scope.js';
import { personalSign } from './core/personal-sign.js';
import { sendTransaction } from './core/send-tx.js';
import { signTypedDataV4 } from './core/sign-data.js';
import { getStorage, STORAGE_ADDRESS_KEY, setStorage, removeStorage } from './utils/storage.js';
import { validateIdAddress } from './utils/validate-address.js';
import { C as ChainDisconnectedError, U as UnauthorizedProviderError, P as ProviderDisconnectedError } from '../rpc-BGk0htDU.js';
import { c as createClient, h as http } from '../http-CzuPfCha.js';
import { t as toHex } from '../toBytes-rCiiThej.js';
import '../common/defer.js';
import '../common/waypoint-error.js';
import '../v4-CU-e4i5S.js';
import '../isAddressEqual-CF4ISrAH.js';
import '../isAddress-BUhRlNtM.js';
import '../base-CC-Hj7CW.js';
import '../keccak256-B1CwQAsk.js';
import '../utils-CKEBUnDS.js';
import '../size-CssOTqqV.js';

/**
 * A JavaScript Ethereum Provider API for consistency across clients and applications.
 *
 * This provider is designed to easily integrate with Ronin Waypoint.
 *
 * Use `create` function to create a new instance.ddress"
import { EventEmitter } from "events"
import { A, ChainDisconnectedError, Client, createClient, EIP1193Parameters, http, ProviderDisconnectedError, toHex, UnauthorizedProviderError } from "viem
 *
 * @example
 * import { WaypointProvider } from "@sky-mavis/waypoint"
 *
 * const idWalletProvider = WaypointProvider.create({
 *  clientId: "YOUR_CLIENT_ID",
 *  chainId: ronin.chainId,
 * })
 */
class WaypointProvider extends EventEmitter {
  clientId;
  waypointOrigin;
  redirectUrl;
  scopes;
  chainId;
  address;
  viemClient;
  communicateHelper;
  popupCloseDelay;
  constructor(options) {
    super();
    const {
      clientId,
      chainId,
      popupCloseDelay,
      scopes = [],
      waypointOrigin = RONIN_WAYPOINT_ORIGIN_PROD,
      redirectUrl = typeof window !== "undefined" ? window.location.origin : ""
    } = options;
    this.clientId = clientId;
    this.waypointOrigin = waypointOrigin;
    this.redirectUrl = redirectUrl;
    this.chainId = chainId;
    this.scopes = this.addDefaultScopes(scopes);
    this.communicateHelper = new CommunicateHelper(waypointOrigin);
    this.viemClient = this.createViemClient(chainId);
    this.popupCloseDelay = popupCloseDelay;
  }
  createViemClient(chainId) {
    const chain = VIEM_CHAIN_MAPPING[chainId];
    if (!chain) {
      const err = new Error(`Chain ${chainId} is not supported.`);
      throw new ChainDisconnectedError(err);
    }
    return createClient({
      chain: VIEM_CHAIN_MAPPING[chainId],
      transport: http()
    });
  }
  addDefaultScopes(scopes) {
    const newScopes = [...scopes];
    if (!newScopes.includes("openid")) {
      newScopes.push("openid");
    }
    if (!newScopes.includes("wallet")) {
      newScopes.push("wallet");
    }
    return newScopes;
  }
  /**
   * Creates a new WaypointProvider instance.
   *
   * @param options Options for WaypointProvider.
   *
   * @returns WaypointProvider instance.
   *
   * @example
   * import { WaypointProvider } from "@sky-mavis/waypoint"
   *
   * const idWalletProvider = WaypointProvider.create({
   *  clientId: "YOUR_CLIENT_ID",
   *  chainId: ronin.chainId,
   * })
   */
  static create = options => {
    return new WaypointProvider(options);
  };
  getIdAddress = () => {
    if (this.address) return this.address;
    const storedAddress = getStorage(STORAGE_ADDRESS_KEY) || "";
    return validateIdAddress(storedAddress);
  };
  getIdAddressOrConnect = async () => {
    const address = this.getIdAddress();
    if (address) return address;
    const result = await this.connect();
    return result.address;
  };
  /**
   * Connects to Ronin Waypoint provider and retrieves authorization data & user wallet address.
   *
   * @returns The access token and address.
   */
  connect = async () => {
    const {
      waypointOrigin,
      clientId,
      redirectUrl,
      scopes,
      communicateHelper,
      chainId,
      popupCloseDelay
    } = this;
    const authData = await communicateHelper.sendRequest(state => openPopup(`${waypointOrigin}/client/${clientId}/authorize`, {
      state,
      popupCloseDelay,
      redirect: redirectUrl,
      origin: window.location.origin,
      scope: getScopesParams(scopes)
    }));
    return this.handleAuthData(authData, chainId);
  };
  createKeylessWallet = async () => {
    const {
      waypointOrigin,
      clientId,
      redirectUrl,
      communicateHelper,
      chainId,
      popupCloseDelay
    } = this;
    const authData = await communicateHelper.sendRequest(state => openPopup(`${waypointOrigin}/wallet/setup/introduce`, {
      state,
      clientId,
      popupCloseDelay,
      redirect: redirectUrl,
      origin: window.location.origin
    }));
    return this.handleAuthData(authData, chainId);
  };
  handleAuthData = (authData, chainId) => {
    const {
      id_token: token,
      address: rawAddress
    } = authData;
    const address = validateIdAddress(rawAddress);
    if (!address) {
      const err = new Error("Ronin Waypoint do NOT return valid address");
      throw new UnauthorizedProviderError(err);
    }
    setStorage(STORAGE_ADDRESS_KEY, address);
    this.address = address;
    const addresses = [address];
    this.emit(Eip1193EventName.accountsChanged, addresses);
    this.emit(Eip1193EventName.connect, {
      chainId
    });
    return {
      token,
      address
    };
  };
  /**
   * Disconnect from Ronin Waypoint provider and clear the cached address in localStorage.
   */
  disconnect = () => {
    const shouldEmitDisconnectEvent = !!this.address;
    removeStorage(STORAGE_ADDRESS_KEY);
    this.address = undefined;
    if (shouldEmitDisconnectEvent) {
      const err = new Error("The provider is disconnected from all chains.");
      const providerErr = new ProviderDisconnectedError(err);
      this.emit(Eip1193EventName.accountsChanged, []);
      this.emit(Eip1193EventName.disconnect, providerErr);
    }
  };
  /**
   * A JavaScript Ethereum Provider API for consistency across clients and applications.
   *
   * Makes an Ethereum RPC method call.
   *
   * https://eips.ethereum.org/EIPS/eip-1193
   */
  request = async args => {
    const {
      clientId,
      waypointOrigin,
      communicateHelper,
      chainId,
      viemClient,
      connect,
      getIdAddress,
      getIdAddressOrConnect,
      popupCloseDelay
    } = this;
    const {
      method,
      params
    } = args;
    switch (method) {
      case "eth_chainId":
        return toHex(chainId);
      case "eth_accounts":
        {
          const address = getIdAddress();
          const result = address ? [address] : [];
          return result;
        }
      // * Ronin Waypoint is not like other providers, it need open popup to authorize & get address
      // * eth_requestAccounts should NOT get address from localStorage cache
      // * if user change address in Ronin Waypoint, it should get new address
      case "eth_requestAccounts":
        {
          const {
            address: newAddress
          } = await connect();
          return [newAddress];
        }
      case "personal_sign":
        {
          const expectAddress = await getIdAddressOrConnect();
          return personalSign({
            params,
            expectAddress,
            clientId,
            waypointOrigin,
            communicateHelper,
            popupCloseDelay
          });
        }
      case "eth_signTypedData_v4":
        {
          const expectAddress = await getIdAddressOrConnect();
          return signTypedDataV4({
            params,
            chainId,
            expectAddress,
            clientId,
            waypointOrigin,
            communicateHelper,
            popupCloseDelay
          });
        }
      case "eth_sendTransaction":
        {
          const expectAddress = await getIdAddressOrConnect();
          return sendTransaction({
            params,
            chainId,
            expectAddress,
            clientId,
            waypointOrigin,
            communicateHelper,
            popupCloseDelay
          });
        }
      default:
        {
          return viemClient.request(args);
        }
    }
  };
}

export { WaypointProvider };
