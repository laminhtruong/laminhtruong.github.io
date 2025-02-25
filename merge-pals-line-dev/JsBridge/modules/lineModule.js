import UnityModule from "./unityModule.js";

class LineModule {
	async login(args) {
		try {
			await liff.init({ liffId: '2006898896-KvlkD1WM' });

			var idToken = liff.getIDToken();
			UnityModule.sendTaskCallback(args.taskId, false, idToken);
		}
		catch (error) {
			UnityModule.sendTaskCallback(args.taskId, false, error);
		}
	}
}

export default new LineModule;
