define(function () {
    return {
        debug:{
            layer : true,
            dashboard_layer : true,
            message : true
        },
        simulation:true,
        layout: {
			canvas : 'renderCanvas',
			messages : 'messages',
		},
		game: {
            entity: 'loonyball',
        }
    }
});
