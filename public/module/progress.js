
/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter


/**
 * Expose `Progress`
 */

module.exports = Progress;
function Progress () {
	if (!(this instanceof Progress)) return new Progress();
	EventEmitter.call(this);
	this._percent = 0;
	this._started = false;
	this._finished = false;
	this.startedOn = null;
	this.finishedOn = null;

	this.on('end', function () {
		this._started = false;
		this._finished = true;
	});
}

// inherit from `EventEmitter`
Progress.prototype.__proto__ = EventEmitter.prototype;


/**
 * Updates percent with data
 *
 * @api public
 * @param {Number} `percent`
 * @param {Object} `data` - optional
 */

Progress.prototype.percent = function (percent, data) {
	this._percent = percent;
	this.emit('percent', percent, data);
	return this;
};


/**
 * Checks if progress has started
 *
 * @api public
 */

Progress.prototype.isStarted = function () {
	return this._started;
};


/**
 * Checks if progress has finished
 *
 * @api public
 */

Progress.prototype.isFinished = function () {
	return !this._started && this._finished;
};


/**
 * Starts progress emitter
 *
 * @api public
 * @param {Object} `data`
 */

Progress.prototype.start = function (data) {
	if (this.isStarted()) return this;
	this._started = true;
	this._finished = false;
	this.finishedOn = null;
	this.emit('start', (this.startedOn = new Date));
	return this;
};


/**
 * Ends progress emitter
 *
 * @api public
 * @param {Object} `data`
 */

Progress.prototype.end = function (fn) {
	if (this.isFinished()) return this;
	var self = this
	fn = 'function' === typeof fn ? fn : app.noop;
	if (1 === (fn).length) app.defer(fn.bind(null, done));
	else app.wait(10, done) && app.defer(fn);
	function done () { self.emit('end', (self.finishedOn = new Date)) }
	return this;
};


/**
 * Display loader
 *
 * @api public
 * @param {Element} `root`
 * @param {Object} `opts`
 */

Progress.prototype.displayLoader = function (root, opts) {
	var loader = app.ui.TopcoatElement().addClass('progress-graphic-overlay')
	loader.appendTo(root);
	if (opts && opts.child) loader.append(opts.child);
	this.on('end', function () { loader.remove(); });
	return this;
};
