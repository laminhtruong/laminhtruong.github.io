import { i as isAddress, g as getAddress } from '../../isAddress-BUhRlNtM.js';
import '../../base-CC-Hj7CW.js';
import '../../toBytes-rCiiThej.js';
import '../../size-CssOTqqV.js';
import '../../keccak256-B1CwQAsk.js';
import '../../utils-CKEBUnDS.js';

const validateIdAddress = responseAddress => {
  try {
    return responseAddress && isAddress(responseAddress) ? getAddress(responseAddress) : undefined;
  } catch (error) {
    return undefined;
  }
};

export { validateIdAddress };
