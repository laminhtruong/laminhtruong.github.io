import telegramModule from './modules/telegramModule.js?638696391481890719';
import bridgeModule from './modules/bridgeModule.js?638696391481890719';

window.telegramModule = telegramModule;
window.bridgeModule = bridgeModule;

window.executeFunctionByName = function (functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
};