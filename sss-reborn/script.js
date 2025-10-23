var buildUrl = "Build";
var loaderUrl = buildUrl + "/43e2502d740906e412ee4ebb331ab97f.loader.js?638968396475026479";
var config = {
    dataUrl: buildUrl + "/7ad53370961d5a83ec7d33f66c851cf8.data.unityweb",
    frameworkUrl: buildUrl + "/a4088b6b68a0cebc1b33aaaaea45013c.framework.js.unityweb",
    codeUrl: buildUrl + "/00e7549640d89c5b914edf41f6697fab.wasm.unityweb",
    symbolsUrl: buildUrl + "/b6631e81389061bd0bef7d58a41a4654.symbols.json.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "sg-byte",
    productName: "Super Sushi Samurai",
    productVersion: "1.0.0",

    cacheControl: function (url) {
        // Caching enabled for .data and .bundle files.
        // Revalidate if file is up to date before loading from cache
        if (url.match(/\.data/)) {
            return "must-revalidate";
        }

        if (url.match(/\.bundle/)) {
            return "immutable";
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
