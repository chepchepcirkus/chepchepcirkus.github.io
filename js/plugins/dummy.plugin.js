define(function() {
	function dummyPlugin (){
		window.addEventListener('loonyball_init', function (event) {
			console.log('Dummy plugin hook event init !!');
		});
	}
	return dummyPlugin;
});
