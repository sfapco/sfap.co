!function (exports, app) {

/**
 * Module dependencies
 */

var app = exports.app = require('sfap')('sfap')
  , $ = document.querySelectorAll.bind(document)
  , imageLoader = app.assets.preloader.images
  , body = document.body
  , html = document.getElementsByTagName('html')[0]
  , rootNode

app.debug('');

app.page = {};
app.noop = function () {};

app.module('progress', function (err, progress) {
	if (err) throw err;
	var offset = 50
	 , y = (html.clientHeight/2) - offset
	 , x = (html.clientWidth/2)

	var prog = progress().start().displayLoader(body, {
		child: (el = app.$T(app.dom('<img src="/img/progress-ani.gif" />')).css({ top: y, left: x }).el)
	});

	parent = el.parentNode;

	parent.appendChild(
		app.$T(app.dom('<span class="animated flash">loading</span>'))
			.css({
				top: y,
				left: x
			})
			.el
	);

	imageLoader.add('/img/nyc-pan.png');
	imageLoader.end(function () {
		prog.end(function (done) {
			app.$T(parent).addClass('animated fadeOutRight'); 
			app.defer(function () { 
				app.wait(310, function () { app.defer(done); });
			});
			app.wait(350, function () {
				app.emit('assets loaded');
				app.assetsLoaded = true;
			});
		});
	});
});

app.ready(function () {
	app.debug('dom ready');
	

	// set global root node
	rootNode = $('#sfap')[0];

	app.use(function (req, next) {
		app.module('module', function (err, Module) {
			app.Module = Module;
			next();
		});
	});

	app.use(function (req, next) { viewport(next); })
		.use(function (req, next) { navigation(next); })
		.use(function (req, next) { container(next); })
		.use(function (req, next) { footer(next); })

	app.match('.*', function (req) {
		var pages = ['home', 'events', 'partners', 'team']
		  , firstPage = pages[0]
		  , lastPage = pages[pages.length -1]
		  , nextPage = pages[0]
		  , hash = app.hash.get()
		  , activePage = null
		  // , activePage = !!~pages.indexOf(hash)? hash : null
		  , previousPage = null

		!function next () {
			if (pages.length) {
				var pageName = pages.shift()
				app.view(pageName, function (err, view) {
					if (err) throw err;

					app.module(pageName, function (err, page) {
						if (err) throw err;
						var divider;
						var root = app.$T(app.dom(view));
						app.page = page({root: root.el});
						app.container.append(app.page.ui.el);

						if (pages.length) {
							divider = app.$T(app.dom('<span class="page-divider"></span>')).appendTo(app.container.el);
						}

						function resetLinks () {
							app.links.items.forEach(function (item) {
								var id = item.el.querySelector('a').getAttribute('href').replace('#','')
								if (id !== root.el.id) {
									item.removeClass('animated').removeClass('wiggle').css('font-weight', 'normal')
								}
							});
						}

						function setActive () {
							app.links.items.forEach(function (item) {
								var id = item.el.querySelector('a').getAttribute('href').replace('#','')
								if (id === root.el.id) {
									item.addClass('animated wiggle').css('font-weight', 'bold')
								}
							});
						}

						app.scroll([root.el], { offsetOut: 20, offsetIn: -100 })
							.on('scrollIn', function () {
								resetLinks();
								setActive();
							})
							.on('scrollOut', function () {
								resetLinks();
								setActive();
							})
							.on('scrollInOut', function () {
								resetLinks();
								setActive();
							});

						next();
					});
				});
			} else {
				if (hash) {
					app.hash.set('')
					app.hash.set(hash);
				}
			}
		}();
	});


	app.use(function (req) {
		fourOhFour(req);
	});


}).ready(function () {
	app.init(app.location.href);
});


/**
 * Constructs the viewport
 */

function viewport (next) {
	app.module('viewport', function (err, viewport) {
		if (err) throw err;
		app.viewport = viewport;
		
		app.viewport.on('resize', function (v) {
			app.$T(rootNode).css('min-height', v.height)
		});

		app.defer(app.viewport.emit.bind(app.viewport, 'resize', app.viewport));
		app.wait(1, next);
	});
}

/**
 * Constructs the navigation bar
 */

function navigation (next) {
	app.module('navigation', function (err, navigation) {
		if (err) throw err;
		var nav = app.nav = navigation({id: 'main-nav'})

		nav.init({ root: rootNode });
		 
		var links = app.links = app.ui.List().addClass('nav-links-container').addClass('clearfix')
	  		.add(makeWiggle(app.ui.ListItem().link('Home', '#home')))
	  		.add(makeWiggle(app.ui.ListItem().link('Events', '#events')))
	  		//.add(makeWiggle(app.ui.ListItem().link('Technology', '/technology')))
	  		.add(makeWiggle(app.ui.ListItem().link('Partners', '#partners')))
	  		.add(makeWiggle(app.ui.ListItem().link('Our Team', '#team')))

	 	function makeWiggle (li) {
	 		return li.on('mouseover', function () { 
				if (!this.hasClass('animated') && !this.hasClass('wiggle')) {
					this.addClass('animated').addClass('wiggle').css('font-weight', 'bold');
				}
			}).on('mouseout', function () { 
				if (this.hasClass('animated') && this.hasClass('wiggle')) {
					this.removeClass('animated').removeClass('wiggle').css('font-weight', 'normal');
				}
			});
	 	}

	  links.container.addClass('clearfix');

		nav.ui.add(links).addClass('nav-links').css({
	  	right: '0px'
	  })

		if ('function' === typeof next) next();
	});
}


/**
 * Constructs the main container
 */

function container (next) {
	app.module('container', function (err, container) {
		if (err) throw err;
		var con = app.container = container({id: 'main-container'})

		con.init({
			root: rootNode
		});

		con.ui.css('visibility', 'hidden');

		if (app.assetsLoaded) {
			show();
		} else {
			app.on('assets loaded', show);
		}

		function show () {
			return con.ui.addClass('animated fadeInRight').css('visibility', 'visible')
		}

		if ('function' === typeof next) next();
	});
}


/**
 * Constructs the footer
 */

function footer (next) {
	app.module('footer', function (err, footer) {
		if (err) throw err;
		var footer = app.footer = footer({id: 'main-footer'})

		footer.init({
			root: rootNode
		})

		if ('function' === typeof next) next();
	});
}


/**
 * Shows a 404 page
 */

function fourOhFour (req) {
	app.view('404', {url: req.url}, function (err, view) {
		console.log(view)
	});
}



}(this, require('sfap')());