var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638825758853702083";
var config = {
    dataUrl: buildUrl + "/e59baa5b8c52674763b9f5c8e832b0e5.data.unityweb",
    frameworkUrl: buildUrl + "/faa74f891d7d20ad6bd999fe1e304a6b.js.unityweb",
    codeUrl: buildUrl + "/8f93e629782a82c30549263b9f73a7ae.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
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

