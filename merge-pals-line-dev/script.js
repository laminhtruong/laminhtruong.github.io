var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638785166501065258";
var config = {
    dataUrl: buildUrl + "/144129c2354bfa1a7caf9647c9ed0278.data.unityweb",
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
var canvas = document.querySelector("#unity-canvas");
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    const maxPixelRatioMobile = 2.0;
    config.devicePixelRatio = Math.min(window.devicePixelRatio, maxPixelRatioMobile);
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";
}
else {
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('DOMContentLoaded', () => {
        resizeCanvas();
    });

    function resizeCanvas() {
        console.log("size change:" + window.innerWidth + "," + window.innerHeight);
        container.style.height = window.innerHeight + "px";
        canvas.style.height = container.style.height;

        if (window.innerHeight < window.innerWidth) {
            container.style.width = window.innerHeight * 9 / 16 + "px";
            canvas.style.width = container.style.width
        } else {
            container.style.width = window.innerWidth + "px";
            canvas.style.width = container.style.width;
        }
    }

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

