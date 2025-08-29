import bridgeModule from './modules/bridgeModule.js?638920803276892602';
import telegramModule from './modules/telegramModule.js?638920803276892602';
import lineModule from './modules/lineModule.js?638920803276892602';
import googleModule from './modules/googleModule.js?638920803276892602';

window.bridgeModule = bridgeModule;
window.telegramModule = telegramModule;
window.lineModule = lineModule;
window.googleModule = googleModule;

import rainbowKitModule from './modules/rainbowKitModule.js?638920803276892602';
window.rainbowKitModule = rainbowKitModule;

window.executeFunctionByName = function (functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
};
