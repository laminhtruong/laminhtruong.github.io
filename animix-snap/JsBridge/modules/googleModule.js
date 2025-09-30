class GoogleModule {
	constructor() {
		this.GOOGLE_CLIENT_ID = '113148838872-nigvcmbhcpnptojs5kr5fgk0ek7fp6it.apps.googleusercontent.com';
		this.REDIRECT_URI = 'https://snap-api-test.animix.tech/public/auth/google';
	}

	async login(args) {
		var params = {};
		if (args.refcode && args.refcode.length > 0) {
			params.refcode = args.refcode;
		}
		if (args.token) {
			params.token = args.token;
		}

		let url = `https://accounts.google.com/o/oauth2/v2/auth?` +
			`client_id=${this.GOOGLE_CLIENT_ID}&` +
			`redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&` +
			`response_type=code&` +
			`scope=${encodeURIComponent('openid email profile')}&` +
			`access_type=offline&` +
			`prompt=consent`;

		if (Object.keys(params).length > 0) {
			url += `&state=${btoa(JSON.stringify(params))}`;
		}

		window.location.href = url;
	}
}

export default new GoogleModule;
