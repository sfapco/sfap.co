

/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')
  , $ = document.querySelectorAll


/**
 * `Partners` constructor
 *
 * @api public
 * @param {Object} `root`
 */

module.exports = Partners;
function Partners (opts) {
	if (!(this instanceof Partners)) return new Partners(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	this.ui = app.ui.TopcoatElement(opts.root);
}

// inherit from `EventEmitter
Partners.prototype.__proto__ = EventEmitter.prototype;
