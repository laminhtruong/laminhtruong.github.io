import bridgeModule from './modules/bridgeModule.js?638907007587210472';
window.bridgeModule = bridgeModule;

import googleModule from './modules/googleModule.js?638907007587210472';
window.googleModule = googleModule;

import telegramModule from './modules/telegramModule.js?638907007587210472';
window.telegramModule = telegramModule;


window.executeFunctionByName = function (functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
};
