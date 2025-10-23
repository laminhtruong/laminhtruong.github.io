import bridgeModule from './modules/bridgeModule.js?638968396475026479';
import rainbowKitModule from './modules/rainbowKitModule.js?638968396475026479';

window.bridgeModule = bridgeModule;
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
