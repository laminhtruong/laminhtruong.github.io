import UnityModule from "./unityModule.js";

class LineModule {
	constructor() {
		this.sdk = null;
		this.walletAddress = null;
	}

	async login(args) {
		try {
			await liff.init({ liffId: '2006898896-KvlkD1WM' });
			if (!liff.isLoggedIn()) {
				liff.login();
			}
			this.sdk = await DappPortalSDK.init({ clientId: '230a2bf5-3cd0-4d8f-8bb5-ce1f9c5e5209' });

			var idToken = liff.getIDToken();
			console.log("ID Token: " + idToken);

			UnityModule.sendTaskCallback(args.taskId, true, idToken);
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}

	async getWalletAddress(args) {
		try {
			if (this.walletAddress == null) {
				const walletProvider = this.sdk.getWalletProvider()
				const accounts = await walletProvider.request({ method: 'kaia_requestAccounts' });

				if (accounts && accounts.length > 0) {
					this.walletAddress = accounts[0];
					console.log("Wallet address: " + this.walletAddress);
				}
			}
			UnityModule.sendTaskCallback(args.taskId, true, this.walletAddress);

		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}

	async pay(args) {
		try {
			const paymentProvider = this.sdk.getPaymentProvider()
			await paymentProvider.startPayment(paymentId);

			UnityModule.sendTaskCallback(args.taskId, true, "success");
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}
}

export default new LineModule;
