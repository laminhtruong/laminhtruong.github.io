var buildUrl = "Build";
var loaderUrl = buildUrl + "/Build.loader.js";
var config = {
    dataUrl: buildUrl + "/778a029fe4d2f63389c8433aa903c00e.data.unityweb",
    frameworkUrl: buildUrl + "/55a56d487b3c10c6badde9a5fc30ad16.js.unityweb",
    codeUrl: buildUrl + "/8edf6abe33cff3cdc59dc7e41f3e59fd.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Mirailabs",
    productName: "Merge Pals",
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
        data: ((typeof data === 'object' && data !== null)?JSON.stringify(data):data.toString())
    }));
}

Telegram.WebApp.expand();
Telegram.WebApp.enableClosingConfirmation();

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
