var buildUrl = "Build";
var loaderUrl = buildUrl + "/Production.loader.js";
var config = {
    dataUrl: buildUrl + "/5a7f37ff539e4131342935852e5d63bd.data.unityweb?v=0.1.0",
    frameworkUrl: buildUrl + "/db5ea42438cbeaaaec02c7b4184089e0.js.unityweb?v=0.1.0",
    codeUrl: buildUrl + "/933ca79af7d4273e514687936dcb0de8.wasm.unityweb?v=0.1.0",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
    productVersion: "0.1.0",

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

const tonWeb=new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://jsonblob.com/api/jsonBlob/1254741318562603008'
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
