class BridgeModule {
	init() {
		document.addEventListener("visibilitychange", function () {
			unityGame.SendMessage("UnityBridge", "OnVisibilityChange", document.visibilityState);
		});
	}

	getConfig() {
		return this.getData({
			"bot_name": "@animix_bot",
			"invite_link": "https://t.me/laminhtruongbot/mashupdev?startapp={0}",
		});
	}

	getData(data) {
		return (typeof data === 'object' && data !== null) ? JSON.stringify(data) : typeof data !== 'undefined' ? data.toString() : '';
	}

	sendTaskCallback(taskId, success, data) {
		let params = {
			id: taskId,
			success: success,
			data: this.getData(data)
		};
		unityGame.SendMessage("UnityBridge", "ExecuteCallback", JSON.stringify(params));
	}

	setLoadingProgress(args) {
		let progress = args.progress;
		let loadingBar = document.querySelector("#unity-loading-fg");
		loadingBar.style.width = 100 * args.progress + "%";

		if (progress == 1) {
			let loadingContainer = document.querySelector("#unity-loading-container");
			loadingContainer.classList.add("finished");
		}
	}

	setLoadingText(args) {
		let loadingText = document.querySelector("#unity-loading-text");
		loadingText.innerHTML = args.text;
	}

	copyToClipboard(args) {
		ClipboardJS.copy(args.text);
	}

	reload() {
		location.reload();
	}

	isProduction() {
		let host = window.location.host;
		let isProduction = false;
		return this.getData(isProduction);
	}

	getPlatform() {
		let platform = 'unknown';

		if (typeof Telegram !== 'undefined') platform = "telegram";

		return this.getData(platform);
	}
}

export default new BridgeModule;
