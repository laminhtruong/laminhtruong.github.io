var buildUrl = "https://cdn.mirailabs.co/games/mergepals.io/world-app-web-build/Build";
var loaderUrl = buildUrl + "/production.loader.js?638698816859565538";
var config = {
    dataUrl: buildUrl + "/f2b9de43974431d1a7d9ac6a27d12342.data.unityweb",
    frameworkUrl: buildUrl + "/30fb8f19046fa15ce38340a5dc792569.js.unityweb",
    codeUrl: buildUrl + "/98ac8e684b35d7f2fef2634b696ee2b1.wasm.unityweb",
    streamingAssetsUrl: "https://cdn.mirailabs.co/games/mergepals.io/world-app-web-build/StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "1.4.2",

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

