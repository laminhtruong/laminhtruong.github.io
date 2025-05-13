import UnityModule from "./unityModule.js";

class RoninModule {
	constructor() {
		this.GAME_IAP_ABI = [{ "inputs": [{ "internalType": "bytes32", "name": "orderId", "type": "bytes32" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "buy", "outputs": [], "stateMutability": "payable", "type": "function" }];
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

	async pay(args) {
		const jsonData = JSON.parse(args.data);
		const ethers = window.Ethers;
		const provider = new ethers.providers.Web3Provider(this.waypointProvider);
		const signer = provider.getSigner();

		const gameIAPContract = new ethers.Contract(
			jsonData.contract_address,
			this.GAME_IAP_ABI,
		);

		const orderId = jsonData.order_id;
		const amountToBuy = ethers.utils.parseEther(jsonData.amount.toString());

		try {
			const tx = await signer.sendTransaction({
				to: jsonData.contract_address,
				value: amountToBuy,
				data: gameIAPContract.interface.encodeFunctionData("buy", [
					orderId,
					ethers.constants.AddressZero,
					amountToBuy,
				]),
				maxFeePerGas: ethers.utils.parseUnits("21", "gwei"), // minimum fee = 21 gwei
				maxPriorityFeePerGas: ethers.utils.parseUnits("20", "gwei"), // minimum tip = 20 gwei
			});

			const receipt = await tx.wait();
			if (receipt.status === 1) {
				UnityModule.sendTaskCallback(args.taskId, true, receipt.transactionHash);
			} else {
				UnityModule.sendTaskCallback(args.taskId, false, UnityModule.getError("Transaction failed"));
			}
		} catch (error) {
			const errorMessage = error.details || error;
			UnityModule.sendTaskCallback(args.taskId, false, UnityModule.getError(errorMessage));
		}
	}
}

export default new RoninModule;
