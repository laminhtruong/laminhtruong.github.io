class UnityModule {
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

	reload() {
		location.reload();
	}

	isProduction() {
		let host = window.location.host;
		let isProduction = host.indexOf("client.mergepals.io") > -1 ||
			host.indexOf("client-world-app.mergepals.io") > -1 ||
			host.indexOf("client-line.mergepals.io") > -1;

		return this.getData(isProduction);
	}

	getPlatform() {
		let platform = 'unknown';

		if (typeof Telegram !== 'undefined') platform = "telegram";
		else if (typeof window.WorldAppMiniKit !== 'undefined') platform = "world_app";
		else if (typeof liff !== 'undefined') platform = "line";
		else if (typeof window.WaypointProvider !== 'undefined') platform = "ronin";

		return this.getData(platform);
	}
}

export default new UnityModule;
