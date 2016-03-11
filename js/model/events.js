define(['lib/jquery'], function() {
    function events () {
        this.keys = {up:0,down:0,left:0,right:0};
        this.defaultOrientedPosDefined = false;
        this.defaultOrientedPos = {gamma:0,beta:0,alpha:0};
        this.orientedDiff = 5;
        this.orientedMap = {gamma:0,beta:0,alpha:0};
        this.dataChanged = false;
        
        jQuery('#start').on('click', function() {
			this.defaultOrientedPosDefined = true;
			this.defaultOrientedPos.alpha = this.orientedMap.alpha;
			this.defaultOrientedPos.beta = this.orientedMap.beta;
			this.defaultOrientedPos.gamma = this.orientedMap.gamma;
			jQuery('#start').hide();
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
				if(!this.keys.up && !this.keys.down && !this.keys.right && !this.keys.left) {
					this.dataChanged = false;
				}
			}.bind(this));
			if (window.DeviceOrientationEvent) {
				console.log("DeviceOrientation is supported");
				// Listen for the event and handle DeviceOrientationEvent object
				jQuery(window).on('touchstart', function(e) {
						this.dataChanged = true;
						e.preventDefault();
				}.bind(this));
				jQuery(window).on('touchend', function(e) {
						this.dataChanged = false;
						e.preventDefault();
				}.bind(this));
				window.addEventListener('deviceorientation', function(eventOrientData) {
					// Debug Control
					jQuery('#info_alpha').html(this.defaultOrientedPos.alpha + '<br />' + this.orientedMap.alpha);
					jQuery('#info_beta').html(this.defaultOrientedPos.beta + '<br />' + this.orientedMap.beta);
					jQuery('#info_gamma').html(this.defaultOrientedPos.gamma + '<br />' + this.orientedMap.gamma);
					
					this.orientedMap.alpha = eventOrientData.alpha;
					this.orientedMap.beta = eventOrientData.beta;
					this.orientedMap.gamma = eventOrientData.gamma;
					
					if(this.defaultOrientedPosDefined) {
						if (this.orientedMap.beta < (this.defaultOrientedPos.beta - this.orientedDiff)){
							this.keys.up = 1;
							this.keys.down = 0;
						}
						if (this.orientedMap.beta > (this.defaultOrientedPos.beta - this.orientedDiff) 
						&& this.orientedMap.beta < (this.defaultOrientedPos.beta + this.orientedDiff)){
							this.keys.up = 0;
							this.keys.down = 0;
						}
						if (this.orientedMap.beta > (this.defaultOrientedPos.beta + this.orientedDiff)){
							this.keys.down = 1;
							this.keys.up = 0;
						}
						
						if (this.orientedMap.gamma < (this.defaultOrientedPos.gamma - this.orientedDiff)){
							this.keys.left = 1;
							this.keys.right = 0;
							
						}
						if (this.orientedMap.gamma > (this.defaultOrientedPos.gamma + this.orientedDiff)){
							this.keys.right = 1;
							this.keys.left = 0;
						}
						if (this.orientedMap.gamma > (this.defaultOrientedPos.gamma - this.orientedDiff) 
						&& this.orientedMap.gamma < (this.defaultOrientedPos.gamma + this.orientedDiff)){
							this.keys.right = 0;
							this.keys.left = 0;
						}
						if(!this.keys.up && !this.keys.down && !this.keys.right && !this.keys.left) {
							this.dataChanged = false;
						}
					}
					
					jQuery('#info_up').html(this.keys.up);
					jQuery('#info_down').html(this.keys.down);
					jQuery('#info_left').html(this.keys.left);
					jQuery('#info_right').html(this.keys.right);
					jQuery('#data_changed').html(((this.dataChanged)?1:0));
					
				}.bind(this), false);
			}
		}
    };
    return events;
});
