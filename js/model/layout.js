define(['lib/jquery'], function () {
    function layout() {
		var $ = jQuery.noConflict();
		this.events = {};
        this.canvas = $(CHEPK.config.layout.canvas);
        this.message = $(CHEPK.config.layout.messages);
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
        }
    };

    return layout;
});
