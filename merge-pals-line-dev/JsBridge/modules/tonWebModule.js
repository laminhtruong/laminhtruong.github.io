import UnityModule from "./unityModule.js";

class TonWebModule {

	async sendTon(args) {
		try {
			if (!tonConnectUI.connected) {
				await tonConnectUI.connectWallet();
			}

			const jsonData = JSON.parse(args.data);
			const cell = new TonWeb.boc.Cell();
			cell.bits.writeUint(0, 32);
			cell.bits.writeString(jsonData.payload);

			const base64payload = TonWeb.utils.bytesToBase64(await cell.toBoc());
			const transaction = {
				validUntil: jsonData.validUntil != 0 ? jsonData.validUntil : Math.floor(Date.now() / 1000) + 3600,
				messages: [
					{
						address: jsonData.address,
						amount: TonWeb.utils.toNano(jsonData.amount.toString()).toString(),
						payload: base64payload
					}
				]
			};

			const boc = await tonConnectUI.sendTransaction(transaction);
			const bocData = TonWeb.utils.base64ToBytes(boc.boc);
			const cellResp = TonWeb.boc.Cell.oneFromBoc(bocData);
			const hash = TonWeb.utils.bytesToBase64(await cellResp.hash());
			UnityModule.sendTaskCallback(args.taskId, true, hash);
		} catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error)
		}
	}

	async sendJetton(args) {
		try {
			if (!tonConnectUI.connected) {
				await tonConnectUI.connectWallet();
			}
			const jsonData = JSON.parse(args.data);
			const sourceAddress = new TonWeb.utils.Address(tonConnectUI.wallet.account.address);
			const destinationAddress = new TonWeb.utils.Address(jsonData.destinationAddress);
			const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode(jsonData.comment)]);
			const cell = new TonWeb.boc.Cell();
			cell.bits.writeUint(0xf8a7ea5, 32); // opcode for jetton transfer
			cell.bits.writeUint(0, 64); // query id
			cell.bits.writeCoins(this.convertAmount(jsonData.amount, jsonData.token_decimals)); // store jetton amount
			cell.bits.writeAddress(destinationAddress); // TON wallet destination address
			cell.bits.writeAddress(sourceAddress); // response excess destination
			cell.bits.writeBit(false); // no custom payload
			cell.bits.writeCoins(TonWeb.utils.toNano('0')); // forward amount (if >0, will send notification message)
			cell.bits.writeBit(false); // we store forwardPayload as a reference
			cell.bits.writeBytes(comment);

			const friendlyAddress = new TonWeb.utils.Address(jsonData.jettonWallet).toString(true, false, true, tonConnectUI.wallet.account.chain !== '-239');
			const payload = TonWeb.utils.bytesToBase64(await cell.toBoc());
			const transaction = {
				validUntil: Math.floor(Date.now() / 1000) + 3600,
				messages: [
					{
						address: friendlyAddress,
						amount: TonWeb.utils.toNano('0.05').toString(),
						payload: payload,
					},
				],
			};
			const result = await tonConnectUI.sendTransaction(transaction);
			const msgBody = TonWeb.utils.base64ToBytes(result.boc);
			const msgCell = TonWeb.boc.Cell.oneFromBoc(msgBody);
			const hash = TonWeb.utils.bytesToBase64(await msgCell.hash());
			UnityModule.sendTaskCallback(args.taskId, true, hash);
		} catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}

	async claim(args) {
		try {
			const jsonData = JSON.parse(args.data);
			const cell = new TonWeb.boc.Cell();
			const fee = jsonData.op_code == '802178298' ? '0.01' : '0.1';
			cell.bits.writeUint(jsonData.op_code, 32); //claim op code

			const signatureCell = new TonWeb.boc.Cell();
			const bytesSignature = TonWeb.utils.base64ToBytes(jsonData.signature);
			signatureCell.bits.writeBytes(bytesSignature);
			cell.refs.push(signatureCell); //Signature

			const address = new TonWeb.utils.Address(jsonData.to_address);
			cell.bits.writeAddress(address); //Receiver address

			const nanoAmount = TonWeb.utils.toNano(jsonData.amount.toString());
			cell.bits.writeCoins(nanoAmount); //Amount
			cell.bits.writeUint(jsonData.deadline, 32); //Deadline
			cell.bits.writeUint(Number(jsonData.order_id), 64); //txId

			const friendlyAddress = new TonWeb.utils.Address(jsonData.contract_address).toString(true, false, true, tonConnectUI.wallet.account.chain !== '-239');
			const payload = TonWeb.utils.bytesToBase64(await cell.toBoc());
			const transaction = {
				validUntil: Math.floor(Date.now() / 1000) + 3600,
				messages: [
					{
						address: friendlyAddress,
						amount: TonWeb.utils.toNano(fee).toString(),
						payload: payload,
					},
				],
			};
			const result = await tonConnectUI.sendTransaction(transaction);
			const msgBody = TonWeb.utils.base64ToBytes(result.boc);
			const msgCell = TonWeb.boc.Cell.oneFromBoc(msgBody);
			const hash = TonWeb.utils.bytesToBase64(await msgCell.hash());
			UnityModule.sendTaskCallback(args.taskId, true, hash);
		} catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error)
		}
	}

	convertAmount(amount, decimals) {
		let comps = amount.toString().split(".");
		let whole = comps[0];
		let fraction = comps.length > 1 ? comps[1].substring(0, decimals) : "0";

		if (!whole) whole = "0";
		if (!fraction) fraction = "0";
		while (fraction.length < decimals) fraction += "0";
		whole = new TonWeb.utils.BN(whole);
		fraction = new TonWeb.utils.BN(fraction);

		const multiplier = new TonWeb.utils.BN(10).pow(new TonWeb.utils.BN(decimals));
		return whole.mul(multiplier).add(fraction);
	}
}

export default new TonWebModule;
