define(function () {
    function client(user) {
        this.socket = {};
        this.scope = [];
        this.user = user;
    }

    client.prototype = {
        init : function () {
            this.scope = CHEPK.config.scope;
            this.create();
        },
        create : function () {
            //SockJS library is loaded by http in index.html

            if(!CHEPK.config.simulation) {
				this.socket = new SockJS(CHEPK.config.socket_url);
			} else {
				this.socket = {};
			}
            
            this.user.setOwner(this.socket);

            this.socket.onopen = function (m) {
                console.log('open');
            };

            this.socket.onmessage = function (m) {
                console.log('message', m.data);
                var jsonData = JSON.parse(m.data);

                /**
                 * Search existing function in custom scope
                 */
                var fn = false;
                if (typeof jsonData.f != "undefined") {
                    fn = this.getFunction(jsonData.f)
                }
                if (fn) {
                    fn[0].apply(fn[1], [JSON.stringify(jsonData.d)]);
                }
                else {
                    console.log('function : "' + jsonData.f + '" doesn\'t exists...');
                }
            }.bind(this);

            this.socket.onclose = function () {
                console.log('close');
            };
        },

        close: function () {
            this.socket.close();
        },

        /**
         * Get function from custom scope
         *
         * @param fname
         * @returns {entity.funcToApply, entity}
         *          or
         *          {mainFuncToApply, entity}
         */
        getFunction: function (fname) {
            var d = fname.split('.');
            for (var i in this.scope) {
                if (typeof this.scope[i][d[0]] === "object") {
                    if (d.length > 1) {
                        if (typeof this.scope[i][d[0]][d[1]] === "function") {
                            return [this.scope[i][d[0]][d[1]], this.scope[i][d[0]]];
                        }
                        return false;
                    }
                    return [this.scope[i][d[0]]];
                }
            }
        }
    };

    return client;
});
