import { openPopup } from '../../common/popup.js';
import { I as InvalidParamsRpcError, U as UnauthorizedProviderError, a as InternalRpcError } from '../../rpc-BGk0htDU.js';
import { i as isAddressEqual } from '../../isAddressEqual-CF4ISrAH.js';
import { i as isHex } from '../../size-CssOTqqV.js';
import { h as hexToNumber } from '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../../isAddress-BUhRlNtM.js';
import '../../keccak256-B1CwQAsk.js';
import '../../utils-CKEBUnDS.js';

const REQUIRED_PROPERTIES = ["types", "domain", "primaryType", "message"];
const isValidTypedData = typedData => REQUIRED_PROPERTIES.every(k => k in typedData);
const transformTypedData = (data, chainId) => {
  let typedData;
  try {
    if (typeof data === "string") {
      typedData = JSON.parse(data);
    } else {
      typedData = data;
    }
  } catch (_err) {
    const parseError = new Error("eth_signTypedData_v4: could NOT parse typed data");
    throw new InvalidParamsRpcError(parseError);
  }
  if (!isValidTypedData(typedData)) {
    const err = new Error(`eth_signTypedData_v4: invalid typed data - required ${REQUIRED_PROPERTIES.join(", ")}`);
    throw new InvalidParamsRpcError(err);
  }
  const rawChainId = typedData.domain?.chainId;
  if (rawChainId === undefined) {
    const chainIdError = new Error(`eth_signTypedData_v4: chainId is NOT defined - expected ${chainId}`);
    throw new InvalidParamsRpcError(chainIdError);
  }
  const requestChainId = isHex(rawChainId) ? hexToNumber(rawChainId) : +rawChainId;
  if (chainId !== requestChainId) {
    const chainIdError = new Error(`eth_signTypedData_v4: chainId is NOT valid - expected ${chainId}`);
    throw new InvalidParamsRpcError(chainIdError);
  }
  return typedData;
};
const signTypedDataV4 = async ({
  params,
  expectAddress,
  clientId,
  chainId,
  waypointOrigin,
  communicateHelper,
  popupCloseDelay
}) => {
  const [address, data] = params;
  if (!data) throw new InvalidParamsRpcError(new Error("eth_signTypedData_v4: data is NOT define"));
  if (address && expectAddress && !isAddressEqual(address, expectAddress)) {
    throw new UnauthorizedProviderError(new Error("eth_signTypedData_v4: current address is different from required address"));
  }
  const typedData = transformTypedData(data, chainId);
  try {
    const signature = await communicateHelper.sendRequest(state => openPopup(`${waypointOrigin}/wallet/sign`, {
      state,
      clientId,
      popupCloseDelay,
      origin: window.location.origin,
      chainId,
      expectAddress,
      typedData: JSON.stringify(typedData)
    }));
    if (!isHex(signature)) {
      throw new Error("eth_signTypedData_v4: signature is not valid");
    }
    return signature;
  } catch (err) {
    if (err instanceof Error) {
      throw new InternalRpcError(err);
    }
    const unknownErr = new Error("eth_signTypedData_v4: unknown error");
    throw new InternalRpcError(unknownErr);
  }
};

export { signTypedDataV4 };
