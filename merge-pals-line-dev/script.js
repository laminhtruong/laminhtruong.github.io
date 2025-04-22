var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638809198327501400";
var config = {
    dataUrl: buildUrl + "/f07c63c711fb0f5d220139299f4577b4.data.unityweb",
    frameworkUrl: buildUrl + "/ec6f59c83577344dd439d0709a69bef4.js.unityweb",
    codeUrl: buildUrl + "/7386945e7116a6f421c86b6fef535be6.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals | Mini Dapp",
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

