define(function() {
	function loaderPlugin (){
		window.addEventListener('layout_init', function (event) {
			event.detail.data.layout.loader = jQuery('#loader');
			event.detail.data.layout.shadow = jQuery('#shadow');
			
			jQuery('#loader').show();
		});
		window.addEventListener('loonyball_after_render_scene', function (event) {
			CHEPK.layout.shadow.css({'backgroundColor':'#666', 'opacity':'0.5'});
			CHEPK.layout.loader.hide();
			jQuery('.controller-type').toggle();
		});
	}
	return loaderPlugin;
});
