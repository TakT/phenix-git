var Tour3D = {

	config: [],
	defaultImgs: null,
	currentView: null,
	paper: null,
	currentOptions: null,
	elS: {
		tourBg: jQuery('#tour3D').find('.tour3D__bg'),
		tourCompas: jQuery('#tour3D').find('.tour3D__compass'),
		tourViewTurn: jQuery('#tour3D').find('.tour3D__turn a'),
		tourPoints: jQuery('#tour3D').find('.tour3D__points'),
	},
	// размеры подложки
	sizeCanvas: {
		width: 1920,
		height: 1080,
	},

	visualStyles: {
		colorDisabled: "#8ca7c8",
		colorEnd: "#e7d780",
		colorFilter: "#4aa228",
		colorHighlight: "#6ac42f",
		colorStart: "#e7d780",
		fillOpacity: 0.6,
		speedAnimIn: 200,
		speedAnimInHighlight: 100,
		speedAnimOut: 150,
		startOpacity: 0.7,
	},

	init: function(userConfig) {
		var $this = this;
		this.config = userConfig;

		var $win = jQuery(window);
		this.paper = Snap('#tour3D__content');

		var side = null;
		for (var i = 0; i < this.config.length; i++) {
			side = this.config[i];

			if (!this.defaultImgs && side.isDefault) {
				this.defaultImgs = side.imgs;
				this.currentView = i;
				this.currentOptions = side;
				this.setView(side, side.scale);
			};
		};

		this.elS.tourViewTurn.on('click', function(event) {
			var config = $this.nextConfig($this.config);
			$this.setView(config);
		});

		$win.on('resize', this.resizePaper);
		this.resizePaper();
	},

	nextConfig: function(array) {
		var nextIndex = this.currentView;
		if (nextIndex < array.length) {
			nextIndex = this.currentView + 1;
		}
		if (nextIndex >= array.length) {
			nextIndex = 0;
		}
		this.currentView = nextIndex;
		return array[nextIndex];
	},

	setElements: function(view, elements, scale, scaleBg) {

		for (var i = 0, l = elements.length; i < l; i++) {
			var obj = elements[i];
			var opacity = this.getOpacity(obj);
			var colors = this.getColors(obj);
			var fillOpacity = this.getFillOpacity(obj);
			var colorStart = colors[0];
			var colorEnd = colors[1];
			var link = obj.url ? obj.url : null;
			var $this = this;

			var drawPath = function drawPath() {
				var bPath = $this.paper.path(obj.coords);
				var bPath2 = $this.paper.path('M121.1,74.22 l-2.54-6.78a13,13,0,0,1-.79-3.31,7.68,7.68,0,0,1,.43-1.71l0-.12,0-.12c0.81-2.79.77-8.44-4.31-11.62,3.2-5.07.78-10.18-1.15-12.34l-0.08-.1L112.64,38a7.82,7.82,0,0,1-1.12-1.34h0a12.46,12.46,0,0,1-.72-3.33l-0.64-7.21-0.23-2.55-2.43-.79-6.88-2.23a13,13,0,0,1-3.08-1.44,7.68,7.68,0,0,1-1.06-1.4l-0.07-.11-0.07-.11a10.87,10.87,0,0,0-8.43-4.44,10.13,10.13,0,0,0-3.34.58,10.34,10.34,0,0,0-9.94-6.81H74a9.83,9.83,0,0,1-1.14.07,5.2,5.2,0,0,1-.61,0h0A12.43,12.43,0,0,1,69.16,5.4l-6-4L61,0,58.87,1.41l-6,4a13,13,0,0,1-3,1.51,5,5,0,0,1-.62,0A9.83,9.83,0,0,1,48,6.87l-0.23,0H47.38a10.35,10.35,0,0,0-9.95,6.81,10.13,10.13,0,0,0-3.34-.58,10.84,10.84,0,0,0-8.43,4.43l-0.07.1-0.07.11a7.79,7.79,0,0,1-1.06,1.39h0a12.44,12.44,0,0,1-3.08,1.45l-6.87,2.23-2.43.79-0.23,2.55-0.64,7.21a13,13,0,0,1-.72,3.33A7.71,7.71,0,0,1,9.36,38l-0.09.09-0.09.1C7.25,40.38,4.83,45.49,8,50.56,3,53.74,2.92,59.39,3.73,62.18l0,0.12,0,0.12a7.83,7.83,0,0,1,.43,1.69h0a12.47,12.47,0,0,1-.79,3.32L0.9,74.22,0,76.61l1.85,1.77,5.23,5A13,13,0,0,1,9.22,86a7.63,7.63,0,0,1,.35,1.72v0.14l0,0.13c0.47,2.8,2.94,7.92,8.92,8.59-0.69,6,3.7,9.52,6.39,10.63l0.12,0,0.12,0a7.79,7.79,0,0,1,1.59.72h0a12.44,12.44,0,0,1,2.1,2.69l3.7,6.22,1.3,2.18,2.54-.34,7.16-1a18.56,18.56,0,0,1,2.13-.14,6,6,0,0,1,1.28.1,7.71,7.71,0,0,1,1.57.8l0.11,0.07,0.11,0.06A11.39,11.39,0,0,0,54,120a9.84,9.84,0,0,0,7-2.94A9.84,9.84,0,0,0,68,120a11.41,11.41,0,0,0,5.23-1.3l0.11-.06,0.11-.07a7.81,7.81,0,0,1,1.55-.8h0a5.63,5.63,0,0,1,1.28-.1,18.52,18.52,0,0,1,2.12.14l7.16,1,2.53,0.34,1.31-2.2,3.7-6.22A13,13,0,0,1,95.25,108a7.65,7.65,0,0,1,1.6-.73l0.12,0,0.12,0c2.68-1.11,7.08-4.66,6.39-10.62,6-.67,8.45-5.8,8.92-8.6l0-.13V87.74a7.85,7.85,0,0,1,.35-1.71h0a12.47,12.47,0,0,1,2.15-2.64l5.23-5L122,76.61Z');

				var bTextTitle = $this.paper.text(obj.titlePosition.left, obj.titlePosition.top, obj.title);
				var bTextDesc = $this.paper.text(obj.descPosition.left, obj.descPosition.top, obj.desc).wrap(100, 'center'); //center align

				bPath2
					.attr({
						fill: '#003c23',
						stroke: '#003c23',
						cursor: 'pointer',
						opacity: 0,
					})
					.addClass('descBg')
					.transform('s' + scaleBg + ',t' + obj.bgPosition.left + ',' + obj.bgPosition.top);

				bTextTitle
					.addClass('descTitle')
					.attr({
						'font-family': 'GothamPro',
						'font-size': obj.titleSize,
						fill: '#e9d877',
						cursor: 'pointer',
						opacity: 0,
					});

				bTextDesc
					.addClass('descInfo')
					.attr({
						'font-family': 'ProximaNova-Regular',
						'font-size': obj.descSize,
						'text-transform': 'uppercase',
						'text-align': 'center',
						fill: '#e9d877',
						cursor: 'pointer',
						opacity: 0,
					});

				bPath
					.addClass('tower')
					.attr({
						stroke: 'none',
						fill: colorStart,
						'fill-opacity': fillOpacity,
						opacity: opacity,
						cursor: 'pointer',
					})
					.data('href', link)
					.data('color-end', colorEnd)
					.data('color-start', colorStart)
					.data('opacity', opacity)
					.transform('s' + scale + 't' + view.elsOffset.left + ',' + view.elsOffset.top);

				bPath.hover(function(e) {
					$this.showHover();
					this.stop().animate({
						opacity: 1,
					}, 200);
				});

				bPath2.hover(function() {
					$this.showHouse();
					$this.showHover();
				});
			}

			if (parseInt(obj.count) !== 0) {
				drawPath();
			}
		}
	},

	hoverProperties: {
		opacity: 1,
	},

	unHoverProperties: {
		opacity: 0,
	},

	showHover: function() {
		var imgBg = this.paper.select('.descBg');
		var title = this.paper.select('.descTitle');
		var desc = this.paper.select('.descInfo');

		imgBg.attr(this.hoverProperties);
		title.attr(this.hoverProperties);
		desc.attr(this.hoverProperties);
	},

	hideHover: function() {
		var imgBg = this.paper.select('.descBg');
		var title = this.paper.select('.descTitle');
		var desc = this.paper.select('.descInfo');

		imgBg.attr(this.unHoverProperties);
		title.attr(this.unHoverProperties);
		desc.attr(this.unHoverProperties);
	},

	hideHouse: function() {
		this.paper.select('.tower').stop().attr({
			opacity: 0,
		});
	},

	showHouse: function() {
		this.paper.select('.tower').stop().attr({
			opacity: 1,
		});
	},

	openLocation: function(href) {
		// window.location.href = this.data('href');
		$.fancybox.open({
			href: href,
			type: 'iframe',
		}, {
			padding: 0,
			margin: 0,
			width: '100%',
			height: '100%',
			closeBtn: false,
		});
	},

	setPoints: function(points, callback) {
		// this.elS.tourPoints.children(points).show();

		$this = this;
		$this.markerHovers = [];
		$this.animateMarkerValues = [-330, -330, -330, -330, -330, -330, -330, -330, -330, -330, ];

		for (var i = 0; i < points.length; i++) {
			var point = points[i];

			var bMarker = this.paper.path('M36.44,0C16.1,0.21-.21,16.55,0,36.49A36.34,36.34,0,0,0,30.76,71.73L38.23,79l8.47-8.28C66.19,65,77.27,44.89,71.45,25.78A36.74,36.74,0,0,0,36.44,0Z');
			var bMarker2 = this.paper.path('M36.44,0C16.1,0.21-.21,16.55,0,36.49A36.34,36.34,0,0,0,30.76,71.73L38.23,79l8.47-8.28C66.19,65,77.27,44.89,71.45,25.78A36.74,36.74,0,0,0,36.44,0Z');
			var bMarkerHuman = this.paper.path('M41,44.74l0.52-5.41H42A2.4,2.4,0,0,0,44.53,37a2.32,2.32,0,0,0,0-.46l-1.58-9.77a4.76,4.76,0,0,0-4.75-4H34.83a4.77,4.77,0,0,0-4.75,4l-1.69,9.77a2.38,2.38,0,0,0,2,2.71,2.46,2.46,0,0,0,.39,0h0.46l0.6,5.41c-5.76.58-10.66,2.26-10.66,5.16,0,3.7,7.9,5.41,15.26,5.41s15.29-1.68,15.29-5.38C51.73,47,46.8,45.3,41,44.74Zm-9.32-7.66H30.84l-0.15-.14,1.58-9.77a2.48,2.48,0,0,1,2.49-2.08h3.34a2.48,2.48,0,0,1,2.49,2.08l1.62,9.77-0.12.14H41.16a1.82,1.82,0,0,0-1.82,1.63l-0.6,5.87-0.22,2.26-0.22,2.26H34.55l-0.22-2.26-0.22-2.26-0.55-5.86A1.81,1.81,0,0,0,31.73,37.07Zm4.72,16c-8.56,0-13-2.26-13-3.15S26.36,47.55,32,47l0.24,2.55a2,2,0,0,0,2.06,1.84h4.2a2,2,0,0,0,2.06-1.84L40.84,47c5.66,0.58,8.58,2.16,8.58,2.92S45,53,36.44,53Zm0-31.84A4.38,4.38,0,1,0,32,16.82s0,0,0,0a4.42,4.42,0,0,0,4.45,4.34v0Zm0-6.53a2.12,2.12,0,1,1-2.15,2.13h0A2.14,2.14,0,0,1,36.44,14.67Z');

			bMarker
				.attr({
					fill: '#fff',
					stroke: 'none',
					cursor: 'pointer',
					opacity: 1,
				})
				.data('href', point.url)
				.transform('t' + point.left + ',' + point.top).click(function(event) {
					$this.openLocation(this.data('href'));
				});

			bMarkerHuman
				.attr({
					fill: '#173e29',
					stroke: 'none',
					cursor: 'pointer',
					opacity: 1,
				})
				.data('href', point.url)
				.transform('t' + point.left + ',' + point.top).click(function(event) {
					$this.openLocation(this.data('href'));
				});

			bMarker2
				.attr({
					fill: 'red',
					opacity: 0,
					cursor: 'pointer',
				})
				.data('href', point.url)
				.transform('t' + point.left + ',' + point.top).click(function(event) {
					$this.openLocation(this.data('href'));
				});

			var propertyGroup = this.paper.g(bMarker, bMarkerHuman).addClass('mapMarker');
			var propertyGroupHidden = this.paper.g(bMarker2).addClass('mapMarker-hidden');

			propertyGroup.attr({
				opacity: 0,
			});

			$this.markerHovers.push(propertyGroup)

			propertyGroupHidden.data('groupMarkerId', i);
			propertyGroupHidden.hover(function() {
				$this.hoverMarker(this);
			}, function() {
				$this.unHoverMarker(this);
			});

			$this.addMarkerWithTimeout(propertyGroup, i, i * 100);
		};
	},

	addMarkerWithTimeout: function(propertyGroup, index, timeout) {
		var _this = this;
		window.setTimeout(function() {
			_this.unHoverFakeMarker(propertyGroup, index, 10, 1);
			propertyGroup.animate({
				opacity: 1,
			}, 300);
			// _this.animateMarkerValues[index] = -1;
		}, timeout);
	},

	markerHovers: [],
	intervalUnhoverIds: [],
	intervalHoverIds: [],
	animateMarkerValues: [-330, -330, -330, -330, -330, -330, -330, -330, -330, -330, ],

	hoverFakeMarker: function(el, groupMarkerId) {
		var _this = this;

		if (_this.animateMarkerValues[groupMarkerId] == undefined) {
			_this.animateMarkerValues[groupMarkerId] = 0;
		}

		_this.intervalHoverIds[groupMarkerId] = setInterval(function() {
			if (_this.animateMarkerValues[groupMarkerId] >= -10) {
				el.transform('t0,' + (_this.animateMarkerValues[groupMarkerId]--));
			} else {
				clearInterval(_this.intervalHoverIds[groupMarkerId]);
				_this.intervalHoverIds[groupMarkerId] = null;
			}
		}, 1);
	},

	unHoverFakeMarker: function(el, groupMarkerId, customValue, customInterval) {
		var _this = this;
		customValue = customValue || 1;
		customInterval = customInterval || 10;

		if (_this.animateMarkerValues[groupMarkerId] == undefined) {
			_this.animateMarkerValues[groupMarkerId] = 0;
		}


		_this.intervalUnhoverIds[groupMarkerId] = setInterval(function() {
			_this.animateMarkerValues[groupMarkerId] += customValue;
			if (_this.animateMarkerValues[groupMarkerId] <= 0) {
				el.transform('t0,' + (_this.animateMarkerValues[groupMarkerId]));
			} else {
				clearInterval(_this.intervalUnhoverIds[groupMarkerId]);
				_this.intervalUnhoverIds[groupMarkerId] = null;
			}
		}, customInterval);
	},

	hoverMarker: function(el) {

		var _this = this,
			groupMarkerId = el.data('groupMarkerId');
		el = $this.markerHovers[groupMarkerId]
		el.data('groupMarkerId', groupMarkerId);

		clearInterval(_this.intervalUnhoverIds[groupMarkerId]);
		_this.hoverFakeMarker(el, groupMarkerId);
	},

	unHoverMarker: function(el) {

		var _this = this,
			groupMarkerId = el.data('groupMarkerId');

		el = $this.markerHovers[groupMarkerId];
		el.data('groupMarkerId', groupMarkerId);

		if (_this.intervalHoverIds[groupMarkerId] == undefined) {
			_this.intervalHoverIds[groupMarkerId] = null;
		}

		clearInterval(_this.intervalHoverIds[groupMarkerId]);
		_this.unHoverFakeMarker(el, groupMarkerId);
	},

	setView: function(view) {

		$this = this;
		// this.paper.clear();

		var img = this.paper.select('.imgBg');

		if (img != null) {
			console.log('13');
			img.animate({
				opacity: 0,
			}, 400, mina.linear, function() {
				console.log('lso');
				$this.paper.clear();
				$this._setEements(img, view);
			});
		} else {
			this._setEements(img, view);
		}


		$this.elS.tourCompas.children('img').animate({
			opacity: 0,
		}, 400, function() {
			$this.elS.tourCompas.css({
				'bottom': view.compassBottomOffset,
				'left': view.compassLeftOffset,
			}).children('img').attr('src', view.imgs.compasPath).animate({
				opacity: 1,
			}, 400);
		})
	},

	_setEements: function(img, view) {
		var _this = this;


		jQuery("<img />").attr('src', view.imgs.bgPath)
			.on('load', function() {
				if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
					// alert('broken image!');
				} else {
					img = $this.paper.image(view.imgs.bgPath, 0, 0, 1920, 1080).attr({
						opacity: 0,
					}).addClass('imgBg');

					img.animate({
						opacity: 1,
					}, 400);
					_this.setElements(view, view.elements, view.scale, view.scaleBg);
					_this.setPoints(view.points);

					img.hover(function() {
						_this.hideHover();
						_this.hideHouse();
					});
				}
			});
	},

	/**
	 * Возвращает прозрачность маски по объекту
	 * @param  {Object} obj данные от сервера (elements)
	 * @return {Integer}
	 */
	getOpacity: function getOpacity(obj) {
		obj = obj || {};
		return 0;
	},

	getColors: function getColors(obj) {
		obj = obj || {};

		var colorStart = obj.colorStart || this.visualStyles.colorStart;
		var colorEnd = obj.colorEnd || this.visualStyles.colorEnd;

		return [colorStart, colorEnd];
	},

	getFillOpacity: function getFillOpacity(obj) {
		obj = obj || {};

		var opacity = obj.fillOpacity || this.visualStyles.fillOpacity;

		return opacity;
	},

	resizePaper: function() {

		var ratio = 0.5625;
		var $wrap = jQuery('#tour3D__content');

		var w = jQuery('body').width();
		var h = jQuery('body').height();
		var d = h / w;

		if (d > ratio) {
			$wrap.css({
				'width': h / ratio,
				'height': h,
				'top': 0,
				'left': 0.5 * (w - h / ratio)
			});
		} else {
			$wrap.css({
				'width': w,
				'height': w * ratio,
				'top': 0.5 * (h - w * ratio),
				'left': 0
			});
		};

		var c_w = $wrap.width();
		var c_h = $wrap.height();
	},
}

Array.prototype.next = function() {
	if (!((this.current + 1) in this)) return this.prev();
	return this[++this.current];
};

Array.prototype.prev = function() {
	return this[--this.current];
};

Array.prototype.current = 0;

Snap.plugin(function(Snap, Element, Paper, global) {
	Element.prototype.text = function(text) {
		if (text) {
			if (this.node.textContent) {
				this.node.textContent = text;
			} else {
				this.node.innerText = text;
			}
		} else {
			return this.node.textContent || this.node.innerText;
		}
	}

});

Snap.plugin(function(Snap, Element, Paper, glob) {
	Element.prototype.wrap = function(width, align) {
		var svgNS = "http://www.w3.org/2000/svg";

		var el = this.node;
		align = align || 'left';

		//already wrapped, unwrap -> idempotent wrap() function
		if (this.select('tspan')) {
			this.text(this.text());
		}

		var textContent = this.node.textContent || this.node.innerText;
		if (!textContent)
			textContent = '';
		var words = textContent.split(' ');

		this.node.innerHTML = '';

		var tspans = [];
		//add initial tspan
		var tspan = document.createElementNS(svgNS, "tspan");
		tspans.push(tspan);
		var text = document.createTextNode(words[0]);
		tspan.appendChild(text);
		el.textContent = null;
		el.appendChild(tspan);

		var longest = 0;

		for (var i = 1; i < words.length; i++) {
			//work with tspan until correct length
			var len = tspan.textContent.length;
			tspan.textContent += " " + words[i];
			var clen = tspan.getComputedTextLength();
			tspan.setAttributeNS(null, 'data-clen', clen);

			if (clen > width) {
				//remove that last word, it was too long, and add a space for easily recombining words later
				tspan.textContent = tspan.textContent.slice(0, len).trim() + ' ';
				var clen = tspan.getComputedTextLength();
				tspan.setAttributeNS(null, 'data-clen', clen);

				if (clen > longest)
					longest = clen;

				//can't do the following cause tspan is not wrapped in Element
				//tspan.text(tspan.text().slice(0,len));

				//work on next tspan
				tspan = document.createElementNS(svgNS, "tspan");
				tspans.push(tspan);
				tspan.setAttributeNS(null, "x", this.attr('x'));
				tspan.setAttributeNS(null, "dy", "1.2em");
				text = document.createTextNode(words[i]);
				tspan.appendChild(text);
				el.appendChild(tspan);

				var clen = tspan.getComputedTextLength();
				tspan.setAttributeNS(null, 'data-clen', clen);

				if (clen > longest)
					longest = clen;

			} else if (clen > longest)
				longest = clen;

		}

		//second loop for alignment
		if (align == 'center' || align == 'right') {
			var offset = function(clen) {
				if (align == 'center') {
					return longest / 2 - clen / 2;
				} else {
					return longest - clen;
				}
			}
			for (var i = 0; i < tspans.length; i++) {
				tspans[i].setAttributeNS(null, 'dx', offset(tspans[i].getAttribute('data-clen')));
			}
		}

		//don't think we need this
		this.data('longest', longest);
		return this;
	};

});