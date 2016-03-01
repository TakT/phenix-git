var ChangeFloor = {

	config: [],
	defaultImgs: null,
	currentView: null,
	paper: null,
	currentOptions: null,
	elS: {
		parent: jQuery('#change_floor'),
		tourBg: jQuery('#change_floor').find('.tour3D__bg'),
		floorInfo: jQuery('#floor__info'),
		typesMenu: jQuery('.content__menu'),
	},
	// размеры подложки
	sizeCanvas: {
		width: 500,
		height: 1425,
	},

	offsetTop: 0,
	currentFloor: 21,

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
	cursorDirectionClassList: ['direction__center', 'direction__up', 'direction__down'],

	init: function(userConfig) {
		var $this = this;
		this.config = userConfig;

		var $win = jQuery(window);
		// this.offsetTop = $this.elS.parent.css('margin-top');
		this.offsetTop = -51;
		this.currentFloor = this.config.defaultFloor;

		this.paper = Snap('#change_floor');
		this.paper.image(this.config.tower, 0, 0, this.sizeCanvas.width, this.sizeCanvas.height);

		this.setElements(this.config.floors);

		this.paper.hover(function() {
			$this.elS.floorInfo.show();
		}, function() {
			$this.elS.floorInfo.hide();
		});

		/*$win.on('resize', this.resizePaper);
		this.resizePaper();*/
	},

	setElements: function(elements) {

		for (var i = 0, l = elements.length; i < l; i++) {
			var obj = elements[i];
			var opacity = 0;
			var fillOpacity = this.getFillOpacity(obj);
			var svgType = obj.svgType ? obj.svgType : null;
			var $this = this;
			var cursorDirection = 'center';

			var drawPath = function drawPath() {

				var polygon = null;
				if (!svgType) {
					polygon = $this.paper.polygon(obj.points);
				} else {
					polygon = $this.paper.path(obj.points);
				}

				polygon
					.attr({
						stroke: 'none',
						fill: obj.fill,
						'fill-opacity': 0.4,
						opacity: opacity,
						cursor: 'none',
					})
					.data('id', obj.id)
					.data('rooms', obj.rooms)
					.data('type', obj.type)
					.transform('t' + obj.position.left + ',' + obj.position.top);

				if (obj.id == 21) {
					cursorDirection = 'center';
				} else if (obj.id > 0 && obj.id < 21) {
					cursorDirection = 'down';
				} else if (obj.id > 0 && obj.id > 21) {
					cursorDirection = 'up';
				}

				polygon.attr({
					cursor: 'url(./assets/images/cursor-' + cursorDirection + '.svg) 0 10, pointer',
				});

				var intervalId = null;
				var parentOffset = $this.elS.floorInfo.parent().position();

				polygon.mousemove(function(e) {

					var relX = e.pageX - parentOffset.left;
					var relY = e.pageY - parentOffset.top;

					// console.log(relX);

					$this.elS.floorInfo.css({
						left: relX,
						top: relY
					});
				});

				polygon.hover(function(e) {
					var id = this.data('id');
					var rooms = this.data('rooms');
					var polygonObj = this;

					$this.offsetTop = parseInt($this.offsetTop);

					this.animate({
						opacity: 1,
					}, 200);

					var relX = e.pageX - parentOffset.left;
					var relY = e.pageY - parentOffset.top;

					if (relX < 295) {
						$this.elS.floorInfo.removeClass('offset-left').addClass('offset-right');
					} else {
						$this.elS.floorInfo.removeClass('offset-right').addClass('offset-left');
					}

					$this.elS.floorInfo.find('.floor__info-floor').text(id);
					$this.elS.floorInfo.find('.floor__info-rooms').text(rooms);

					// console.log(event.pageX, event.pageY);

					var cursorDirectionClass = 'direction__center';
					intervalId = setInterval(function() {

						var offsetTmp = $this.offsetTop;
						if (id == 21) {
							cursorDirection = 'center';
						} else if (id > 0 && id < 21) {
							$this.offsetTop -= 2;
							cursorDirection = 'down';
						} else if (id > 0 && id > 21) {
							$this.offsetTop += 2;
							cursorDirection = 'up';
						}

						$this.elS.floorInfo.removeClass($this.cursorDirectionClassList.join(' '));
						cursorDirectionClass = 'direction__' + cursorDirection;
						$this.elS.floorInfo.addClass(cursorDirectionClass);

						polygonObj.attr({
							cursor: 'url(./assets/images/cursor-' + cursorDirection + '.svg) 0 10, pointer',
						});

						if ((!$this.elS.parent.is(':off-top') && cursorDirection == 'up') || (!$this.elS.parent.is(':off-bottom') && cursorDirection == 'down')) {
							$this.offsetTop = offsetTmp;
							clearInterval(intervalId);
							return false;
						}

						$this.elS.parent.animate({
							'margin-top': $this.offsetTop + '%',
						}, 75);
					}, 75);

				}, function() {
					$this.unhoverFloor(this);
					clearInterval(intervalId);
				});

				polygon.click(function(event) {
					clearInterval(intervalId);
					$this.setFloor(this, true);
				});

				if ($this.config.defaultFloor == obj.id) {
					$this.setFloor(polygon, true);
				}
			}

			if (parseInt(obj.count) !== 0) {
				drawPath();
			}
		}
	},

	setById: function(id, updateSlider) {
		if (id > 0) {
			var floor = null;
			var els = this.paper.selectAll('path, polygon');
			var el, elId;

			for (var i = 0; i < els.length; i++) {
				el = els[i];
				elId = el.data('id');
				if (id == elId) {
					this.setFloor(el, updateSlider);
				}
			}
		}
	},

	setFloor: function(el, updateSlider) {
		console.log('-', updateSlider);
		updateSlider = (updateSlider) ? updateSlider : false;
		var id = el.data('id');
		var type = el.data('type');

		var actives = el.parent().select('.active');
		if (actives) {
			actives.attr('class', '');
		}

		el.attr('class', 'active');
		if (id > 0 && id != this.currentFloor) {
			ChangeRoom.set(id);
		}

		console.log(this.config.sliderEl != undefined, updateSlider, (this.config.sliderEl != undefined && updateSlider));
		if (this.config.sliderEl != undefined && updateSlider) {
			console.log('update');
			this.config.sliderEl.noUiSlider.set(id);
		}

		this.setTypeActive(type);
		this.currentFloor = id;
	},

	setTypeActive: function(type) {
		var typeEl = this.elS.typesMenu.find('a[data-type="' + type + '"]');

		if (typeEl.length > 0) {
			this.elS.typesMenu.find('a.active').removeClass('active');
			typeEl.addClass('active');
		}
	},

	unhoverFloor: function(hoverPolygon) {
		if (!hoverPolygon.data('soldSVG')) {
			hoverPolygon.animate({
				opacity: 0,
			}, 200);
		}
	},

	getFillOpacity: function getFillOpacity(obj) {
		obj = obj || {};

		var opacity = obj.fillOpacity || this.visualStyles.fillOpacity;

		return opacity;
	},

	resizePaper: function() {

		var ratio = 0.5625;
		var $wrap = jQuery('#change_floor');

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