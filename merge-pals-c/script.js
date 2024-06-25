var buildUrl = "Build";
var loaderUrl = buildUrl + "/Build.loader.js";
var config = {
    dataUrl: buildUrl + "/a409e437c117b9d86661f6ef6cb87851.data.unityweb",
    frameworkUrl: buildUrl + "/69736e448eebc9f716290fc708a6649b.js.unityweb",
    codeUrl: buildUrl + "/fff501f9cc3d51b817850097b0724f2f.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "PetM",
    productVersion: "0.1.0",
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
        data: ((typeof data === 'object' && data !== null)?JSON.stringify(data):data)
    }));
}

Telegram.WebApp.expand();
const tonWeb=new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));
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
