import UnityModule from "./unityModule.js";

class RoninModule {
	constructor() {
		this.waypointProvider = null;
		this.initSdk();
	}

	async initSdk() {
		if (typeof window.WaypointProvider === 'undefined') {
			return;
		}

		this.waypointProvider = window.WaypointProvider.create({
			clientId: '0210f4d4-86db-4b2e-b7b4-fd3aeceb9b34',
			chainId: '2020',
		});
	}

	async connectWallet(args) {
		try {
			const { token, address } = await this.waypointProvider.connect();
			UnityModule.sendTaskCallback(args.taskId, true, { token_id: token, wallet_address: address });
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, "{}");
		}
	}

	async disconnectWallet(args) {
		try {
			this.waypointProvider.disconnect();
			UnityModule.sendTaskCallback(args.taskId, true, "");
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}
}

export default new RoninModule;
