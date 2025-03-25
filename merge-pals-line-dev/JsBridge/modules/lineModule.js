import UnityModule from "./unityModule.js";

class LineModule {
	constructor() {
		this.sdk = null;
		this.walletAddress = null;
	}

	async initSdk() {
		if (typeof liff === 'undefined') {
			return;
		}

		try {
			await liff.init({ liffId: '2006898896-KvlkD1WM' });

			let decodeIdToken = liff.getDecodedIDToken();
			if (!liff.isLoggedIn() || decodeIdToken.exp < Date.now() / 1000) {
				liff.login({ redirectUri: location.href });
			}

			this.sdk = await DappPortalSDK.init({ clientId: '230a2bf5-3cd0-4d8f-8bb5-ce1f9c5e5209' });
		} catch (error) {
			console.error(error);
		}
	}

	getParam(param) {
		let query = window.location.search.substring(1);
		let params = query.split("&");

		for (let i = 0; i < params.length; i++) {
			let pair = params[i].split("=");
			if (pair[0] == param) {
				return pair[1];
			}
		}

		return "";
	}

	getReferralCode() {
		return UnityModule.getData(this.getParam("referral_code"));
	}

	async login(args) {
		try {
			await this.initSdk();

			let idToken = liff.getIDToken();
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
			await paymentProvider.startPayment(args.paymentId);

			UnityModule.sendTaskCallback(args.taskId, true, "success");
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}
}

export default new LineModule;
