var buildUrl = "Build";
var loaderUrl = buildUrl + "/production.loader.js?638712642491605896";
var config = {
    dataUrl: buildUrl + "/dfbb0bb8c186d63f4dbd536bbe003193.data.unityweb",
    frameworkUrl: buildUrl + "/a4c38d27e216789d003fb26c917a2d86.js.unityweb",
    codeUrl: buildUrl + "/d1148af348d35dfb28245e75cab3c895.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "1.5.0",

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

const miraiWallet = {
    appName: "miraiapp-tg",
    name: "Mirai App",
    imageUrl: "https://cdn.mirailabs.co/miraihub/miraiapp-tg-icon-288.png",
    aboutUrl: "https://mirai.app",
    universalLink: "https://t.me/MiraiAppBot?attach=wallet",
    bridgeUrl: "https://bridge.tonapi.io/bridge",
    platforms: ["ios", "android", "macos", "windows", "linux"],
}
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://cdn.mirailabs.co/merge_pal/static/1254741318562603008.json',
    walletsListConfiguration: {
        includeWallets: [miraiWallet]
    }
});
