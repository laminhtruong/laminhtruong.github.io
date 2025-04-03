import { j as jwtDecode } from '../../index-B3KPQWEG.js';
import { version } from '../../common/version.js';
import { HeadlessClientError, HeadlessClientErrorCode } from '../error/client.js';
import { ServerError } from '../error/server.js';
import { isProd } from '../utils/service-url.js';
import { v as v4 } from '../../v4-CU-e4i5S.js';
import { s as sha256 } from '../../sha256-scJRO6jx.js';
import { d as stringToHex } from '../../toBytes-rCiiThej.js';
import '../proto/rpc.js';
import '../../file-8Ag42MRZ.js';
import '../../enum-DxRJVtGK.js';
import '../../sha256-E5MvF2nn.js';
import '../../utils-CKEBUnDS.js';
import '../../size-CssOTqqV.js';
import '../../base-CC-Hj7CW.js';

const CONTENT_TYPE = "application/json";
const TRACK_URL = "https://x.skymavis.com/track";
const AUTHORIZATION_PROD = "Basic ODZkMTNkMmYtYWFmYy00M2YyLWJhZDctNDI2NTBiYmJmZTJlOg==";
const AUTHORIZATION_STAG = "Basic ZDU1ODQyODYtOWIwYS00MzE3LWI3YjktOWRjOTQwNmFiMzJlOg==";
var HeadlessEventName;
(function (HeadlessEventName) {
  HeadlessEventName["backupShard"] = "backupShard";
  HeadlessEventName["decryptShard"] = "decryptShard";
  HeadlessEventName["keygen"] = "keygen";
  HeadlessEventName["personalSign"] = "personalSign";
  HeadlessEventName["signTypedData"] = "signTypedData";
  HeadlessEventName["sendLegacyTransaction"] = "sendLegacyTransaction,";
  HeadlessEventName["sendSponsoredTransaction"] = "sendSponsoredTransaction,";
})(HeadlessEventName || (HeadlessEventName = {}));
const track = (events, isProdEnv) => {
  const headers = new Headers({});
  headers.set("Authorization", isProdEnv ? AUTHORIZATION_PROD : AUTHORIZATION_STAG);
  headers.set("Content-Type", CONTENT_TYPE);
  headers.set("Accept", CONTENT_TYPE);
  const body = JSON.stringify({
    events
  });
  return fetch(TRACK_URL, {
    method: "POST",
    headers,
    body
  });
};
const TRACKING_OFFSET_KEY = "WAYPOINT.HEADLESS.TRACKING_OFFSET";
const getOffset = () => {
  const storageReady = typeof window !== "undefined" && "sessionStorage" in window;
  if (!storageReady) return 0;
  try {
    const currentOffset = parseInt(sessionStorage.getItem(TRACKING_OFFSET_KEY) ?? "0");
    const newOffset = currentOffset + 1;
    sessionStorage.setItem(TRACKING_OFFSET_KEY, newOffset.toString());
    return currentOffset;
  } catch (error) {
    return 0;
  }
};
const getUTCTime = () => {
  const date = new Date();
  const timestamp = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
  return timestamp;
};
const toErrorProperties = error => {
  if (error instanceof HeadlessClientError) return {
    error_level: "error",
    error_type: "client_defined",
    error_name: error.name,
    error_code: error.code,
    error_message: error.shortMessage
  };
  if (error instanceof ServerError) return {
    error_level: "error",
    error_type: "server",
    error_name: error.name,
    error_code: error.code,
    error_message: error.shortMessage
  };
  if (error instanceof Error) return {
    error_level: "error",
    error_type: "client_unknown",
    error_name: error.name,
    error_code: HeadlessClientErrorCode.UnknownError,
    error_message: error.message
  };
  return {
    error_level: "error",
    error_type: "client_unknown",
    error_name: "UnknownError",
    error_code: HeadlessClientErrorCode.UnknownError,
    error_message: "Unknown error"
  };
};
const createTracker = params => {
  const {
    event,
    waypointToken,
    wasmUrl = "",
    productionFactor = false
  } = params;
  const startTime = performance.now();
  const isProdEnv = isProd(productionFactor);
  const _getCommonData = () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    const {
      iss = "",
      sub = "",
      sid = "",
      aud = [],
      client_id = ""
    } = jwtDecode(waypointToken);
    return {
      event,
      uuid: v4(),
      offset: getOffset(),
      timestamp: getUTCTime(),
      session_id: sid,
      user_id: iss && sub ? sha256(stringToHex(`${iss}:${sub}`)) : "",
      ref: "",
      commonActionProperties: {
        aud,
        iss,
        sub,
        client_id,
        origin: window?.location?.origin ?? "",
        user_agent: navigator?.userAgent ?? "",
        sdk_version: version,
        wasm_version: wasmUrl,
        duration
      }
    };
  };
  const trackOk = okProperties => {
    try {
      const {
        commonActionProperties,
        ...restCommonData
      } = _getCommonData();
      const {
        request,
        response
      } = okProperties;
      const trackData = {
        ...restCommonData,
        action: "ok",
        action_properties: {
          ...commonActionProperties,
          request,
          response
        }
      };
      const trackEvent = {
        type: "track",
        data: trackData
      };
      track([trackEvent], isProdEnv);
    } catch (error) {
      /* empty */
    }
  };
  const trackError = error => {
    try {
      const {
        commonActionProperties,
        ...restCommonData
      } = _getCommonData();
      const errorProperties = toErrorProperties(error);
      const trackData = {
        ...restCommonData,
        action: "error",
        action_properties: {
          ...commonActionProperties,
          ...errorProperties
        }
      };
      const trackEvent = {
        type: "track",
        data: trackData
      };
      track([trackEvent], isProdEnv);
    } catch (error) {
      /* empty */
    }
  };
  return {
    trackOk,
    trackError
  };
};

export { HeadlessEventName, createTracker };
