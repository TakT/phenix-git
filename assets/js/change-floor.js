var ChangeFloor = {

	config: [],
	defaultImgs: null,
	currentView: null,
	paper: null,
	currentOptions: null,
	elS: {
		parent: jQuery('#change_floor'),
		tourBg: jQuery('#change_floor').find('.tour3D__bg'),
		soldSVGsEl: jQuery('#change_floor').find('.change__room_sold-svg'),
		descriptionEl: jQuery('#change_floor').find('.change__room-desc'),
		tourPoints: jQuery('#change_floor').find('.tour3D__points'),
		descGroup: null,
	},
	// размеры подложки
	sizeCanvas: {
		width: 500,
		height: 1425,
	},

	offsetTop: 0,

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
		// this.offsetTop = $this.elS.parent.css('margin-top');
		this.offsetTop = -50;

		console.log($this.elS.parent, this.offsetTop);

		this.paper = Snap('#change_floor');
		this.paper.image(this.config.tower, 0, 0, this.sizeCanvas.width, this.sizeCanvas.height);

		this.setElements(this.config.floors);

		this.paper.hover(function() {}, function() {
			// $this.unhoverActivatedDescription();
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
						cursor: 'pointer',
					})
					.data('id', obj.id)
					.transform('t' + obj.position.left + ',' + obj.position.top);

				var intervalId = null;

				polygon.hover(function() {
					var id = this.data('id');
					$this.offsetTop = parseInt($this.offsetTop);

					this.animate({
						opacity: 1,
					}, 200);

					intervalId = setInterval(function() {

						var offsetTmp = $this.offsetTop;
						if (id > 0 && id < 21) {
							$this.offsetTop -= 2;
						} else if (id > 0 && id > 21) {
							$this.offsetTop += 2;
						}

						if ($this.offsetTop < -30 && $this.offsetTop > -94) {
							$this.elS.parent.animate({
								'margin-top': $this.offsetTop + '%',
							}, 20);
						} else {
							$this.offsetTop = offsetTmp;
							clearInterval(intervalId);
							return false;
						}
					}, 20);

				}, function() {
					$this.unhoverFloor(this);
					clearInterval(intervalId);
				});

				polygon.click(function(event) {
					var id = this.data('id');
					console.log(id);
					if (id > 0) {
						ChangeRoom.set(id);
					}
				});
			}

			if (parseInt(obj.count) !== 0) {
				drawPath();
			}
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