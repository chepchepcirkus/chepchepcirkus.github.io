define(['lib/jquery','lib/virtualjoystick'], function() {
    function events () {
        this.keys = {up:0,down:0,left:0,right:0, rotate:{right:0,left:0}};
        this.defaultOrientedPosDefined = false;
        this.defaultOrientedPos = {gamma:0,beta:0,alpha:0};
        this.orientedDiff = 5;
        this.orientedMap = {gamma:0,beta:0,alpha:0};
        this.dataChanged = false;
        this.joystickLeft = '';
        this.joystickRight = '';
        jQuery('.controller-type').on('click', function(el) {
			this.controller = el.target.id;
			jQuery('.controller').each(function(el) {
				el.hide();
			});
			jQuery('.controller-type').toggle();	
			jQuery('#shadow').hide();
			CHEPK.layout.flushMessages();
			this.launchEvent();
		}.bind(this));
    }

    events.prototype = {
        hasDataChanged : function () {
            return this.dataChanged;
        },
        launchEvent : function () {
			switch(this.controller) {
				case 'keyboard' :
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
						if (event.keyCode == 39){
							this.keys.rotate.right = 1;
							this.dataChanged = true;
						}
						if (event.keyCode == 37){
							this.keys.rotate.left = 1;
							this.dataChanged = true;
						}
						if (event.keyCode === 32) {
							CHEPK.game.loonyball.switchView();
						}
					}.bind(this));
					
					window.addEventListener('keyup',function(event) {
						if (event.keyCode == 90) {
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
						if (event.keyCode == 37){
							this.keys.rotate.left = 0;
						}
						if (event.keyCode == 39){
							this.keys.rotate.right = 0;
						}
						if(
							!this.keys.up
							&& !this.keys.down
							&& !this.keys.right
							&& !this.keys.left
							&& !this.keys.rotate.left
							&& !this.keys.rotate.right
						) {
							this.dataChanged = false;
						}
					}.bind(this));
				break;
				
				case 'joystick' :

					this.joystickRight	= new VirtualJoystick({
						strokeStyle	: 'orange',
						limitStickTravel: true,
						stickRadius	: 120,
						mouseSupport : true 	
					});
					this.joystickRight.addEventListener('touchStartValidation', function(event){
						var touch	= event.changedTouches[0];
						if( touch.pageX < window.innerWidth/2 )	return false;
						return true
					});					this.joystickLeft	= new VirtualJoystick({
						//container	: document.getElementById('left'),
						strokeStyle	: 'cyan',
						limitStickTravel: true,
						stickRadius	: 120,
						mouseSupport : true		
					});
					this.joystickLeft.addEventListener('touchStartValidation', function(event){
						var touch	= event.changedTouches[0];
						if( touch.pageX >= window.innerWidth/2 )	return false;
						return true
					});

				break;
				
				default :
					throw 'CHEPK.game.controller is not defined';
				break;
			}
		}
    };
    return events;
});
