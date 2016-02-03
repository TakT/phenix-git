/* jshint ignore:start */
//jscs:disable
/*
обработчики событий на масках модуля
 */

var config = {
	visualStyles: {
		colorFilter: '#4aa228',
		colorStart: '#e7d780',
		colorEnd: '#e7d780',
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

	/*var imgBg = this.next;
	var title = imgBg.next;
	var desc = title.next;*/

	this.attr({
		fill: this.data('color-end'),
		opacity: this.data('opacity') || 0.3
	});

	/*imgBg.attr({
		opacity: 1
	});*/

	this.stop().animate({
		fill: this.data('color-end'),
		opacity: 1,
		easing: 'easeIn'
	}, config.visualStyles.speedAnimIn);
});

eve.on('raphael.event.mouseleave', function(callback) {

	var imgBg = this.next;
	var title = imgBg.next;
	var desc = title.next;

	/*imgBg.attr(unHoverProperties);
	title.attr(unHoverProperties);
	desc.attr(unHoverProperties);*/

	hideHouse(this);
});

eve.on('buildings.highlight', function(color, opct) {
	this.stop().animate({
		fill: color,
		opacity: opct
	}, config.visualStyles.speedAnimInHighlight);
});

eve.on('buildings.highlightFilter_enter', function() {

	showHover(this);

	this.stop().animate({
		fill: config.visualStyles.colorEnd,
		opacity: 1
	}, config.visualStyles.speedAnimInHighlight);
});

eve.on('raphael.event.mouseenter-bg', function() {
	showHouse(getHouse(this));
	showHover(getHouse(this));
});

eve.on('raphael.event.mouseleave-bg', function() {
	// this.prev.attr(unHoverProperties);
});

eve.on('buildings.highlightFilter_leave', function() {
	this.stop().animate({
		fill: config.visualStyles.colorHighlight,
		opacity: 1
	}, config.visualStyles.speedAnimInHighlight);
});

eve.on('raphael.event.click', function() {

});

function showHover(e) {
	var imgBg = e.next;
	var title = imgBg.next;
	var desc = title.next;

	imgBg.attr(hoverProperties);
	title.attr(hoverProperties);
	desc.attr(hoverProperties);
}

function hideHover(e) {
	var imgBg = e.next;
	var title = imgBg.next;
	var desc = title.next;

	imgBg.attr(unHoverProperties);
	title.attr(unHoverProperties);
	desc.attr(unHoverProperties);
}

function getHouse(e) {
	var close = true;
	var house = null;
	var currentPrev = null;

	currentPrev = e;
	for (var i = 0; i < 5; i++) {
		currentPrev = currentPrev.prev;
		if (currentPrev == null) {
			break;
		};

		if (currentPrev.id != null && (currentPrev.id == 0 || currentPrev.attrs.stroke == 'none')) {
			house = currentPrev;
		};
	};
	return house;
}

function hideHouse(e) {
	e.animate({
		fill: e.data('color-start'),
		opacity: e.data('opacity'),
		easing: 'easeOut'
	}, config.visualStyles.speedAnimOut);

	hideHover(e);
}

function showHouse(e) {
	e.stop().animate({
		fill: config.visualStyles.colorEnd,
		opacity: 1
	}, config.visualStyles.speedAnimInHighlight);
}