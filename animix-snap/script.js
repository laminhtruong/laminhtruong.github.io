var buildUrl = "Build";
var loaderUrl = buildUrl + "/69b0e0207a7dd6505101a3e8266a8789.loader.js?638896769394229608";
var config = {
    dataUrl: buildUrl + "/95046299d559b44de85a7d7472e47c77.data.unityweb",
    frameworkUrl: buildUrl + "/05851c22e10488dcfaba944b7b0e7eb3.framework.js.unityweb",
    codeUrl: buildUrl + "/c1bf535b0791aa26edc5624f7f76c11a.wasm.unityweb",
    symbolsUrl: buildUrl + "/147b9e5cee3ba60f0fab7f91db5f0571.symbols.json.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "sg-byte",
    productName: "Animix Snap",
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
