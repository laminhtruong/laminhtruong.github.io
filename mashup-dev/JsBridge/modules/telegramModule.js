import BridgeModule from "./bridgeModule.js";

class TelegramModule {
	init() {
		Telegram.WebApp.BackButton.onClick(() => {
			unityGame.SendMessage("UnityBridge", "OnBackButtonClicked", "");
		});
	}

	setBackButton(args) {
		if (args.visible) {
			Telegram.WebApp.BackButton.show();
		} else {
			Telegram.WebApp.BackButton.hide();
		}
	}

	getInitData() {
		if (typeof Telegram === 'undefined') return "";
		return Telegram.WebApp.initData;
	}

	openLink(args) {
		var url = args.url;
		if (typeof Telegram === 'undefined') {
			window.open(url);
			return;
		}
		if (url.startsWith("https://t.me")) {
			Telegram.WebApp.openTelegramLink(url);
		} else {
			Telegram.WebApp.openLink(url);
		}
	}

	addToHomeScreen(args) {
		try {
			Telegram.WebApp.addToHomeScreen();
			Telegram.WebApp.checkHomeScreenStatus(status => {
				var isAdded = status == "added" || status == "unknown";
				BridgeModule.sendTaskCallback(args.taskId, true, isAdded);
			});
		} catch (error) {
			BridgeModule.sendTaskCallback(args.taskId, true, false);
		}
	}

	setEmojiStatus(args) {
		try {
			Telegram.WebApp.setEmojiStatus("6095835817513586939", null, status => {
				BridgeModule.sendTaskCallback(args.taskId, true, status);
			});
		} catch (error) {
			BridgeModule.sendTaskCallback(args.taskId, true, false);
		}
	}

	openInvoice(args) {
		Telegram.WebApp.openInvoice(args.url, status => {
			var isPaid = status == "paid";
			BridgeModule.sendTaskCallback(args.taskId, isPaid, isPaid);
		});
	}

	shareStory(args) {
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
			return "true";
		}
		catch (error) {
			return "false";
		}
	}

	getLocation(args) {
		try {
			var locationManager = Telegram.WebApp.LocationManager;
			var getLocation = () => {
				locationManager.getLocation((location) => {
					if (location !== null) {
						BridgeModule.sendTaskCallback(args.taskId, true, location);
					}
					else {
						BridgeModule.sendTaskCallback(args.taskId, false, "{}");
					}
				});
			};

			if (!locationManager.isInited) {
				locationManager.init(() => {
					getLocation();
				});
			}
			else {
				getLocation();
			}
		}
		catch (error) {
			BridgeModule.sendTaskCallback(args.taskId, false, "{}");
		}
	}

	isMobile() {
		var platform = Telegram.WebApp.platform;
		return `${(platform === "android" || platform === "ios")}`;
	};
}

export default new TelegramModule;
