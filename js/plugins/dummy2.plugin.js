define(function() {
	function dummyPlugin2 (){
		window.addEventListener('loonyball_init', function (event) {
			console.log('Dummy plugin hook2 event init !!');
		});
	}
	return dummyPlugin2;
});
