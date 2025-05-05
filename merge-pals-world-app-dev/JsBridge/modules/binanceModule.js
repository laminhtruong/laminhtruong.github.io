class BinanceModule {
	connect(args) {
		const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@markPrice@1s');

		ws.addEventListener("open", (event) => {
			console.log('connected to binance');
		});

		ws.addEventListener("message", (event) => {
			const json = JSON.parse(event.data);
			const price = parseFloat(json.p).toFixed(2);

			if (typeof unityGame === 'undefined') return;
			unityGame.SendMessage("UnityBridge", "OnPriceChange", price);
		});
	}
}

export default new BinanceModule;
