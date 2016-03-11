define(['lib/jquery'], function () {
    function layout() {
		this.events = {};
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
