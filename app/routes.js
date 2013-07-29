
/**
 * Module dependencies
 */

var sfap = require('../')
  , path = require('path')
  , less = require('less')
  , fs = require('fs')



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

		
		res.css = function (css) {
			css = css || '';
			res.writeHead(200, {
				'Content-Type': 'text/css'
			});
			res.end(css);
		};

		next();
	});


	/**
	 * Handle css for compile less on the fly
	 */

	app.get('(.*)\.css', function (req, res, next) {
		var file = req.params[0]
		if (sfap.isLocalFile(file +'.css')) {
			sfap.streamFile(file +'.css', config, req, res)
				.type('text/css');
		} else if (sfap.isLocalFile(file +'.less')) {
			file += '.less';
			var buf = fs.readFileSync(sfap.dir('public') + file);
			less.render(buf.toString(), function (err, result) {
				if (err) res.end(500, '');
				else res.css(result);
			});
		} else {
			res.end(404, '');
		}
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


	app.get('/api/:path', function (req, res) {
		app.api.get(req.params.path, function (err, req, data) {
			if (err) throw err;
			res.json(200, JSON.parse(data));
		});
	});

	app.post('/api/:path', function (req, res) {
		app.api.post(req.params.path, req.body, function (err, req, data) {
			if (err) throw err;
			res.json(200, JSON.parse(data));
		});
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