import bridgeModule from './modules/bridgeModule.js?638914054341851871';
import telegramModule from './modules/telegramModule.js?638914054341851871';
import lineModule from './modules/lineModule.js?638914054341851871';
import googleModule from './modules/googleModule.js?638914054341851871';

window.bridgeModule = bridgeModule;
window.telegramModule = telegramModule;
window.lineModule = lineModule;
window.googleModule = googleModule;

window.executeFunctionByName = function (functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
};
