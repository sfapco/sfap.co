
/**
 * Module dependencies
 */

var connect = require('connect')
  , request = require('request')
  , troute = require('troute')
  , parseUrl = require('connect/lib/utils').parseUrl.bind(require('connect/lib/utils'))
  , send = require('send')
  , debug = require('debug')('sfap')
  , path = require('path')
  , mime = require('mime')
  , fs = require('fs')


var get = troute.bind(null, 'GET')
  , post = troute.bind(null, 'POST')
  , put = troute.bind(null, 'PUT')
  , del = troute.bind(null, 'DELETE')
  , head = troute.bind(null, 'HEAD')
  , options = troute.bind(null, 'OPTIONS')


/**
 * sfap onstants
 */

const DEFAULT_SERVER_PORT = 8888;
sfap.DEFAULT_SERVER_PORT = DEFAULT_SERVER_PORT;



/**
 * Expose `sfap`
 */

module.exports = sfap;


/**
 * `sfap` exports
 */

sfap.send = send;
sfap.parseUrl = parseUrl;
sfap.debug = debug;
sfap.mime = mime;



/**
 * Returns the root directory of the `sfap` application
 *
 * @api public
 * @return {String}
 */

sfap.root = function () {
	return path.resolve(__dirname, '..');
};


/**
 * Returns the path to a given directory
 * in the `sfap` application directory
 *
 * @api public
 * @param {String} `dir`
 * @return {String}
 */

sfap.dir = function (dir) {
	return path.resolve(sfap.root(), dir);
};


/**
 * Check if a given file is an actual file
 *
 * @api public
 * @param {String} `file`
 * @return {Boolean}
 */

sfap.isFile = function (file) {
	try {
		fs.readFileSync(file);
		return true;
	} catch (e) {
		return false;
	}
};


/**
 * Checks if a given file path is
 * an actual local file in the `sfap`
 * application directory
 *
 * @api public
 * @param {String} `file`
 */

sfap.isLocalFile = function (file) {
	return sfap.isFile(sfap.dir('public') + file);
};


/**
 * Streams a file to the provided `Request` stream
 *
 * @api public
 * @param {String} `file`
 * @param {Object} `config`
 * @param {Object} `req`
 * @param {Object} `res`
 */

sfap.streamFile = function (file, config, req, res) {
	var stream = sfap.send(req, file)
			.root(sfap.dir(config.publicDirectory || 'public'))
			.maxage(config.maxage || 0)
			.index(config.indexFile || 'index.html')

		stream.on('error', function (err) {
			sfap.debug('home route: error: %s', err.toString());
			res.writeHead(err.status, {
				'Content-Type': 'text/plain'
			});

			switch (err.code) {
				case 'ENOENT':
					res.end("oops, file not found dude");
					break;

				default:
					res.end("ugh, something went wrong!")
			}
		});

		// never expose directories
		stream.on('directory', function () {
			// `403` for forbidden
			res.writeHead(403, {'Content-Type': 'text/plain'});
			res.end("sorry, this is forbidden");
		});


		// pipe stream back to `res` stream
		stream.pipe(res);
		return stream;
};

/**
 * `sfap`
 *
 * @api public
 * @param {Object} `config`
 * @return {Object}
 */

function sfap (config) {
	if ('object' !== typeof config) throw new TypeError("expecting object when calling `sfap(config)`");

	// ensure `.server` object
	config.server = 'object' === typeof config.server? config.server : {};


	var app = initialize(connect(), config)
	  , port = config.server.port || DEFAULT_SERVER_PORT

	// attach `config` object to `app`
	app.config = config;

	return app;
}


/**
 * Initializes a `connect` application
 * with middle ware filters
 *
 * @api private
 * @param {Object} `app`
 * @return {Object}
 */

function initialize (app, config) {
	// expose 'X-Response-Time' header in response
	app.use(connect.responseTime());
	// compress javascript, text, and json
	app.use(connect.compress());
	// parse json into the `req.body` variable
	// or multipart posts or url encoded form
	// data
	app.use(connect.bodyParser());
	// set a request timeout if provided in `config`
	if (config && 'number' === typeof config.timeout) 
		app.use(connect.timeout(config.timeout));
	// parse cookies into the `req.cookies` variable
	app.use(connect.cookieParser());
	// prevent faulty request for a `favicon.ico` file
	app.use(connect.favicon(config && config.favicon || undefined));
	// pareses query string data into the `req.query` variable
	app.use(connect.query());

	// if a `.dev` flag is provided 
	// then use 'dev' logging
	if (config && config.dev) {
		// development logging
		app.use(connect.logger('dev'));
	} else {
		// basic logging
		app.use(connect.logger());
	}

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

	// proxy `troute` to method `route`
	app.route = troute;

	app.get = function (route, fn) {
		app.use(get(route, fn));
		return this;
	};

	app.post = function (route, fn) {
			app.use(post(route, fn));
			return this;
	};

	app.put = function (route, fn) {
		app.use(put(route, fn));
		return this;
	};

	app.del = function (route, fn) {
		app.use(del(route, fn));
		return this;
	};

	app.head = function (route, fn) {
			app.use(head(route, fn));
			return this;
	};

	app.options = function (route, fn) {
		app.use(options(route, fn));
		return this;
	};

	// api object
	app.api = {
		host: config.api.host, 
		port: config.api.port
	};
	
	app.api.url = function (append) {
		var url = this.host +':'+ this.port
		if ('string' === typeof append) url += '/'+ append;
		return url;
	};

	app.api.get = function (path, fn) {
		return request.get(this.url(path), fn);
	};


	return app;
}