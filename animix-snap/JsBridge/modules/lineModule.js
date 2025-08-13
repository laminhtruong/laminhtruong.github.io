import BridgeModule from "./bridgeModule.js";

class LineModule {
	constructor() {
		this.initSdk();
	}

	async initSdk() {
		if (typeof liff === 'undefined') {
			return;
		}

		try {
			await liff.init({ liffId: '2007905780-AnWR3LxW' });
		} catch (error) {
			console.error(error);
		}
	}

	getReferralCode() {
		return BridgeModule.getData(BridgeModule.getParam("referral_code"));
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
				if (!liff.isLoggedIn()) liff.login({ redirectUri: location.href });
				BridgeModule.sendTaskCallback(args.taskId, true, { access_token: liff.getAccessToken(), referral_code: this.getReferralCode() });
			} else {
				BridgeModule.sendTaskCallback(args.taskId, false, BridgeModule.getError("This platform is not support"));
			}
		}
		catch (error) {
			BridgeModule.sendTaskCallback(args.taskId, false, error);
		}
	}

	isInClient() {
		return BridgeModule.getData(liff.isInClient());
	}
}

export default new LineModule;
