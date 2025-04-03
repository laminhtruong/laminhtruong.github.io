import { openPopup } from '../../common/popup.js';
import '../../rpc-BGk0htDU.js';
import '../../base-CC-Hj7CW.js';

const sendTransaction = async ({
  params,
  chainId,
  expectAddress,
  clientId,
  waypointOrigin,
  communicateHelper,
  popupCloseDelay
}) => {
  const [transaction] = params;
  const txHash = await communicateHelper.sendRequest(state => openPopup(`${waypointOrigin}/wallet/send`, {
    state,
    clientId,
    popupCloseDelay,
    origin: window.location.origin,
    chainId,
    expectAddress,
    ...transaction
  }));
  return txHash;
};

export { sendTransaction };
