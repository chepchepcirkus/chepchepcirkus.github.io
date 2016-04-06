define(function () {
    return {
        debug:{
            layer : false,
            dashboard_layer : false,
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
