var buildUrl = "https://cdn.mirailabs.co/merge_pal/web-build/Build";
var loaderUrl = buildUrl + "/production.loader.js?638633709720622767";
var config = {
    dataUrl: buildUrl + "/18bacdc87d5a4eba0a8c48fad3875418.data.unityweb",
    frameworkUrl: buildUrl + "/4e673c2d2f3a78ced96da5d16f090d28.js.unityweb",
    codeUrl: buildUrl + "/73027c29f7d9374097882675faa65ce6.wasm.unityweb",
    symbolsUrl: buildUrl + "/ecb0fc4ffd52d2f803fddd04c48e1fc4.json.unityweb",
    streamingAssetsUrl: "https://cdn.mirailabs.co/merge_pal/web-build/StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "1.2.1",

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
function runUnityCommand(method, params) {
    unityGame?.SendMessage("WebBridge", method, params);
}
function UnityTaskCallBack(taskId, success, data) {
    runUnityCommand("UnityTaskCallBack", JSON.stringify({
        taskId,
        success,
        data: ((typeof data === 'object' && data !== null) ? JSON.stringify(data) : data.toString())
    }));
}

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://mirai-labs.sgp1.cdn.digitaloceanspaces.com/merge_pal/static/1254741318562603008.json'
});

tonConnectUI.onStatusChange(walletAndwalletInfo => {
    runUnityCommand("StatusChange");
});
tonConnectUI.connectionRestored.then(restored => {
    if (restored) {
        console.log('Connection restored.');
    } else {
        console.log('Connection was not restored.');
    }
});
