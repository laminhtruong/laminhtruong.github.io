import telegramModule from './modules/telegramModule.js?638780651733684403';
import unityModule from './modules/unityModule.js?638780651733684403';
import tonConnectModule from './modules/tonConnectModule.js?638780651733684403';
import tonWebModule from './modules/tonWebModule.js?638780651733684403';
import adsgramModule from './modules/adsgramModule.js?638780651733684403';
import worldAppModule from './modules/worldAppModule.js?638780651733684403';
import lineModule from './modules/lineModule.js?638780651733684403';
import binanceModule from './modules/binanceModule.js?638780651733684403';

window.telegramModule = telegramModule;
window.unityModule = unityModule;
window.tonConnectModule = tonConnectModule;
window.tonWebModule = tonWebModule;
window.adsgramModule = adsgramModule;
window.worldAppModule = worldAppModule;
window.lineModule = lineModule;
window.binanceModule = binanceModule;

window.executeFunctionByName = function (functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}

window.binanceModule.connect();
