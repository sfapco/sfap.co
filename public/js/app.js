!function (exports, app) {

/**
 * Module dependencies
 */

var app = exports.app = require('sfap')('sfap')
  , $ = document.querySelectorAll.bind(document)
  , rootNode

app.debug('');

app.ready(function () {
	app.debug('dom ready');
	

	// set global root node
	rootNode = $('#sfap')[0];


	app.match('/[home|index]?', function (req) {
		navigation();
	});

	app.match('/user/:id/:subid/:id3/:otherid', function (req) {
		console.log(arguments)
	});


	app.use(function (req) {
		fourOhFour(req);
	});


}).ready(function () {
	app.init(app.location.href);
});



/**
 * Constructs the navigation bar
 */

function navigation () {
	app.module('navigation', function (err, navigation) {
		if (err) throw err;
		var nav = app.nav = navigation.Navigation({id: 'main-nav'})

		nav.init({
			root: rootNode
		});

		nav.ui.title("SFAP")
			.align('left')

		nav.ui
			.height(100)
	});
}




/**
 * Shows a 404 page
 */

function fourOhFour (req) {
	app.view('404', {url: req.url}, function (err, view) {
		console.log(view)
	});
}



}(this, require('sfap')());