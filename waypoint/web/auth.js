import { CommunicateHelper } from '../common/communicate.js';
import { generateRandomString, generateCodeChallenge } from '../common/crypto.js';
import { RONIN_WAYPOINT_ORIGIN_PROD } from '../common/gate.js';
import { replaceUrl, openPopup } from '../common/popup.js';
import { getScopesParams } from '../common/scope.js';
import { validateIdAddress } from './utils/validate-address.js';
import { v as v4 } from '../v4-CU-e4i5S.js';
import '../common/defer.js';
import '../common/waypoint-error.js';
import '../rpc-BGk0htDU.js';
import '../base-CC-Hj7CW.js';
import '../isAddress-BUhRlNtM.js';
import '../toBytes-rCiiThej.js';
import '../size-CssOTqqV.js';
import '../keccak256-B1CwQAsk.js';
import '../utils-CKEBUnDS.js';

const getPKCEParams = usePKCE => {
  if (!usePKCE) return {};
  const codeVerifier = generateRandomString();
  return {
    response_type: "code",
    code_challenge_algo: "S256",
    code_challenge: generateCodeChallenge(codeVerifier),
    codeVerifier
  };
};
/**
 * Authorize a user via Ronin Waypoint, returning an token and user address.
 *
 * @param opts Options for authorization.
 * @returns Authorization result including token and user addresses, or undefined in case of redirect.
 *
 * @example
 * import { authorize } from "@sky-mavis/waypoint"
 *
 * const { token, address } = await authorize({
 *  mode: "popup",
 *  clientId: "YOUR_CLIENT_ID",
 * })
 */
const authorize = async opts => {
  const {
    mode,
    clientId,
    scopes,
    checks = [],
    waypointOrigin = RONIN_WAYPOINT_ORIGIN_PROD,
    redirectUrl = window.location.origin
  } = opts;
  const isPKCE = checks.includes("pkce");
  const {
    codeVerifier,
    ...pkceParams
  } = getPKCEParams(isPKCE);
  const authorizeUrl = `${waypointOrigin}/client/${clientId}/authorize`;
  const baseParams = {
    redirect: redirectUrl,
    scope: getScopesParams(scopes),
    ...pkceParams
  };
  if (mode === "redirect") {
    const redirectParams = {
      ...baseParams,
      state: opts.state ?? v4()
    };
    replaceUrl(authorizeUrl, redirectParams);
    return isPKCE ? {
      codeVerifier
    } : undefined;
  }
  const helper = new CommunicateHelper(waypointOrigin);
  const popupParams = {
    ...baseParams,
    origin: window.location.origin
  };
  if (isPKCE) {
    const pkceAuthData = await helper.sendRequest(state => openPopup(authorizeUrl, {
      ...popupParams,
      state
    }));
    return {
      codeVerifier: codeVerifier,
      authorizationCode: pkceAuthData.authorization_code
    };
  }
  const authData = await helper.sendRequest(state => openPopup(authorizeUrl, {
    ...popupParams,
    state
  }));
  return {
    token: authData?.id_token,
    address: validateIdAddress(authData?.address),
    secondaryAddress: validateIdAddress(authData?.secondary_address)
  };
};
/**
 * Parse the redirect URL after authorization.
 * This function should be called in the redirect URL page.
 *
 * @returns Parsed data from the redirect URL.
 *
 * @example
 * const { state, token, address } = parseRedirectUrl()
 */
const parseRedirectUrl = () => {
  const url = new URL(window.location.href);
  const method = url.searchParams.get("method");
  if (method !== "auth") {
    throw "parseRedirectUrl: invalid method";
  }
  const type = url.searchParams.get("type");
  if (type !== "success") {
    throw "parseRedirectUrl: authorization failed";
  }
  const state = url.searchParams.get("state");
  const rawToken = url.searchParams.get("data");
  const rawAddress = url.searchParams.get("address");
  const secondaryAddress = url.searchParams.get("secondary_address");
  const authorizationCode = url.searchParams.get("authorization_code");
  return {
    state,
    authorizationCode,
    token: rawToken,
    address: validateIdAddress(rawAddress),
    secondaryAddress: validateIdAddress(secondaryAddress)
  };
};

export { authorize, parseRedirectUrl };
