define(function () {
    function controller(id) {
        this.id = id;
        this.model = [];
    }

    controller.prototype = {
        setModel: function (name, model) {
            this.model[name] = model;
        },
        getModel: function (name) {
            return this.model[name];
        }
    };

    return controller;
});
