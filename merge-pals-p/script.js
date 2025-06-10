var buildUrl = "Build";
var loaderUrl = buildUrl + "/production.loader.js?638851510611568217";
var config = {
    dataUrl: buildUrl + "/3fbe30bf9245742e484b9666c030151c.data.unityweb",
    frameworkUrl: buildUrl + "/16f5d5022b01cdf91f6b19be8416492e.js.unityweb",
    codeUrl: buildUrl + "/7b8409fa5f3456f9a8dda81c60e7023e.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "3.0.0",

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

if (isMobile) {
    const maxPixelRatioMobile = 2.0;
    config.devicePixelRatio = Math.min(window.devicePixelRatio, maxPixelRatioMobile);
}
else {
    config.devicePixelRatio = 2.0;
}

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
    manifestUrl: 'https://mergepals.io/tonconnect-manifest.json',
});
