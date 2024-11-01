var buildUrl = "Build";
var loaderUrl = buildUrl + "/69b0e0207a7dd6505101a3e8266a8789.loader.js?638660974184866310";
var config = {
    dataUrl: buildUrl + "/5afb65dd6d87d81d1497ec435ec3c300.data.unityweb",
    frameworkUrl: buildUrl + "/e4810bf8373e8368375433369472185e.framework.js.unityweb",
    codeUrl: buildUrl + "/17009ec21761cecb70d4c7c029a8bac9.wasm.unityweb",
    symbolsUrl: buildUrl + "/82d723d550aa31607bbbd7842dbbf51e.symbols.json.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "sg-byte",
    productName: "mashup",
    productVersion: "1.0.0",

    cacheControl: function (url) {
        // Caching enabled for .data and .bundle files.
        // Revalidate if file is up to date before loading from cache
        if (url.match(/\.data/) || url.match(/\.bundle/)) {
            return "must-revalidate";
        }

        // Caching enabled for .mp4 and .custom files
        // Load file from cache without revalidation.
        if (url.match(/\.mp4/) || url.match(/\.custom/)) {
            return "immutable";
        }

        // Disable explicit caching for all other files.
        // Note: the default browser cache may cache them anyway.
        return "no-store";
    },
};

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    // Define a maximum pixel ratio for mobile to avoid rendering at too high resolutions
    const maxPixelRatioMobile = 2.0;
    config.devicePixelRatio = Math.min(window.devicePixelRatio, maxPixelRatioMobile);
}
else {
    config.devicePixelRatio = 2.0;
}

var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-fg");

var unityGame;
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = function () {
    createUnityInstance(canvas, config, function (progress) {
        loadingBar.style.width = 75 * progress + "%";
    }).then(function (unityInstance) {
        unityGame = unityInstance;
    }).catch(function (message) {
        alert(message);
    });
};
document.body.appendChild(script);

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://mirai-labs.sgp1.cdn.digitaloceanspaces.com/merge_pal/static/1254741318562603008.json'
});
