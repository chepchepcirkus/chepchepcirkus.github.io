define(function (require) {
    try{
        var game = require('./model/game'),
            user = require('./model/user'),
            config = require('./config'),
            entity = require('./model/entity/loonyball'),
            events = require('./model/events'),
            routerGame = require('./controller/gameController');

        user = new user();
        game = new game();

        //Load Game Object
        routerGame.setModel('game', game);

        //Launch game
        routerGame.render(config, user, entity, events);

        //Init client
        routerGame.launchClient(config);
    } catch(exception) {
        alert(exception);
    }
});
