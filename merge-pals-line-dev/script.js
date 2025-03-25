var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638785150346045642";
var config = {
    dataUrl: buildUrl + "/66d69f61b066ed29522e7722a572cb59.data.unityweb",
    frameworkUrl: buildUrl + "/834fb9b21c980ace39bec66f5a8c34b9.js.unityweb",
    codeUrl: buildUrl + "/c62c1d7848bb19ab28553afc011a4384.wasm.unityweb",
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

var container = document.querySelector("#unity-container");
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    const maxPixelRatioMobile = 2.0;
    config.devicePixelRatio = Math.min(window.devicePixelRatio, maxPixelRatioMobile);
    container.className = "unity-mobile";
}
else {
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('DOMContentLoaded', () => {
        resizeCanvas();
    });

    function resizeCanvas() {
        console.log("size change:" + window.innerWidth + "," + window.innerHeight);
        container.style.height = window.innerHeight + "px";

        if (window.innerHeight < window.innerWidth) {
            container.style.width = window.innerHeight * 9 / 16 + "px";
        } else {
            container.style.width = window.innerWidth + "px";
        }
    }

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

