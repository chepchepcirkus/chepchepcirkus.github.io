define(['./abstractController'], function (controller) {
    var routerGame = new controller('game');

    /**
     * Init client object
     * @param config
     */
    controller.prototype.launchClient = function (config) {};

    /**
     * Launch game
     *
     * @param config
     * @param user
     * @param entity
     * @param events
     */
    controller.prototype.render = function (config, user, entity, events) {
        var game = this.getModel('game');
        game.init(config, user, entity, events).start(config);
    };

    return routerGame;
});
