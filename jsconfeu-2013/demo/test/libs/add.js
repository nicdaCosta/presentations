define([
	'intern!tdd',
	'intern/chai!assert',
	'src/soundsync'
], function (tdd, assert) {

		tdd.suite('awesome', function () {
			test('#checkType', function () {

				var _awesome = window.awesome;
				assert.equal( typeof _awesome === 'function' , true);

			});
		});
		
});