var buildUrl = "https://cdn.mirailabs.co/games/mergepals.io/web-build/Build";
var loaderUrl = buildUrl + "/production.loader.js?638775580875841383";
var config = {
    dataUrl: buildUrl + "/db36314bcae2655d1bdc274d950a60eb.data.unityweb",
    frameworkUrl: buildUrl + "/051edf9140963110e7a3b67f4e71f4b6.js.unityweb",
    codeUrl: buildUrl + "/be858a28d8b2ba036e8cc5570172d53b.wasm.unityweb",
    streamingAssetsUrl: "https://cdn.mirailabs.co/games/mergepals.io/web-build/StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "2.1.3",

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
    manifestUrl: 'https://cdn.mirailabs.co/merge_pal/static/1254741318562603008.json'
});
