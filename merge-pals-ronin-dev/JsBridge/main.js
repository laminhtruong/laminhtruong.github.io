import telegramModule from './modules/telegramModule.js?638850847721199250';
import unityModule from './modules/unityModule.js?638850847721199250';
import tonConnectModule from './modules/tonConnectModule.js?638850847721199250';
import tonWebModule from './modules/tonWebModule.js?638850847721199250';
import adsgramModule from './modules/adsgramModule.js?638850847721199250';
import worldAppModule from './modules/worldAppModule.js?638850847721199250';
import lineModule from './modules/lineModule.js?638850847721199250';
import roninModule from './modules/roninModule.js?638850847721199250';
import binanceModule from './modules/binanceModule.js?638850847721199250';

window.telegramModule = telegramModule;
window.unityModule = unityModule;
window.tonConnectModule = tonConnectModule;
window.tonWebModule = tonWebModule;
window.adsgramModule = adsgramModule;
window.worldAppModule = worldAppModule;
window.lineModule = lineModule;
window.roninModule = roninModule;
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
