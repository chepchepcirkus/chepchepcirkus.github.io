require.config({
	baseUrl:'js'
});
require(
	[
		'./config',
		'./model/game',
		'./model/user',
		'./model/layout',
		'./model/entity/loonyball',
		'./model/events',
		'./plugins',
	],
	function (config, game, user, layout, entity, events, plugins) {
		try{
			window.CHEPK = {};
			CHEPK.config = config;
			CHEPK.user = new user();
			CHEPK.game = new game();
			CHEPK.layout = new layout();
			CHEPK.plugins = [];
			if(plugins.length > 0) {
				for(var i=0;i<=plugins.length;i++) {
					if(plugins[i] != undefined) {
						CHEPK.plugins.push(new plugins[i]());
					}
				}
			}
			CHEPK.layout.init(events);
			CHEPK.game.init(entity).start();
		} catch(exception) {
			alert(exception);
		}
});
