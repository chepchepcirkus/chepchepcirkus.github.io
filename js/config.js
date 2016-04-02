define(function () {
    return {
        debug:{
            layer : true,
            dashboard_layer : true,
            message : true
        },
        simulation:true,
        socket_url:'http://loonyball.fr:3000/socket/',
        layout: {
			canvas : 'renderCanvas',
			messages : 'messages',
		},
		game: {
            entity: 'loonyball',
        }
    }
});
