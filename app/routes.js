
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


	/**
	 * Home page route
	 */

	app.get('[/home|/index|/]+[\.html]?', function (req, res) {
		var file = '/index.html'
		  , stream = sfap.send(req, file)
				.root(sfap.dir(config.publicDirectory || 'public'))
				.maxage(config.maxage || 0)
				.index(config.indexFile || 'index.html')

		console.log(file)


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
	});
};