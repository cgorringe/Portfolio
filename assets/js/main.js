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

	// $window.on('load', function() {
	$(document).ready(function() {  // this speeded up initial load [CG]

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

							// Change hash.
								if (i == 0)
									window.location.hash = '#';
								else
									window.location.hash = '#' + id;

							// Add bottom padding.
								var x = parseInt($wrapper.css('padding-top')) +
										panels[id].outerHeight() +
										$nav.outerHeight() +
										$footer.outerHeight();

								if (x > $window.height())
									$wrapper.addClass('tall');
								else
									$wrapper.removeClass('tall');

							// Fade out active panel.
								$footer.fadeTo(settings.fadeSpeed, 0.0001);
								panels[activePanelId].fadeOut(instant ? 0 : settings.fadeSpeed, function() {

									// Set new active.
										activePanelId = id;

										// Force scroll to top.
											$hbw.animate({
												scrollTop: 0
											}, settings.resizeSpeed, 'swing');

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
								/*
								// NOT USED - REMOVE
								if (id === 'customcut') {  // TEST
									$('#customcut').load("index_details.html #customcut", function() {
	  								alert( "customcut Loaded" );
										panels[id]._activate();
	  							});
								}
								else {
								}
								// */

								/*
								// NOT USED - REMOVE
								// I'm thinking I should do a different approach.
								// Perhaps stick with keeping all of the html in the original document,
								// but instead load images/video at a later time to speed up overall page load.

								if (id === 'portfolio') {
									if ( $('#customcut').length == 0 ) {
										// load details if #customcut doesn't exist
										console.log("loading details...");
										$.get( "index_details.html", function( data ) {
											// alert( "Loaded details" );
											$('#main').append(data);
											console.log("finished loading");
										});
									}
								}
								// */

								panels[id]._activate();
							}
							else {  
								// NOT USED - REMOVE
								// new [CG]
								// panel id doesn't exist yet, so load it
								/*
								$('#details').load("index_details.html", function() {
  								alert( "Details Loaded" );
  							});
								// */
								// TODO: this is not finished!
							}
						}

						// Pause all youtube videos [CG]  DOESN'T WORK
						/*
						$('.youtube').each(function(i) {
							console.log("TEST i=" + i);  // TEST
							var iframe = $( this ).get();
							console.log("TEST iframe = " + iframe);  // TEST

							// contentWindow only avail on FF ??
							console.log("TEST contentWindow = " + iframe.contentWindow);  // TEST (undefined)
							console.log("TEST contentDocument = " + iframe.contentDocument);  // TEST (undefined)
							// I think this isn't working due to the same-origin policy?

							if (iframe.contentWindow && iframe.contentWindow.postMessage) {
								console.log("TEST pause video");  // TEST
							  // iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
						  }
						});
						// */
						/*
						// not working due to YouTube forcing https (even when http) which won't work
						// when my server is http
						var iframe = window.frames[0];
						console.log("TEST iframe = " + iframe);  // TEST
						console.log("TEST contentWindow = " + iframe.contentWindow);  // TEST (undefined)
						console.log("TEST contentDocument = " + iframe.contentDocument);  // TEST (undefined)
						// */

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

					if (skel.vars.IEVersion < 9)
						$window
							.on('resize', function() {
								$wrapper.css('min-height', $window.height());
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

	});

})(jQuery);