var buildUrl = "https://cdn.mirailabs.co/games/mergepals.io/web-build/Build";
var loaderUrl = buildUrl + "/production.loader.js?638746308531746459";
var config = {
    dataUrl: buildUrl + "/dd798d40605d752ac89fb0a6ba6705d6.data.unityweb",
    frameworkUrl: buildUrl + "/f9dff401462224d5df3ee0ffcfc5372e.js.unityweb",
    codeUrl: buildUrl + "/9004ab268929f0db4d089557ffd646a6.wasm.unityweb",
    streamingAssetsUrl: "https://cdn.mirailabs.co/games/mergepals.io/web-build/StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "1.5.3",

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
