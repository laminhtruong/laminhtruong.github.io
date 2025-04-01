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
			this.sdk = await DappPortalSDK.init({ clientId: '230a2bf5-3cd0-4d8f-8bb5-ce1f9c5e5209', chainId: '1001' });
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

	invite(args) {
		if (liff.isApiAvailable("shareTargetPicker")) {
			liff.shareTargetPicker([
				{
					type: "text",
					text: args.text,
				},
			]);
		}
	}

	async login(args) {
		try {
			if (liff.isInClient()) {
				const data = await this.loginMobile();
				UnityModule.sendTaskCallback(args.taskId, true, data);
			} else {
				const data = await this.loginWeb();
				UnityModule.sendTaskCallback(args.taskId, true, data);
			}
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, {});
		}
	}

	async loginMobile() {

		if (!liff.isLoggedIn()) liff.login({ redirectUri: location.href });

		const wallet_address = await this.requestAccounts();
		return { wallet_address, token_id: liff.getIDToken(), referral_code: this.getReferralCode() };
	}

	async loginWeb() {
		const walletProvider = this.sdk.getWalletProvider()
		const wallet_address = await this.requestAccounts();
		const signature = await walletProvider.request({ method: 'personal_sign', params: ['MergePals on LINE', wallet_address] });

		return { wallet_address, signature, referral_code: this.getReferralCode() };
	}

	async requestAccounts() {
		const walletProvider = this.sdk.getWalletProvider()
		const accounts = await walletProvider.request({ method: 'kaia_requestAccounts' });

		if (accounts && accounts.length > 0) {
			this.walletAddress = accounts[0];
		}

		return this.walletAddress;
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
			UnityModule.sendTaskCallback(args.taskId, true, "");
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

	isInClient() {
		return UnityModule.getData(liff.isInClient());
	}

	getWalletType() {
		const type = this.sdk.getWalletProvider().walletType;
		return type !== null ? type : "";
	}
}

export default new LineModule;
