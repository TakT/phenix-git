var ChangeRoom = {

	config: [],
	defaultImgs: null,
	currentView: null,
	paper: null,
	currentOptions: null,
	elS: {
		tourBg: jQuery('#change__room').find('.tour3D__bg'),
		soldSVGsEl: jQuery('#change__room').find('.change__room_sold-svg'),
		descriptionEl: jQuery('#change__room').find('.change__room-desc'),
		tourPoints: jQuery('#change__room').find('.tour3D__points'),
		descGroup: null,
	},
	// размеры подложки
	sizeCanvas: {
		width: 753,
		height: 753,
	},

	descTitlePostion: {
		defaultPosition: {
			x: 275,
			y: 330,
		},
		soldOutPosition: {
			x: 375,
			y: 380,
		},
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
		this.paper = Snap('#change__room-plan');
		this.paper.image(this.config.plan, 0, 0, this.sizeCanvas.width, this.sizeCanvas.height);

		this.setElements(this.config.rooms);
		this.createDescBlock();

		Snap.load(this.config.planData, function(data) {
			$this.paper.append(data);
		});

		/*$win.on('resize', this.resizePaper);
		this.resizePaper();*/
	},

	createDescBlock: function() {
		var description = this.paper.rect(215.5, 272, 322, 205)
			.attr({
				fill: '#fff'
			});

		var descriptionInner = this.paper.rect(228, 282, 295, 185).attr({
			fill: '#fff',
			stroke: '#009e74',
			'stroke-width': 2,
		});

		var titleLine = this.paper.rect(275, 345, 97, 2).attr({
			fill: '#009e74',
		}).addClass('title__line');

		this.elS.descTitle = this.paper.text(this.descTitlePostion.defaultPosition.x, this.descTitlePostion.defaultPosition.y, null).addClass('desc__title');
		this.elS.descGroup = this.paper.g(description, descriptionInner, this.elS.descTitle, titleLine).addClass('change__room-desc');
	},

	setElements: function(elements) {

		for (var i = 0, l = elements.length; i < l; i++) {
			var obj = elements[i];
			var opacity = 0;
			var fillOpacity = this.getFillOpacity(obj);
			var link = obj.url ? obj.url : null;
			var soldSVG = obj.soldSVG ? obj.soldSVG : null;
			var $this = this;

			var drawPath = function drawPath() {

				var polygon = $this.paper.polygon(obj.points);
				polygon
					.attr({
						stroke: 'none',
						fill: $this.config.fill,
						'fill-opacity': fillOpacity,
						opacity: opacity,
						cursor: 'pointer',
					})
					.data('href', link)
					.data('index', i)
					.data('soldSVG', ((soldSVG != null) ? true : false))
					.transform('t' + obj.position.left + ',' + obj.position.top);

				if (soldSVG) {

					var p = $this.paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
						fill: "none",
						stroke: "#fff",
						strokeWidth: 2
					});
					p = p.pattern(0, 0, 10, 10);

					polygon.attr({
						fill: p,
						opacity: 1,
					});
				};

				polygon.hover(function() {

					var index = this.data('index');
					var description = $this.config.rooms[index].description;
					var descTitle = $this.elS.descTitle;

					$this.hideDescription();

					if (description != null && description != undefined) {

						var property = null,
							propertyOffset = 380;

						descTitle.attr({
							x: $this.descTitlePostion.defaultPosition.x,
							y: $this.descTitlePostion.defaultPosition.y,
						});

						descTitle.node.textContent = description.title;
						$this.elS.descGroup.addClass('active');

						if (description.properies != null && description.properies != undefined) {

							var propertiesGroup = $this.elS.descGroup.g().addClass('desc__room-properties');
							for (var i = 0; i < description.properies.length; i++) {

								property = description.properies[i];

								var propertyValues = property.value.split('^');
								var propertyTitle = this.paper.text(275, propertyOffset, [property.title, propertyValues]).addClass('property__title');
								var propertyValue = propertyTitle.select('tspan:last-child');

								propertyValue.addClass('property__value').attr({
									dx: 5,
								});

								if (propertyValues.length > 1) {
									propertyValue.select('tspan:last-child').attr({
										'baseline-shift': 'super',
									});
								};

								propertyOffset += 25;

								var propertyGroup = this.paper.g(propertyTitle).addClass('property');
								propertiesGroup.add(propertyGroup);
							};
						}
					};

					if (!this.data('soldSVG')) {
						this.animate({
							opacity: 1,
						}, 200);
					} else {
						if ((description != null && description != undefined) && (description.titleSold != null && description.titleSold != undefined)) {

							$this.elS.descGroup.addClass('change__room-desc--soldout');

							descTitle.node.textContent = description.titleSold;
							descTitle.attr({
								x: $this.descTitlePostion.soldOutPosition.x,
								y: $this.descTitlePostion.soldOutPosition.y,
							});
						}
					}

				}, function() {
					if (!this.data('soldSVG')) {
						this.animate({
							opacity: 0,
						}, 200);
					}
					$this.hideDescription();
				});
			}

			if (parseInt(obj.count) !== 0) {
				drawPath();
			}
		}
	},

	hideDescription: function() {
		this.elS.descGroup.removeClass('active change__room-desc--soldout');
		var propertiesGroup = this.elS.descGroup.select('.desc__room-properties');
		if (propertiesGroup != null) {
			propertiesGroup.remove();
		};
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