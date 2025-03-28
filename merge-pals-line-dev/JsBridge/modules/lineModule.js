import UnityModule from "./unityModule.js";

class LineModule {
	constructor() {
		this.sdk = null;
		this.walletAddress = "";

		this.initSdk();
	}

	async initSdk() {
		if (typeof liff === 'undefined') {
			return;
		}

		try {
			await liff.init({ liffId: '2006898896-KvlkD1WM' });
			this.sdk = await DappPortalSDK.init({ clientId: '230a2bf5-3cd0-4d8f-8bb5-ce1f9c5e5209' });

			var walletProvider = this.sdk.getWalletProvider();
			if (walletProvider.getWalletType() != null) {
				this.requestAccounts();
			}
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

	getWalletAddress(args) {
		return UnityModule.getData(this.walletAddress);
	}

	async login(args) {
		try {
			await this.initSdk();

			var decodeIdToken = liff.getDecodedIDToken();
			if (!liff.isLoggedIn() || decodeIdToken.exp < Date.now() / 1000) {
				liff.logout();
				liff.login({ redirectUri: location.href });
			}

			let idToken = liff.getIDToken();
			UnityModule.sendTaskCallback(args.taskId, true, idToken);
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}

	async requestAccounts() {
		const walletProvider = this.sdk.getWalletProvider()
		const accounts = await walletProvider.request({ method: 'kaia_requestAccounts' });

		if (accounts && accounts.length > 0) {
			this.walletAddress = accounts[0];
		}
	}

	async connectWallet(args) {
		if (this.walletAddress == "") {
			try {
				await this.requestAccounts();
				UnityModule.sendTaskCallback(args.taskId, true, this.walletAddress);
			}
			catch (error) {
				UnityModule.sendTaskCallback(args.taskId, false, "");
			}
		}
	}

	async disconnectWallet(args) {
		try {
			const walletProvider = this.sdk.getWalletProvider()
			walletProvider.disconnectWallet();
			walletProvider.walletType = null;

			this.walletAddress = "";
			UnityModule.sendTaskCallback(args.taskId, true, "success");
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

	async showPaymentHistory() {
		try {
			const paymentProvider = this.sdk.getPaymentProvider()
			await paymentProvider.openPaymentHistory()
		}
		catch (error) {
			console.error(error)
		}
	}
}

export default new LineModule;
