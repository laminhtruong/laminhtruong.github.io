const LOCKBOX_PROD_HTTP_URL = "https://lockbox.skymavis.com";
const LOCKBOX_PROD_WS_URL = "wss://lockbox.skymavis.com";
const LOCKBOX_STAG_HTTP_URL = "https://project-x.skymavis.one";
const LOCKBOX_STAG_WS_URL = "wss://project-x.skymavis.one";
const getServiceUrls = env => {
  switch (env) {
    case "prod":
      return {
        httpUrl: LOCKBOX_PROD_HTTP_URL,
        wsUrl: LOCKBOX_PROD_WS_URL
      };
    case "stag":
      return {
        httpUrl: LOCKBOX_STAG_HTTP_URL,
        wsUrl: LOCKBOX_STAG_WS_URL
      };
    default:
      return env;
  }
};
const isProd = productionFactor => {
  if (typeof productionFactor === "boolean") {
    return productionFactor;
  }
  return productionFactor === LOCKBOX_PROD_WS_URL || productionFactor === LOCKBOX_PROD_HTTP_URL;
};

export { getServiceUrls, isProd };
