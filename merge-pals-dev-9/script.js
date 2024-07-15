window.addEventListener("load", function () {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("ServiceWorker.js");
	}
});

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var warningBanner = document.querySelector("#unity-warning");

var buildUrl = "Build";
var loaderUrl = buildUrl + "/development.loader.js?638566745758672351";
var config = {
	dataUrl: buildUrl + "/85cb22cb7902da1a1828d05c475c1bc3.data.unityweb?638566745758672351",
	frameworkUrl: buildUrl + "/4ba2751d13eece24e5c0cb1772c25a49.js.unityweb?638566745758672351",
	codeUrl: buildUrl + "/d81d299511578ad017e0620b1de711d1.wasm.unityweb?638566745758672351",
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

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
	// Mobile device style: fill the whole browser client area with the game canvas:
	var meta = document.createElement('meta');
	meta.name = 'viewport';
	meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
	document.getElementsByTagName('head')[0].appendChild(meta);
}

var unityGame;
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
	createUnityInstance(canvas, config, (progress) => {
		progressBarFull.style.width = 100 * progress + "%";
	}).then((unityInstance) => {
		unityGame = unityInstance;
		loadingContainer.classList.add("finished");
	}).catch((message) => {
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
