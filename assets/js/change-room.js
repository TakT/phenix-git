var ChangeRoom = {

	config: [],
	defaultImgs: null,
	currentView: null,
	paper: null,
	currentOptions: null,
	elS: {
		tourBg: jQuery('#change__room').find('.tour3D__bg'),
		soldSVGsEl: jQuery('#change__room').find('.change__room_sold-svg'),
		tourViewTurn: jQuery('#change__room').find('.tour3D__turn a'),
		tourPoints: jQuery('#change__room').find('.tour3D__points'),
	},
	// размеры подложки
	sizeCanvas: {
		width: 755,
		height: 755,
	},

	visualStyles: {
		colorDisabled: "#8ca7c8",
		colorEnd: "#008a64",
		colorFilter: "#4aa228",
		colorHighlight: "#6ac42f",
		colorStart: "#008a64",
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
		this.paper = ScaleRaphael('change__room-plan', this.sizeCanvas.width, this.sizeCanvas.height);

		this.paper.image(this.config.plan, 0, 0, this.sizeCanvas.width, this.sizeCanvas.height);

		this.setElements(this.config.rooms);

		// наносим маски
		this.paper.setStart();

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

	setElements: function(elements) {

		for (var i = 0, l = elements.length; i < l; i++) {
			var obj = elements[i];
			var opacity = this.getOpacity(obj);
			var colors = this.getColors(obj);
			var fillOpacity = this.getFillOpacity(obj);
			var colorStart = colors[0];
			var colorEnd = colors[1];
			var link = obj.url ? obj.url : null;
			var soldSVG = obj.soldSVG ? obj.soldSVG : null;
			var $this = this;

			var drawPath = function drawPath() {

				var convertedPath = obj.points.replace(/([0-9.]+),([0-9.]+)/g, function($0, x, y) {
					return 'L ' + Math.floor(x) + ',' + Math.floor(y) + ' ';
				}).replace(/^L/, 'M'); // replace first L with M (moveTo)

				var bPath = $this.paper.path("M" + convertedPath + "Z");

				if (soldSVG) {
					console.log(soldSVG);
					$this.elS.soldSVGsEl.find('.flat-' + obj.id).addClass('active');
				};

				bPath
					.attr({
						stroke: 'none',
						fill: $this.fill,
						'fill-opacity': fillOpacity,
						opacity: opacity,
						cursor: 'pointer',
					})
					.data('href', link)
					.data('color-end', colorEnd)
					.data('color-start', colorStart)
					.data('opacity', opacity)
					.transform('t' + obj.position.left + ',' + obj.position.top);

				bPath.hover(function(e) {
					$this.mouseEnterMask(this);
				}, function() {
					$this.mouseLeaveMask(this);
				});
			}

			if (parseInt(obj.count) !== 0) {
				drawPath();
			}
		}
	},

	setPoints: function(points) {
		// this.elS.tourPoints.children(points).show();

		for (var i = 0; i < points.length; i++) {
			var point = points[i];

			var bMarker = this.paper.path('M36.44,0C16.1,0.21-.21,16.55,0,36.49A36.34,36.34,0,0,0,30.76,71.73L38.23,79l8.47-8.28C66.19,65,77.27,44.89,71.45,25.78A36.74,36.74,0,0,0,36.44,0Z');
			var bMarkerHuman = this.paper.path('M41,44.74l0.52-5.41H42A2.4,2.4,0,0,0,44.53,37a2.32,2.32,0,0,0,0-.46l-1.58-9.77a4.76,4.76,0,0,0-4.75-4H34.83a4.77,4.77,0,0,0-4.75,4l-1.69,9.77a2.38,2.38,0,0,0,2,2.71,2.46,2.46,0,0,0,.39,0h0.46l0.6,5.41c-5.76.58-10.66,2.26-10.66,5.16,0,3.7,7.9,5.41,15.26,5.41s15.29-1.68,15.29-5.38C51.73,47,46.8,45.3,41,44.74Zm-9.32-7.66H30.84l-0.15-.14,1.58-9.77a2.48,2.48,0,0,1,2.49-2.08h3.34a2.48,2.48,0,0,1,2.49,2.08l1.62,9.77-0.12.14H41.16a1.82,1.82,0,0,0-1.82,1.63l-0.6,5.87-0.22,2.26-0.22,2.26H34.55l-0.22-2.26-0.22-2.26-0.55-5.86A1.81,1.81,0,0,0,31.73,37.07Zm4.72,16c-8.56,0-13-2.26-13-3.15S26.36,47.55,32,47l0.24,2.55a2,2,0,0,0,2.06,1.84h4.2a2,2,0,0,0,2.06-1.84L40.84,47c5.66,0.58,8.58,2.16,8.58,2.92S45,53,36.44,53Zm0-31.84A4.38,4.38,0,1,0,32,16.82s0,0,0,0a4.42,4.42,0,0,0,4.45,4.34v0Zm0-6.53a2.12,2.12,0,1,1-2.15,2.13h0A2.14,2.14,0,0,1,36.44,14.67Z');

			bMarker
				.attr({
					fill: '#fff',
					stroke: 'none',
					cursor: 'pointer',
					opacity: 1,
				})
				.data('href', point.url)
				.transform('t' + point.left + ',' + point.top)
				.click(function(event) {
					// Обработка перехода
					console.log(this.data('href'));
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
					// Обработка перехода
					console.log(this.data('href'));
				});
		};

	},

	setView: function(view) {

		$this = this;
		this.elS.tourBg.children('img').animate({
			opacity: 0,
		}, 400, function() {
			$this.paper.clear();
			// $this.elS.tourPoints.children('div').hide();
			// $this.elS.tourPoints.html(null);
			$this.elS.tourBg.children('img').attr('src', view.imgs.bgPath).animate({
				opacity: 1,
			}, 400, function() {
				$this.setPoints(view.points);
			});

			// внедряем в холст изображение плана
			// this.paper.image(view.imgs.bgPath, 0, 0, this.sizeCanvas.width, this.sizeCanvas.height);

			// наносим маски
			// this.paper.setStart();

			$this.setElements(view.elements, view.scale, view.scaleBg);
			$this.paper.setViewBox(view.viewBoxPosition.x, view.viewBoxPosition.y, $this.sizeCanvas.width, $this.sizeCanvas.height);
		});

		this.elS.tourCompas.children('img').animate({
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

	// метод анимации наведения курсора на маску
	mouseEnterMask: function(mask) {
		eve('raphael.event.mouseenter', mask);

	},

	// метод анимации затухания маски при удалении курсора
	mouseLeaveMask: function(mask, isFilter) {
		eve('raphael.event.mouseleave', mask);
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
		var $wrap = jQuery('#change__room-plan');

		if (!ChangeFloor.paper) {
			return;
		}

		var w = jQuery('body').width();
		var h = jQuery('body').height();
		var d = h / w;

		if (d > ratio) {
			$wrap.css({
				'width': h / ratio,
				'height': h,
				'top': 0,
				// 'left': 0.5 * (w - h / ratio)
				'left': 0
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

		ChangeFloor.paper.changeSize(c_w, c_h, false, true);
	},
}

/* jshint ignore:start */
//jscs:disable
/*
обработчики событий на масках модуля
 */

var config = {
	visualStyles: {
		colorFilter: '#4aa228',
		colorStart: '#008a64',
		colorEnd: '#008a64',
		colorHighlight: '#6ac42f',
		colorDisabled: '#8ca7c8',

		fillOpacity: 0.6,

		speedAnimIn: 200,
		speedAnimOut: 150,
		speedAnimInHighlight: 100
	}
}

var hoverProperties = {
	opacity: 1,
};

var unHoverProperties = {
	opacity: 0,
};

var timeoutId = null;

eve.on('raphael.event.mouseenter', function() {

	this.stop().animate({
		fill: this.data('color-end'),
		opacity: 1,
		easing: 'easeIn'
	}, config.visualStyles.speedAnimIn);
});

eve.on('raphael.event.mouseleave', function(callback) {
	this.animate({
		fill: this.data('color-start'),
		opacity: this.data('opacity'),
		easing: 'easeOut'
	}, config.visualStyles.speedAnimOut);
});

eve.on('raphael.event.click', function() {

});