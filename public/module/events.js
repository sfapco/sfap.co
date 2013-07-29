

/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')
  , $ = document.querySelectorAll


/**
 * `Events` constructor
 *
 * @api public
 * @param {Object} `root`
 */

module.exports = Events;
function Events (opts) {
	if (!(this instanceof Events)) return new Events(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	this.ui = app.ui.TopcoatElement(opts.root);
}

// inherit from `EventEmitter
Events.prototype.__proto__ = EventEmitter.prototype;
