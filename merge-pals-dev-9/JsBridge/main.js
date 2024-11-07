import telegramModule from './modules/telegramModule.js';
import unityModule from './modules/unityModule.js';
import tonConnectModule from './modules/tonConnectModule.js';
import tonWebModule from './modules/tonWebModule.js';
import adsgramModule from './modules/adsgramModule.js';
import worldAppModule from './modules/worldAppModule.js';

window.telegramModule = telegramModule;
window.unityModule = unityModule;
window.tonConnectModule = tonConnectModule;
window.tonWebModule = tonWebModule;
window.adsgramModule = adsgramModule;
window.worldAppModule = worldAppModule;

window.executeFunctionByName = function (functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}
