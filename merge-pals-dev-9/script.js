var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638562238391208560";
var config = {
    dataUrl: buildUrl + "/4bb3114a5e833ab25fb6530a77e23be9.data.unityweb?638562238391208560",
    frameworkUrl: buildUrl + "/f5b270c4535b2ba0715abd8948657e80.js.unityweb?638562238391208560",
    codeUrl: buildUrl + "/121e02dad53c360dd196865be919331a.wasm.unityweb?638562238391208560",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "1.0.0",

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
if(isMobile) {
    // Define a maximum pixel ratio for mobile to avoid rendering at too high resolutions
    const maxPixelRatioMobile = 2.0;
    config.devicePixelRatio = Math.min(window.devicePixelRatio, maxPixelRatioMobile);
}

var canvas = document.querySelector("#unity-canvas");
var loadingContainer = document.querySelector("#unity-loading-container");
var loadingBar = document.querySelector("#unity-loading-bar-inner");

var unityGame;
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = function() {
    createUnityInstance(canvas, config, function(progress) {
        loadingBar.style.width = 100 * progress + "%";
    }).then(function(unityInstance) {
        unityGame = unityInstance;
        loadingContainer.classList.add("finished");
    }).catch(function(message) {
        alert(message);
    });
};
document.body.appendChild(script);
function runUnityCommand(method,params){
    unityGame?.SendMessage("WebBridge",method,params);
}
function UnityTaskCallBack(taskId,success,data){
    runUnityCommand("UnityTaskCallBack",JSON.stringify({
        taskId,
        success,
        data: ((typeof data === 'object' && data !== null)?JSON.stringify(data):data.toString())
    }));
}

const tonWeb=new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

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
