define(['plugins/dummy.plugin', 'plugins/loader'], function () {
	var plugins = [];
	for(var i=0;i<=arguments.length;i++) {
		plugins.push(arguments[i]);
	}
	return plugins;
});
