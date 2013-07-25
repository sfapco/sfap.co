
/**
 * Module dependencies
 */

var connect = require('connect')
  , troute = require('troute')
  , parseUrl = require('connect/lib/utils').parseUrl.bind(require('connect/lib/utils'))
  , send = require('send')
  , debug = require('debug')('sfap')
  , path = require('path')


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
sfap.debug = debug



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
 * @param {String} dir
 * @return {String}
 */

sfap.dir = function (dir) {
	return path.resolve(sfap.root(), dir);
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


	return app;
}