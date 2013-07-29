

/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')
  , $ = document.querySelectorAll


/**
 * `Team` constructor
 *
 * @api public
 * @param {Object} `root`
 */

module.exports = Team;
function Team (opts) {
	if (!(this instanceof Team)) return new Team(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	this.ui = app.ui.TopcoatElement(opts.root);
}

// inherit from `EventEmitter
Team.prototype.__proto__ = EventEmitter.prototype;
