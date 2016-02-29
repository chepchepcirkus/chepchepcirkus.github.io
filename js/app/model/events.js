define(function() {
    function events () {
        this.keys = {up:0,down:0,left:0,right:0};
        this.dataChanged = false;
        window.addEventListener('keydown',function(event){
            if (event.keyCode == 90){
                this.keys.up = 1;
                this.dataChanged = true;
            }
            if (event.keyCode == 83){
                this.keys.down = 1;
                this.dataChanged = true;
            }
            if (event.keyCode == 81){
                this.keys.left = 1;
                this.dataChanged = true;
            }
            if (event.keyCode == 68){
                this.keys.right = 1;
                this.dataChanged = true;
            }
        }.bind(this));

        window.addEventListener('keyup',function(event){
            if (event.keyCode == 90){
                this.keys.up = 0;
            }
            if (event.keyCode == 83){
                this.keys.down = 0;
            }
            if (event.keyCode == 81){
                this.keys.left = 0;
            }
            if (event.keyCode == 68){
                this.keys.right = 0;
            }
            if(!this.keys.up && !this.keys.down && !this.keys.right && !this.keys.left) {
                this.dataChanged = false;
            }
        }.bind(this));
    }

    events.prototype = {
        hasDataChanged : function () {
            return this.dataChanged;
        }
    };
    return events;
});