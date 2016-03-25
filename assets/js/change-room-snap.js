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

	fakeHovers: [],

	init: function(userConfig) {
		var $this = this;
		this.config = userConfig || this.config;

		if (!this.activeConfig) {
			this.activeConfig = this.setDefault();
		}

		if (this.activeConfig) {
			var $win = jQuery(window);
			this.paper = Snap('#change__room-plan');
			// this.paper.image(this.activeConfig.plan, 0, 0, this.sizeCanvas.width, this.sizeCanvas.height);

			this.setElements(this.activeConfig.rooms);
			this.createDescBlock();

			Snap.load(this.activeConfig.plan, function(data) {
				data.parent = function() {};
				$this.paper.select('.change__room-desc').before(data);
			});

			if (this.activeConfig.planData) {
				Snap.load(this.activeConfig.planData, function(data) {
					$this.paper.append(data);
					$this.setFakeElements($this.activeConfig.rooms);
				});
			} else {
				$this.setFakeElements($this.activeConfig.rooms);
			}

			this.paper.hover(function() {}, function() {
				$this.unhoverActivatedDescription();
			});
		}

	},

	set: function(id) {
		if (id > 0) {
			var room = null;
			for (var i = 0; i < this.config.length; i++) {
				var room = this.config[i];
				if (room.id == id) {
					this.reinit(room);
					break;
				}
			}
		}
	},

	reinit: function(room) {
		if (this.paper) {
			this.paper.clear();
			this.fakeHovers = [];
			this.activeConfig = room;
			this.init();
		}
	},

	setDefault: function() {
		var room = null;
		for (var i = 0; i < this.config.length; i++) {
			room = this.config[i];
			if (room.isDefault) {
				this.reinit(room);
				break;
			}
		}
		return room;
	},

	createDescBlock: function() {
		var description = this.paper.rect(215.5, 272, 322, 205)
			.attr({
				fill: '#fff'
			});

		var descriptionInner = this.paper.rect(228, 282, 295, 185).attr({
			fill: '#fff',
			stroke: this.activeConfig.fill,
			'stroke-width': 2,
		});

		var titleLine = this.paper.rect(275, 345, 97, 2).attr({
			fill: this.activeConfig.fill,
		}).addClass('title__line');

		this.elS.descTitle = this.paper.text(this.descTitlePostion.defaultPosition.x, this.descTitlePostion.defaultPosition.y, null).addClass('desc__title');
		this.elS.descGroup = this.paper.g(description, descriptionInner, this.elS.descTitle, titleLine).addClass('change__room-desc');
	},

	setElements: function(elements) {

		for (var i = 0, l = elements.length; i < l; i++) {
			var obj = elements[i];
			var opacity = 0.5;
			var fillOpacity = this.getFillOpacity(obj);
			var modalId = obj.modalId ? obj.modalId : null;
			var soldSVG = obj.soldSVG ? obj.soldSVG : null;
			var $this = this;

			var drawPath = function drawPath() {

				var polygon = $this.paper.polygon(obj.points);
				polygon
					.attr({
						stroke: 'none',
						fill: $this.activeConfig.fill,
						'fill-opacity': fillOpacity,
						opacity: opacity,
						cursor: 'pointer',
					})
					.data('modalId', modalId)
					.data('index', i)
					.data('soldSVG', ((soldSVG != null) ? true : false))
					.transform('t' + obj.position.left + ',' + obj.position.top);

				if (soldSVG) {

					var p = $this.paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
						fill: "none",
						stroke: "#fff",
						opacity: 0.6,
						strokeWidth: 2
					});
					p = p.pattern(0, 0, 10, 10);

					polygon.attr({
						fill: p,
					});
				};

				$this.fakeHovers.push(polygon);
			}

			if (parseInt(obj.count) !== 0) {
				drawPath();
			}
		}
	},

	setFakeElements: function(elements) {

		for (var i = 0, l = elements.length; i < l; i++) {
			var obj = elements[i];
			var fillOpacity = this.getFillOpacity(obj);
			var modalId = obj.modalId ? obj.modalId : null;
			var soldSVG = obj.soldSVG ? obj.soldSVG : null;
			var $this = this;

			var drawPath = function drawPath() {

				var polygon = $this.paper.polygon(obj.points);
				polygon
					.attr({
						stroke: 'none',
						fill: 'red',
						'fill-opacity': fillOpacity,
						opacity: 0,
						cursor: 'pointer',
					})
					.data('modalId', modalId)
					.data('index', i)
					.data('soldSVG', ((soldSVG != null) ? true : false))
					.transform('t' + obj.position.left + ',' + obj.position.top);

				polygon.hover(function() {
					var el = null;
					for (var i = 0; i < $this.fakeHovers.length; i++) {
						el = $this.fakeHovers[i];
						if (el.data('index') == polygon.data('index')) {
							$this.setHoverRoom(el);
							break;
						}
					}
				}, function() {

				});

				polygon.click(function() {
					var modalId = this.data('modalId');
					if (modalId != null && !this.data('soldSVG')) {
						jQuery(modalId).modal('show');
					}
				});
			}

			if (parseInt(obj.count) !== 0) {
				drawPath();
			}
		}
	},

	setHoverRoom: function(el) {
		var index = el.data('index');
		var description = this.activeConfig.rooms[index].description;
		var descTitle = this.elS.descTitle;
		var $this = this;

		this.unhoverActivatedDescription();
		this.hideDescription();

		el.addClass('active');

		if (description != null && description != undefined) {

			var property = null,
				propertyOffset = 370;

			descTitle.attr({
				x: $this.descTitlePostion.defaultPosition.x,
				y: $this.descTitlePostion.defaultPosition.y,
			});

			descTitle.node.textContent = description.title;
			$this.elS.descGroup.addClass('change__room-active');

			if (description.properies != null && description.properies != undefined) {

				var propertiesGroup = $this.elS.descGroup.g().addClass('desc__room-properties');
				for (var i = 0; i < description.properies.length; i++) {

					property = description.properies[i];

					var propertyValues = property.value.split('^');
					var propertyTitle = el.paper.text(275, propertyOffset, [property.title, propertyValues]).addClass('property__title');
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

					var propertyGroup = el.paper.g(propertyTitle).addClass('property');
					propertiesGroup.add(propertyGroup);
				};
			}
		};

		el.animate({
			opacity: 1,
		}, 200);

		if (el.data('soldSVG')) {
			if ((description != null && description != undefined) && (description.titleSold != null && description.titleSold != undefined)) {

				$this.elS.descGroup.addClass('change__room-desc--soldout');

				descTitle.node.textContent = description.titleSold;
				descTitle.attr({
					x: $this.descTitlePostion.soldOutPosition.x,
					y: $this.descTitlePostion.soldOutPosition.y,
				});
			}
		}
	},

	unhoverActivatedDescription: function() {
		var activeEls = this.paper.select('.active');
		if (activeEls != null) {
			activeEls.removeClass('active');
			this.unhoverDescription(activeEls);
		}
	},

	unhoverDescription: function(hoverPolygon) {
		hoverPolygon.animate({
			opacity: 0.5,
		}, 200);
		this.hideDescription();
	},

	hideDescription: function() {
		this.elS.descGroup.removeClass('change__room-active change__room-desc--soldout');
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