import { openPopup } from '../../common/popup.js';
import { i as isAddressEqual } from '../../isAddressEqual-CF4ISrAH.js';
import { U as UnauthorizedProviderError, I as InvalidParamsRpcError, a as InternalRpcError } from '../../rpc-BGk0htDU.js';
import { i as isHex } from '../../size-CssOTqqV.js';
import { a as hexToString } from '../../toBytes-rCiiThej.js';
import '../../isAddress-BUhRlNtM.js';
import '../../base-CC-Hj7CW.js';
import '../../keccak256-B1CwQAsk.js';
import '../../utils-CKEBUnDS.js';

const personalSign = async ({
  params,
  expectAddress,
  clientId,
  waypointOrigin,
  communicateHelper,
  popupCloseDelay
}) => {
  const [data, address] = params;
  if (address && expectAddress && !isAddressEqual(address, expectAddress)) {
    const err = new Error("personal_sign: current address is different from required address");
    throw new UnauthorizedProviderError(err);
  }
  // * Ronin Waypoint only accept raw string message - NOT hex
  const message = !isHex(data) ? data : hexToString(data);
  if (!message) {
    const err = new Error("personal_sign: message is NOT define");
    throw new InvalidParamsRpcError(err);
  }
  const signature = await communicateHelper.sendRequest(state => openPopup(`${waypointOrigin}/wallet/sign`, {
    state,
    clientId,
    popupCloseDelay,
    origin: window.location.origin,
    expectAddress,
    message
  }));
  if (!isHex(signature)) {
    const err = new Error("personal_sign: signature is not valid");
    throw new InternalRpcError(err);
  }
  return signature;
};

export { personalSign };
