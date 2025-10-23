import BridgeModule from './bridgeModule.js';

class RainbowKitModule {
	constructor() {
		this.initSdk();
	}

	async initSdk() {
		if (
			typeof window.RainbowKitUMD !== "undefined" &&
			typeof window.RainbowKitUMD.renderRainbowKitWrapper !== "undefined"
		) {
			const config = {
				appName: "Animix Snap",
				projectId: "be8caf8e619c12ce975393e921477985",
				chains: [
					window.RainbowKitUMD.viem.chains.mainnet, // Ethereum Mainnet (1)
					window.RainbowKitUMD.viem.chains.sepolia, // Sepolia Testnet (11155111)
					window.RainbowKitUMD.viem.chains.polygon, // Polygon Mainnet (137)
					window.RainbowKitUMD.viem.chains.arbitrum, // Arbitrum One (42161)
				],
				initialChain: 1,
			};

			// Or use all available chains
			const allChains = Object.values(window.RainbowKitUMD.viem.chains);
			console.log("All available chains:", allChains);

			try {
				const walletProvider = await window.RainbowKitUMD.renderRainbowKitWrapper(config);
				console.log("RainbowKit initialized:", walletProvider);
			} catch (error) {
				console.error("Failed to initialize:", error);
			}
		}
	}

	async connect(args) {
		try {
			const status = await walletProvider.getStatus();
			if (!status.isConnected) {
				var result = await walletProvider.connectWallet();
				BridgeModule.sendTaskCallback(args.taskId, true, result.address.toLowerCase());
			} else {
				BridgeModule.sendTaskCallback(args.taskId, true, status.address.toLowerCase());
			}
		} catch (error) {
			BridgeModule.sendTaskCallback(args.taskId, false, error);
		}
	}

	async disconnect(args) {
		try {
			const status = await walletProvider.getStatus();
			if (status.isConnected) {
				var result = await walletProvider.disconnect();
				BridgeModule.sendTaskCallback(args.taskId, true, result.success);
			} else {
				BridgeModule.sendTaskCallback(args.taskId, true, true);
			}
		} catch (error) {
			BridgeModule.sendTaskCallback(args.taskId, false, false);
		}
	}

	async login(args) {
		try {
			var chainData = await walletProvider.getChainId();
			var chainId = chainData.chainId;
			var addressData = await walletProvider.getAddress();
			var address = addressData.address.toLowerCase();
			var message = `SSS wants you to sign in with your wallet:\n${address}\n\nNonce: ${args.nonce}\nURI: ${BridgeModule.getRootLink()}\nVersion: 1\nChain ID: ${chainId}\n`;

			const result = await walletProvider.signPersonalMessage({
				message: message,
			});

			if (result.success) {
				BridgeModule.sendTaskCallback(args.taskId, true, { address, signature: result.signature, message });
			} else {
				BridgeModule.sendTaskCallback(args.taskId, false, result.error);
			}
		} catch (error) {
			BridgeModule.sendTaskCallback(args.taskId, false, error);
		}
	}
}

export default new RainbowKitModule;
