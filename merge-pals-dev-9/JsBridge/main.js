import telegramModule from './modules/telegramModule.js?638672150691852464';
import unityModule from './modules/unityModule.js?638672150691852464';
import tonConnectModule from './modules/tonConnectModule.js?638672150691852464';
import tonWebModule from './modules/tonWebModule.js?638672150691852464';
import adsgramModule from './modules/adsgramModule.js?638672150691852464';
import worldAppModule from './modules/worldAppModule.js?638672150691852464';

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