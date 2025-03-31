import telegramModule from './modules/telegramModule.js?638790546790210827';
import unityModule from './modules/unityModule.js?638790546790210827';
import tonConnectModule from './modules/tonConnectModule.js?638790546790210827';
import tonWebModule from './modules/tonWebModule.js?638790546790210827';
import adsgramModule from './modules/adsgramModule.js?638790546790210827';
import worldAppModule from './modules/worldAppModule.js?638790546790210827';
import lineModule from './modules/lineModule.js?638790546790210827';
import binanceModule from './modules/binanceModule.js?638790546790210827';

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
