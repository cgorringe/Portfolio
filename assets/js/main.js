/*
	Astral by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var settings = {

		// Speed to resize panel.
			resizeSpeed: 600,

		// Speed to fade in/out.
			fadeSpeed: 300,

		// Size factor.
			sizeFactor: 11.5,

		// Minimum point size.
			sizeMin: 15,

		// Maximum point size.
			sizeMax: 20

	};

	var $window = $(window);

	$(document).ready(function() {  // this sped up initial load [CG]

		skel
			.breakpoints({
				desktop: '(min-width: 737px)',
				mobile: '(max-width: 736px)'
			})
			.viewport({
				breakpoints: {
					desktop: {
						width: 1080,
						scalable: false
					}
				}
			})
			.on('+desktop', function() {

				var	$body = $('body'),
					$main = $('#main'),
					$panels = $main.find('.panel'),
					$hbw = $('html,body,window'),
					$footer = $('#footer'),
					$wrapper = $('#wrapper'),
					$nav = $('#nav'), $nav_links = $nav.find('a'),
					$jumplinks = $('.jumplink'),
					$form = $('form'),
					panels = [],
					activePanelId = null,
					firstPanelId = null,
					isLocked = false,
					hash = window.location.hash.substring(1);

				if (skel.vars.touch) {

					settings.fadeSpeed = 0;
					settings.resizeSpeed = 0;
					$nav_links.find('span').remove();

				}

				// Body.
					$body._resize = function() {
						var factor = ($window.width() * $window.height()) / (1440 * 900);
						$body.css('font-size', Math.min(Math.max(Math.floor(factor * settings.sizeFactor), settings.sizeMin), settings.sizeMax) + 'pt');
						$main.height(panels[activePanelId].outerHeight());
						$body._reposition();
					};

					$body._reposition = function() {
						if (skel.vars.touch && (window.orientation == 0 || window.orientation == 180))
							$wrapper.css('padding-top', Math.max((($window.height() - (panels[activePanelId].outerHeight() + $footer.outerHeight())) / 2) - $nav.height(), 30) + 'px');
						else
							$wrapper.css('padding-top', ((($window.height() - panels[firstPanelId].height()) / 2) - $nav.height()) + 'px');
					};

				// Panels.
					$panels.each(function(i) {
						var t = $(this), id = t.attr('id');

						panels[id] = t;

						if (i == 0) {
							firstPanelId = id;
							activePanelId = id;
						}
						else
							t.hide();

						t._activate = function(instant) {

							// Check lock state and determine whether we're already at the target.
								if (isLocked
								||	activePanelId == id)
									return false;

							// Lock.
								isLocked = true;

							// Change nav link (if it exists).
								$nav_links.removeClass('active');
								$nav_links.filter('[href="#' + id + '"]').addClass('active');

							// Change folder icon to open folder and back [CG]
								if (id == 'portfolio') {
									$nav_links.filter('[href="#portfolio"]').removeClass('fa-folder').addClass('fa-folder-open');
								}
								else {
									$nav_links.filter('[href="#portfolio"]').removeClass('fa-folder-open').addClass('fa-folder');
								}

							// Change hash.
								if (i == 0)
									window.location.hash = '#';
								else
									window.location.hash = '#' + id;

							// TODO: move this to after retrieving the panel contents? [CG] doesn't do much?
							// Add bottom padding.
								var x = parseInt($wrapper.css('padding-top')) +
										panels[id].outerHeight() +
										$nav.outerHeight() +
										$footer.outerHeight();

								if (x > $window.height())
									$wrapper.addClass('tall');
								else
									$wrapper.removeClass('tall');
							
							// start loading panel here [CG]
							if (t.hasClass('import')) {
								var url = t.data('import');  // data-import attr
								//var url = t.data('import') + ' #' + id;  // data-import attr
								//t.html('<h2>Importing ' + url + '</h2>');

								$.get(url, function(data) {  // new version
									t.html( $('<div>').append( $.parseHTML(data) ).find('#'+id).html() );
								//t.load(url, function() {  // old version
									//console.log('Done loading ' + url);
									
									// Activate looper images [CG]
										var tlooper = t.find('.looper');
										if (tlooper) {
											//console.log('found looper');
											tlooper.looper('loop');  // starts the looper
											tlooper.looper('next');  // shows the first image right away
										}

									// Reposition.
										$body._reposition();

									// Resize main to height of new panel.
										$main.animate({
											height: panels[id].outerHeight()
										}, instant ? 0 : settings.resizeSpeed, 'swing', function() {

											// Fade in new active panel.
												$footer.fadeTo(instant ? 0 : settings.fadeSpeed, 1.0);
												panels[id].fadeIn(instant ? 0 : settings.fadeSpeed, function() {

													// Unlock.
														isLocked = false;
												});
										});
								});
							}  // endif

							// Fade out active panel.
								$footer.fadeTo(settings.fadeSpeed, 0.0001);
								panels[activePanelId].fadeOut(instant ? 0 : settings.fadeSpeed, function() {

									// Set new active.
										activePanelId = id;

										// Force scroll to top.
											$hbw.animate({
												scrollTop: 0
											}, settings.resizeSpeed, 'swing');

										// TODO: wait here until new panel loaded? [CG]
										// this seems to work ok [CG]
										if (t.hasClass('import') === false) {
											//console.log('import false');  // DEBUG

											// Reposition.
												$body._reposition();

											// Resize main to height of new panel.
												$main.animate({
													height: panels[activePanelId].outerHeight()
												}, instant ? 0 : settings.resizeSpeed, 'swing', function() {

													// Fade in new active panel.
														$footer.fadeTo(instant ? 0 : settings.fadeSpeed, 1.0);
														panels[activePanelId].fadeIn(instant ? 0 : settings.fadeSpeed, function() {

															// Unlock.
																isLocked = false;

														});
												});
										}  // end if
								});

						};

					});

				// Nav + Jumplinks.
					$nav_links.add($jumplinks).click(function(e) {
						var t = $(this), href = t.attr('href'), id;
						if (href.substring(0,1) == '#') {

							e.preventDefault();
							e.stopPropagation();

							id = href.substring(1);

							if (id in panels) {
								panels[id]._activate();
							}
						}
					});

				// Window.
					$window
						.resize(function() {

							if (!isLocked)
								$body._resize();

						});

					$window
						.on('orientationchange', function() {

							if (!isLocked)
								$body._reposition();

						});

					if (skel.vars.IEVersion < 9) {
						$window
							.on('resize', function() {
								$wrapper.css('min-height', $window.height());
							});
					}

				// Fixes browser back button [CG]
					$window
						.on('hashchange', function() {
							id = window.location.hash.substring(1);
							if (id == '') { id = 'me'; }  // fixes home page
							if (id in panels) {
								panels[id]._activate(false);
							}
						});

				// Fix: Placeholder polyfill.
					$('form').placeholder();

				// Prioritize "important" elements on mobile.
					skel.on('+mobile -mobile', function() {
						$.prioritize(
							'.important\\28 mobile\\29',
							skel.breakpoint('mobile').active
						);
					});

				// CSS polyfills (IE<9).
					if (skel.vars.IEVersion < 9)
						$(':last-child').addClass('last-child');

				// Init.
					$window
						.trigger('resize');

					if (hash && hash in panels)
						panels[hash]._activate(true);

					$wrapper.fadeTo(400, 1.0);

			})
			.on('-desktop', function() {

				window.setTimeout(function() {
					location.reload(true);
				}, 50);

			});

		// mobile links to import content [CG]
		$('a.import').click(function(e) {
			e.preventDefault();
			var t = $(this);
			var url = t.attr('href'), id = t.data('target');
			//console.log('import ' + url + ' into #' + id);

			$.get(url, function(data) {  // new version
				$('#' + id).html( $('<div>').append( $.parseHTML(data) ).find('#'+id).html() );
			//$('#' + id).load(url, function() {  // old version
				//console.log('Done loading ' + url);
				// Activate looper
					var tlooper = $('#' + id).find('.looper');
					if (tlooper) {
						tlooper.looper('loop');  // starts the looper
						tlooper.looper('next');  // shows the first image right away
					}
			});
		});

	});

})(jQuery);