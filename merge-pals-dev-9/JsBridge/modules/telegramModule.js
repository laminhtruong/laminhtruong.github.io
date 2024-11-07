class TelegramModule {
	getInitData() {
		if (typeof Telegram === 'undefined') return "";
		return Telegram.WebApp.initData;
	}

	openLink(args) {
		var url = args.url;
		if (typeof Telegram === 'undefined') {
			window.open(url, "_blank");
			return;
		}
		if (url.startsWith("https://t.me")) {
			Telegram.WebApp.openTelegramLink(url);
		} else {
			Telegram.WebApp.openLink(url);
		}
	}

	openInvoice(args) {
		Telegram.WebApp.openInvoice(args.url, status => {
			if (status == "paid") {
				this.SendTaskCallback(args.taskId, true, status);
			}
			else {
				this.SendTaskCallback(args.taskId, false, status);
			}
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

	isMobile() {
		var platform = Telegram.WebApp.platform;
		return `${(platform === "android" || platform === "ios")}`;
	};
}

export default new TelegramModule;
