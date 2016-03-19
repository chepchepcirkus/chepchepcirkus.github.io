/*
 * @var messages : different type of message
 * 
 * <div class="error">Error Alert</div>
 * <div class="warning">Warning Alert</div>
 * <div class="success">Success Alert</div>
 * 
 * 
 */ 
define(['lib/jquery'], function () {
    function layout() {
		this.events = {};
		if(CHEPK.config == undefined) {
			 throw 'CHEPK.config is not loaded';
		}
        this.canvas = CHEPK.config.layout.canvas;
        this.messages = CHEPK.config.layout.messages;
    }

    layout.prototype = {
        init : function (events) {
			this.events = new events();
            var event = new CustomEvent(
				'layout_init', 
				{
					detail: {
						description:'layout : Init function',
						data:{
							layout:this
							}
						}
				}
			);
            window.dispatchEvent(event);
        },
        
        flushMessages : function() {
			jQuery('#' + this.messages).find('div').each(function(index, el) {
				jQuery(el).remove();
			});
		}
    };

    return layout;
});
