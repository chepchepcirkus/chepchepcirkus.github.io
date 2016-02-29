define(function () {
    function game() {
        this.entity = '';
        this.config = '';
    }

    game.prototype = {
        init : function (config, user, entity, events) {
            /**
             * Initialize custom scope
             * Declare below scope to use by application
             */
            this.entity = new entity(user, events);
            this.config = config;
            var data = [
                {'user': user},
                {'entity' : this.entity}
            ];

            this.config.scope = [];
            for (var i in data) {
                if (typeof data[i] != "undefined") {
                    this.config.scope.push(data[i]);
                }
                else {
                    console.log('Initialized state : ' + data[i] + ' custom scope is undefined..');
                }
            }
            return this;
        },
        start : function () {
            this.entity.start(this.config);
            if(this.config.simulation) {
				this.entity.init(JSON.stringify({id:1}));
				this.entity.new(JSON.stringify([{
						id:1,
						position : {
							x: -0.5 ,
							y: 0.5 ,
							z: -2
						}
				}]));
			}
        }
    };
    return game;
});


