

/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')
  , $ = document.querySelectorAll


/**
 * `Home` constructor
 *
 * @api public
 * @param {Object} `root`
 */

module.exports = Home;
function Home (opts) {
	if (!(this instanceof Home)) return new Home(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	this.ui = app.ui.TopcoatElement(opts.root);
	this.drawLogo();
}

// inherit from `EventEmitter
Home.prototype.__proto__ = EventEmitter.prototype;


/**
 * Draws the main logo
 *
 * @api public
 */

Home.prototype.drawLogo = function () {
	var logo = app.ui.TopcoatElement()
	logo.attr('id', 'main-logo')
	logo.html('SUMMIT\n For A Purpose')
	this.ui.append(logo.el);
};


/**
 * Draws the event teaser
 *
 * @api public
 */

Home.prototype.drawTeaser = function () {
	
};