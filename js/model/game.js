define(function () {
    function game() {
		if(CHEPK.config == undefined) {
			throw 'CHEPK.config is not loaded';
		} else if(CHEPK.user == undefined) {
			throw 'CHEPK.user is not loaded';
		}
        this.entityCode = '';
        this.config = '';
        this.controller = '';
    }

    game.prototype = {
        init : function (entity) {
            /**
             * Initialize custom scope
             * Declare below scope to use by application
             */
            var entity = new entity();
            this.entityCode = entity.entity_code;
            this[this.entityCode] = entity;
            this.config = CHEPK.config;
            var data = [
                {'user': CHEPK.user},
                {'entity' : this[this.entityCode]}
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
            this[this.entityCode].start(this.config);
            if(this.config.simulation) {
                this[this.entityCode].init(JSON.stringify({id:1}));
                this[this.entityCode].new(JSON.stringify([{
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


