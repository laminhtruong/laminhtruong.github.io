import { CommunicateHelper } from '../common/communicate.js';
import { RONIN_WAYPOINT_ORIGIN_PROD } from '../common/gate.js';
import { openPopup } from '../common/popup.js';
import '../common/defer.js';
import '../common/waypoint-error.js';
import '../rpc-BGk0htDU.js';
import '../base-CC-Hj7CW.js';
import '../v4-CU-e4i5S.js';

const DEPOSIT_POPUP_WIDTH = 500;
const DEPOSIT_POPUP_HEIGHT = 728;
class Deposit {
  clientId;
  waypointOrigin;
  redirectUri;
  environment;
  theme;
  communicateHelper;
  constructor(config) {
    const {
      waypointOrigin = RONIN_WAYPOINT_ORIGIN_PROD,
      redirectUri = typeof window !== "undefined" ? window.location.origin : "",
      clientId,
      environment,
      theme
    } = config;
    this.waypointOrigin = waypointOrigin;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.environment = environment;
    this.theme = theme;
    this.communicateHelper = new CommunicateHelper(waypointOrigin);
  }
  start = async params => {
    const response = await this.communicateHelper.sendRequest(state => {
      const {
        email,
        walletAddress,
        fiatCurrency,
        cryptoCurrency,
        fiatAmount
      } = params ?? {};
      const query = {
        state,
        email,
        environment: this.environment,
        theme: this.theme,
        origin: this.redirectUri,
        redirect_uri: this.redirectUri,
        wallet_address: walletAddress,
        fiat_currency: fiatCurrency,
        crypto_currency: cryptoCurrency,
        fiat_amount: fiatAmount
      };
      const popupConfig = {
        width: DEPOSIT_POPUP_WIDTH,
        height: DEPOSIT_POPUP_HEIGHT
      };
      return openPopup(`${this.waypointOrigin}/client/${this.clientId}/deposit`, query, popupConfig);
    });
    return {
      provider: response.provider,
      transactionHash: response.transaction_hash,
      fiatCurrency: response.fiat_currency,
      cryptoCurrency: response.crypto_currency,
      fiatAmount: response.fiat_amount,
      cryptoAmount: response.crypto_amount
    };
  };
}

export { Deposit };
