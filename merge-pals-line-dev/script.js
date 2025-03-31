var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638790228982408733";
var config = {
    dataUrl: buildUrl + "/ee6e5285e929725330b7684f92769ac8.data.unityweb",
    frameworkUrl: buildUrl + "/ba6e26890306dcaa92ebd30c644dfc07.js.unityweb",
    codeUrl: buildUrl + "/92298a45250a16e5ec78e2ddcf53a1e0.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "MergePals | Mini Dapp",
    productVersion: "2.1.4",

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

