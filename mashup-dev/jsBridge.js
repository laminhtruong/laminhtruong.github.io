var JsBridge = {};

window.onmessage = function (event) {
	var data = event.data;
	if (data.from != "Unity") return;

	if (data.method in JsBridge) {
		JsBridge[data.method](data);
	}
	else {
		console.error("JsBridge: method not found: " + data.method);
	}
};

//-------------------- Common Function -----------------------
JsBridge.Init = function () {
	document.addEventListener("visibilitychange", function () {
		unityGame.SendMessage("UnityBridge", "BridgeOnVisibilityChange", document.visibilityState);
	});
};

JsBridge.GetData = function (data) {
	return (typeof data === 'object' && data !== null) ? JSON.stringify(data) : data.toString();
};

JsBridge.SendTaskCallback = function (taskId, success, data) {
	var params = {
		id: taskId,
		success: success,
		data: this.GetData(data)
	};
	unityGame.SendMessage("UnityBridge", "ExecuteCallback", JSON.stringify(params));
};

JsBridge.SetLoadingProgress = function (args) {
	var progress = args.progress;
	var loadingBar = document.querySelector("#unity-loading-fg");
	loadingBar.style.width = 100 * args.progress + "%";

	if (progress == 1) {
		var loadingContainer = document.querySelector("#unity-loading-container");
		loadingContainer.classList.add("finished");
	}
};

JsBridge.SetLoadingText = function (args) {
	var loadingText = document.querySelector("#unity-loading-text");
	loadingText.innerHTML = args.text;
};

JsBridge.IsMobile = function () {
	var data = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	return this.GetData(data);
};

//-------------------- Telegram Function --------------------
JsBridge.TelegramInitData = function () {
	return Telegram.WebApp.initData;
};

JsBridge.TelegramOpenLink = function (args) {
	var url = args.url;
	if (url.startsWith("https://t.me")) {
		Telegram.WebApp.openTelegramLink(url);
	} else {
		Telegram.WebApp.openLink(url);
	}
};

JsBridge.TelegramOpenInvoice = function (args) {
	Telegram.WebApp.openInvoice(args.url, status => {
		if (status == "paid") {
			this.SendTaskCallback(args.taskId, true, status);
		}
		else {
			this.SendTaskCallback(args.taskId, false, status);
		}
	});
};

JsBridge.TelegramShareStory = function (args) {
	var mediaUrl = args.mediaUrl;
	var text = args.text;
	var widgetUrl = args.widgetUrl;
	var widgetName = args.widgetName;

	try {
		Telegram.WebApp.shareToStory(mediaUrl, {
			text: text,
			widget_link: {
				url: widgetUrl,
				name: widgetName
			}
		});
		return true;
	}
	catch (error) {
		return false;
	}
};

//-------------------- TonConnect Function --------------------
JsBridge.TCUIInit = function (args) {
	tonConnectUI.onStatusChange(wallet => {
		return unityGame.SendMessage("UnityBridge", "TCUIWalletStatusChange", JSON.stringify(wallet));
	});
};

JsBridge.TCUIConnect = function (args) {
	tonConnectUI.connectWallet()
		.then(data => this.SendTaskCallback(args.taskId, true, data))
		.catch(error => this.SendTaskCallback(args.taskId, false, error));
};

JsBridge.TCUIDisconnect = function (args) {
	tonConnectUI.disconnect()
		.then(data => this.SendTaskCallback(args.taskId, true, data))
		.catch(error => this.SendTaskCallback(args.taskId, false, error));
};

JsBridge.TCUIGetWallet = function (args) {
	if (tonConnectUI.wallet !== null) {
		tonConnectUI.wallet.account.userFriendlyAddress = new TonWeb.Address(tonConnectUI.wallet.account.address).toString(true, false, false, tonConnectUI.wallet.account.chain !== '-239');
	}
	return JSON.stringify(tonConnectUI.wallet);
};
