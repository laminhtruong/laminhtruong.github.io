class Bridge {
	constructor() {
		this.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
			manifestUrl: 'https://laminhtruong.github.io/mirai-game/tonconnect-manifest.json'
		});
	}

	connect(callback) {
		this.tonConnectUI.onModalStateChange(state => {
			callback(this.getData('connect', state));
		});
		this.tonConnectUI.openModal();
	}

	disconnect(callback) {
		return this.tonConnectUI.disconnect();
	}

	getData(type, data) {
		return JSON.stringify({ type, data });
	}
}
