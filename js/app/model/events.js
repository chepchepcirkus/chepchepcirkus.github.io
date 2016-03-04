define(['jquery'], function($) {
    function events () {
        this.keys = {up:0,down:0,left:0,right:0};
        this.defaultOrientedPosDefined = false;
        this.defaultOrientedPos = {gamma:0,beta:0,alpha:0};
        this.orientedDiff = 5;
        this.orientedMap = {gamma:0,beta:0,alpha:0};
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
			
			window.addEventListener('deviceorientation', function(eventOrientData) {
				// Debug Control
				$('#info_alpha').html(this.defaultOrientedPos.alpha + ' || ' + this.orientedMap.alpha);
				$('#info_beta').html(this.defaultOrientedPos.beta + ' || ' + this.orientedMap.beta);
				$('#info_gamma').html(this.defaultOrientedPos.gamma + ' || ' + this.orientedMap.gamma);
				
				this.orientedMap.alpha = eventOrientData.alpha;
				this.orientedMap.beta = eventOrientData.beta;
				this.orientedMap.gamma = eventOrientData.gamma;
				
				if(this.defaultOrientedPosDefined) {
					if (this.orientedMap.beta < (this.defaultOrientedPos.beta - this.orientedDiff)){
						this.keys.up = 1;
						this.keys.down = 0;
						this.dataChanged = true;
					}
					if (this.orientedMap.beta > (this.defaultOrientedPos.beta - this.orientedDiff) 
					&& this.orientedMap.beta < (this.defaultOrientedPos.beta + this.orientedDiff)){
						this.keys.up = 0;
						this.keys.down = 0;
					}
					if (this.orientedMap.beta > (this.defaultOrientedPos.beta + this.orientedDiff)){
						this.keys.down = 1;
						this.keys.up = 0;
						this.dataChanged = true;
					}
					
					if (this.orientedMap.gamma < (this.defaultOrientedPos.gamma - this.orientedDiff)){
						this.keys.left = 1;
						this.keys.right = 0;
						this.dataChanged = true;
					}
					if (this.orientedMap.gamma > (this.defaultOrientedPos.gamma + this.orientedDiff)){
						this.keys.right = 1;
						this.keys.left = 0;
						this.dataChanged = true;
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
				
				$('#info_up').html(this.keys.up);
				$('#info_down').html(this.keys.down);
				$('#info_left').html(this.keys.left);
				$('#info_right').html(this.keys.right);
				$('#data_changed').html(((this.dataChanged)?1:0));
				
			}.bind(this), false);
			
			$('#start').on('click', function() {
				this.defaultOrientedPosDefined = true;
				this.defaultOrientedPos.alpha = this.orientedMap.alpha;
				this.defaultOrientedPos.beta = this.orientedMap.beta;
				this.defaultOrientedPos.gamma = this.orientedMap.gamma;
				$('#start').hide();
				$('#shadow').hide();
			}.bind(this));
		}
    }

    events.prototype = {
        hasDataChanged : function () {
            return this.dataChanged;
        }
    };
    
    
    return events;
});
