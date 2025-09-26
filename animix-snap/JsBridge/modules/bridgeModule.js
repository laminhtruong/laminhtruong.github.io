class BridgeModule {
	init() {
		document.addEventListener("visibilitychange", function () {
			unityGame.SendMessage("UnityBridge", "OnVisibilityChange", document.visibilityState);
		});
	}

	getData(data) {
		return (typeof data === 'object' && data !== null) ? JSON.stringify(data) : typeof data !== 'undefined' ? data.toString() : '';
	}

	getError(message) {
		return "{\"message\": \"" + message + "\"}";
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

	reload(args) {
		if (args.root) {
			window.location.href = this.getRootLink();
		} else {
			location.reload();
		}
	}

	isProduction() {
		let host = window.location.host;
		let isProduction = false;
		return this.getData(isProduction);
	}

	getRootLink() {
		let link = window.location.href.replace(window.location.search, '').replace(window.location.hash, '');
		return this.getData(link);
	}

	getPlatform() {
		let platform = 'unknown';

		if (Telegram.WebApp.initData !== '') platform = "telegram";
		else if (liff.isInClient()) platform = "line";
		else platform = "web";

		return this.getData(platform);
	}

	getParams() {
		let query = window.location.search.substring(1);
		let params = query.split("&");
		let result = {};

		for (let i = 0; i < params.length; i++) {
			let pair = params[i].split("=");
			if (pair[0] !== "") {
				result[pair[0]] = pair[1];
			}
		}

		return this.getData(result);
	}

	storageSet(args) {
		localStorage.setItem(args.key, args.value);
	}

	storageGet(args) {
		let value = localStorage.getItem(args.key);
		if (value === null) value = "";

		return this.getData(value);
	}

}

export default new BridgeModule;
