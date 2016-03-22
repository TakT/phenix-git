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
		this.paper = ScaleRaphael('tour3D__content', this.sizeCanvas.width, this.sizeCanvas.height);

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

	setElements: function(elements, scale, scaleBg) {

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
				var bTextDesc = $this.paper.text(obj.descPosition.left, obj.descPosition.top, obj.desc);

				bPath2
					.attr({
						fill: '#003c23',
						stroke: '#003c23',
						cursor: 'pointer',
						opacity: 0,
					})
					.transform('s' + scaleBg + ',t' + obj.bgPosition.left + ',' + obj.bgPosition.top);

				bTextTitle
					.attr({
						'font-family': 'GothamPro',
						'font-size': obj.titleSize,
						fill: '#e9d877',
						cursor: 'pointer',
						opacity: 0,
					});

				bTextDesc
					.attr({
						'font-family': 'ProximaNova-Regular',
						'font-size': obj.descSize,
						'text-transform': 'uppercase',
						fill: '#e9d877',
						cursor: 'pointer',
						opacity: 0,
					});

				bPath
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
					.scale(scale);

				bPath.hover(function(e) {
					$this.mouseEnterMask(this);
				}, function() {
					$this.mouseLeaveMask(this);
				});

				bPath2.hover(function(e) {
					eve('raphael.event.mouseenter-bg', this);
				}, function() {
					eve('raphael.event.mouseleave-bg', this);
				});

				bTextTitle.hover(function(e) {
					eve('raphael.event.mouseenter-bg', this);
				}, function() {
					eve('raphael.event.mouseleave-bg', this);
				});

				bTextDesc.hover(function(e) {
					eve('raphael.event.mouseenter-bg', this);
				}, function() {
					eve('raphael.event.mouseleave-bg', this);
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
				.transform('t' + point.left + ',' + point.top).click(function(event) {
					// Обработка перехода
					console.log(this.data('href'));
					window.location.href = this.data('href');
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
					window.location.href = this.data('href');
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
		eve('buildings.highlightFilter_enter', mask);

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
		var $wrap = jQuery('#tour3D .fullscreen__content-wrapper');

		if (!Tour3D.paper) {
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

		Tour3D.paper.changeSize(c_w, c_h, true, true);
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

/*
 * ScaleRaphael 0.8 by Zevan Rosser 2010
 * For use with Raphael library : www.raphaeljs.com
 * Licensed under the MIT license.
 *
 * www.shapevent.com/scaleraphael/
 */
$(document).ready(function() {
	window.ScaleRaphael = function(container, width, height) {
		var wrapper = document.getElementById(container);
		if (!wrapper.style.position) wrapper.style.position = "relative";
		wrapper.style.width = width + "px";
		wrapper.style.height = height + "px";
		wrapper.style.overflow = "hidden";

		var nestedWrapper;

		if (Raphael.type == "VML") {
			wrapper.innerHTML = "<rvml:group style='position : absolute; width: 1000px; height: 1000px; top: 0px; left: 0px' coordsize='1000,1000' class='rvml' id='vmlgroup'><\/rvml:group>";
			nestedWrapper = document.getElementById("vmlgroup");
		} else {
			wrapper.innerHTML = "<div id='svggroup'><\/div>";
			nestedWrapper = document.getElementById("svggroup");
		}

		var paper = new Raphael(nestedWrapper, width, height);
		var vmlDiv;

		if (Raphael.type == "SVG") {
			paper.canvas.setAttribute("viewBox", "0 0 " + width + " " + height);
		} else {
			vmlDiv = wrapper.getElementsByTagName("div")[0];
		}

		paper.changeSize = function(w, h, center, clipping) {
			clipping = !clipping;

			var ratioW = w / width;
			var ratioH = h / height;
			var scale = ratioW < ratioH ? ratioW : ratioH;

			var newHeight = parseInt(height * scale);
			var newWidth = parseInt(width * scale);

			if (Raphael.type == "VML") {
				// scale the textpaths
				var txt = document.getElementsByTagName("textpath");
				for (var i in txt) {
					var curr = txt[i];
					if (curr.style) {
						if (!curr._fontSize) {
							var mod = curr.style.font.split("px");
							curr._fontSize = parseInt(mod[0]);
							curr._font = mod[1];
						}
						curr.style.font = curr._fontSize * scale + "px" + curr._font;
					}
				}
				var newSize;
				if (newWidth < newHeight) {
					newSize = newWidth * 1000 / width;
				} else {
					newSize = newHeight * 1000 / height;
				}
				newSize = parseInt(newSize);
				nestedWrapper.style.width = newSize + "px";
				nestedWrapper.style.height = newSize + "px";
				if (clipping) {
					nestedWrapper.style.left = parseInt((w - newWidth) / 2) + "px";
					nestedWrapper.style.top = parseInt((h - newHeight) / 2) + "px";
				}
				vmlDiv.style.overflow = "visible";
			}

			if (clipping) {
				newWidth = w;
				newHeight = h;
			}

			wrapper.style.width = newWidth + "px";
			wrapper.style.height = newHeight + "px";
			paper.setSize(newWidth, newHeight);

			if (center) {
				wrapper.style.position = "absolute";
				wrapper.style.left = parseInt((w - newWidth) / 2) + "px";
				wrapper.style.top = parseInt((h - newHeight) / 2) + "px";
			}
		}

		paper.scaleAll = function(amount) {
			paper.changeSize(width * amount, height * amount);
		}

		paper.changeSize(width, height);

		paper.w = width;
		paper.h = height;

		return paper;
	}
});