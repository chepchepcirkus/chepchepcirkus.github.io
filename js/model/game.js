define(function () {
    function game() {
		if(CHEPK.config == undefined) {
			throw 'CHEPK.config is not loaded';
		} else if(CHEPK.user == undefined) {
			throw 'CHEPK.user is not loaded';
		}
        this.entityCode = '';
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
            var data = [
                {'user': CHEPK.user},
                {'loonyball': this[this.entityCode]}
            ];

            CHEPK.config.scope = [];
            for (var i in data) {
                if (typeof data[i] != "undefined") {
                    CHEPK.config.scope.push(data[i]);
                }
                else {
                    console.log('Initialized state : ' + data[i] + ' custom scope is undefined..');
                }
            }
            return this;
        },
        start : function () {
            this[this.entityCode].start(CHEPK.config);
            if(CHEPK.config.simulation) {
                this[this.entityCode].init(JSON.stringify({id:1}));
                this[this.entityCode].new(
                    [
                        {
                            id:1,
                            position : {
                                x: -0.5 ,
                                y: 0.5 ,
                                z: 2
                            }
				        },
                        {
                            id:2,
                            position : {
                                x: -0.5 ,
                                y: 0.5 ,
                                z: -3
                            }
				        }
                    ]
                );
			}
        }
    };
    return game;
});


