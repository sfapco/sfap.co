
/**
 * Module dependencies
 */

var sfap = require('../')



/**
 * maps route to an initialized `app`
 */

module.exports = function routes (app, config) {
	
	// ensure object for the `config` argument
	config = ('object' === typeof config)? config : {};

	app.use(function (req, res, next) {
		
		res.json = function (code, data) {
			code = ('number' === typeof code)? code : 200;
			data = ('object' === typeof code)? code : data;
			res.writeHead(code, {
				'Content-Type': 'application/json'
			});

			res.end(JSON.stringify(data));
		};

		next();
	});


	/**
	 * module route
	 */

	app.get('/module/:path', function (req, res) {
		var view = '/module/'+ req.params.path +'.js'
		if (sfap.isLocalFile(view)) {
			sfap.streamFile(view, config, req, res)
				.type('application/js');
		} else {
			res.json(404, '');
		}
	});


	/**
	 * view route
	 */

	app.get('/view/:path', function (req, res) {
		var view = '/view/'+ req.params.path +'.dot'
		if (sfap.isLocalFile(view)) {
			sfap.streamFile(view, config, req, res)
				.type('text/html');
		} else {
			res.json(404, {
				status: false,
				error: "View not found"
			})
		}
	});


	/**
	 * catch all page route
	 */

	app.get('^[/]?:root?[/]+(.*)?', function (req, res) {
		var file = sfap.parseUrl(req).pathname

		if (!sfap.isLocalFile(file)) {
			file = '/index.html';
		}
		
		return sfap.streamFile(file, config, req, res);
	});
};