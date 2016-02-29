define(function () {
    function user () {
        this.id = '';
        this.owner = {};
    }
    user.prototype = {
        init: function (m) {
            var d = JSON.parse(m);
            console.log('user init..');
            this.id = d.id;
        },
        sync: function () {
            //console.log('user synchronized');
        },
        add: function () {
            //console.log('user added');
        },
        delete: function () {
            //console.log('user deleted');
        },
        setOwner: function (socket) {
            this.owner = socket;
        }
    };
    return user;
});
