import { b as UserRejectedRequestError } from '../rpc-BGk0htDU.js';
import '../base-CC-Hj7CW.js';

const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 720;
const DEFAULT_TITLE = "Ronin Waypoint";
const HASHED_PARAMS = ["data"];
const buildUrlWithQuery = (inputUrl, query) => {
  const url = new URL(inputUrl);
  if (!query) return url;
  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (HASHED_PARAMS.includes(key)) {
      url.hash = `${key}=${encodeURIComponent(typeof value === "object" ? JSON.stringify(value) : value.toString())}`;
      return;
    }
    url.searchParams.set(key, value.toString());
  });
  return url;
};
const openPopup = (inputUrl, query, config) => {
  const {
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT
  } = config || {};
  if (typeof window !== "undefined" && window.top) {
    const screenLeft = window.screenLeft ?? window.screenX;
    const screenTop = window.screenTop ?? window.screenY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const left = screenLeft + (screenWidth - width) / 2;
    const top = screenTop + (screenHeight - height) / 2;
    const url = buildUrlWithQuery(inputUrl, query);
    const popup = window.open(url, DEFAULT_TITLE, `scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`);
    if (!popup) {
      throw new UserRejectedRequestError(new Error("Popup window is BLOCKED by the browser"));
    }
    popup.focus();
    return popup;
  }
};
const replaceUrl = (inputUrl, query) => {
  const url = buildUrlWithQuery(inputUrl, query);
  window.location.assign(url);
};

export { HASHED_PARAMS, buildUrlWithQuery, openPopup, replaceUrl };
