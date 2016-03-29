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
			CHEPK.layout = new layout();
			CHEPK.user = new user();
			CHEPK.game = new game();
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
			if(CHEPK.config.debug.message == true) {
				document.getElementById('messages').innerHTML = '<div class="error">' + exception + '</div>';
			} else {
				document.getElementById('messages').innerHTML = '<div class="error">Oups ... An error occured!</div>';
			}
		}
});
