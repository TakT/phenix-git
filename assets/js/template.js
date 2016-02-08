jQuery(document).ready(function($) {

	var windowWidth = jQuery(window).width(),
		headerWidth = jQuery('#header .container').width(),
		fullscreenPage = jQuery('.fullscreen__page'),
		fullscreenMenuInit = false;

	calFirstScreen(windowWidth);
	calcInnerPageBg(jQuery(window).height());

	fullscreenPage.find('.fullscreen__menu a, .fullscreen__menu-close a').on('click', function(event) {

		fullscreenPage.find('.fullscreen__header').slideToggle(400, function() {
			fullscreenPage.toggleClass('fullscreen__header-active');
			if (!fullscreenMenuInit) {
				calcSubNavPosition(windowWidth);
				fullscreenMenuInit = true;
			};
		});

	});

	jQuery('body').on('click', '.params .param__items-cheked .param__item a', function(event) {
		event.preventDefault();
		jQuery(this).toggleClass('active');
	});

	jQuery('body').on('click', '.js-level_changer .level', function(event) {
		event.preventDefault();

		jQuery(this).parents('.js-level_changer').children('.level.active').removeClass('active');
		jQuery(this).toggleClass('active');
	});

	jQuery('body').on('click', '.js-change-area svg path', function(event) {
		event.preventDefault();

		// jQuery(this).parents('svg').children('path.cls-2.active').removeClass('active');
		// console.log(jQuery(this).parents('svg').find('path + path').attr('class'), jQuery(this).parents('svg').find('path + path').attr('class').length);

		var paths = jQuery(this).parents('svg').find('path');
		for (var i = 0; i < paths.length; i++) {
			var path = jQuery(paths[i]);
			if (path.attr('class').length > 5) {
				path.attr('class', 'cls-1');
			};
		};

		jQuery(this).parents('svg').children('path').attr('class');
		jQuery(this).attr('class', 'cls-1 active');
	});

	jQuery('#content').on('click', '.js-news-readmore', function(event) {
		var newsItem = jQuery(this).parents('.news__item');
		toggleNews(newsItem);
	});

	jQuery('#content').on('click', '.js-content__news-item .js-close', function(event) {
		var newsItem = jQuery(this).parents('#content').find('.news__item');
		toggleNews(newsItem);
	});

	jQuery('#gallery').on('click', '.slider-nav .nav__item', function(event) {
		jQuery(this).parents('.slider-nav').find('.nav__item.active').removeClass('active');
		jQuery(this).addClass('active');
	});

	jQuery('#gallery').on('click', '.slider-categories li a', function(event) {
		var a = jQuery(this),
			cid = a.data('cid');

		gallery_slider_nav.slick('slickUnfilter');

		// gallery_slider_nav.find('.slick-current').removeClass('slick-current');

		if (a.hasClass('active')) {
			a.removeClass('active');
			gallery_slider.slick('slickGoTo', 0);
			gallery_slider_nav.find('.active').removeClass('active');
		} else {
			gallery_slider_nav.find('.active').removeClass('active');
			a.parents('.slider-categories').find('a.active').removeClass('active');
			a.addClass('active');
			gallery_slider_nav.slick('slickFilter', '[data-cid="' + cid + '"]');
			gallery_slider.slick('slickGoTo', gallery_slider_nav.get(0).slick.$slides.filter(':first').data('slickIndex'));
		}

	});

	jQuery('.js-to-top').on('click', function(event) {
		jQuery('body, html').animate({
			scrollTop: 0
		}, 400);
		return false;
	})

	var navigation = jQuery('#navigation'),
		indexslider = jQuery('#indexslider');
	var toTop = jQuery('.to-top-wrapper');
	var scrollTop = 0,
		indexsliderInitHeight = indexslider.height();

	jQuery(window).on('scroll', function(event) {
		scrollTop = jQuery(this).scrollTop();
		if (scrollTop > 300) {
			toTop.fadeIn();
		} else {
			toTop.fadeOut();
		}

		if (scrollTop > 148) {
			navigation.css({
				position: 'fixed',
			});
			if (indexslider.length > 0) {
				indexslider.css('height', indexsliderInitHeight + 48);
			};
		} else if (scrollTop <= 195) {
			navigation.css({
				position: 'relative',
			});
			if (indexslider.length > 0) {
				indexslider.css('height', indexsliderInitHeight);
			};
		}
	});

	function toggleNews(newsItem) {
		var content = newsItem.parents('#content'),
			newsContent = content.find('.js-content__news-item');

		if (newsItem.hasClass('active')) {
			newsItem.removeClass('active');
			newsContent.removeClass('active');

			content__news.slick('slickSetOption', 'slidesToShow', 3, true);
			content__news.slick('slickSetOption', 'slidesToScroll', 3, true);

			content.find('.content__news-wrapper').removeClass('content__news-cols-1');
			content.find('.content__news-wrapper').addClass('content__news-cols-3');
		} else {
			newsItem.parents('#content').find('.news__item').removeClass('active');
			newsItem.addClass('active');
			newsContent.addClass('active');

			content__news.slick('slickSetOption', 'slidesToShow', 1, true);
			content__news.slick('slickSetOption', 'slidesToScroll', 1, true);

			content.find('.content__news-wrapper').removeClass('content__news-cols-3');
			content.find('.content__news-wrapper').addClass('content__news-cols-1');

			content__news.slick('slickGoTo', newsItem.parents('.news__col').data('slickIndex'));
		}
	}
});

jQuery(window).on('resize', function(event) {
	var windowWidth = jQuery(window).width();

	calcInnerPageBg(jQuery(window).height());
	calFirstScreen(windowWidth);

	if (jQuery('.fullscreen__page').length == 0) {
		calcSubNavPosition(windowWidth);
	}
});

jQuery(window).on('load', function(event) {
	if (jQuery('.fullscreen__page').length == 0) {
		calcSubNavPosition(jQuery(window).width());
	}
});

function calcInnerPageBg(windowHeight) {
	var height = windowHeight - (windowHeight / 3);
	var headerBg = jQuery('#header-bg');
	var bgImg = headerBg.find('.bg-img img');

	if (headerBg.length > 0) {
		var cssProperties = {
			'height': height,
		};

		if (jQuery(window).width() <= 1276) {
			height = 575;
			var left = (jQuery(window).width() - bgImg.get(0).naturalWidth) / 2;

			bgImg.css({
				width: 'auto',
				maxWidth: 'none',
				left: left,
			});
		}
		if (jQuery(window).width() > 1276 && bgImg.css('left') != 'auto') {
			bgImg.css({
				width: '100%',
				maxWidth: '100%',
				left: 'auto',
			});
		}
		headerBg.css(cssProperties);
	};
}

function calcSubNavPosition(windowWidth) {
	jQuery('#navigation ul li .navigation__sub').each(function(index, el) {
		var $this = jQuery(el);
		$this.css('width', 'auto');
		$this.width(windowWidth - $this.offset().left);
		$this.css('left', $this.parents('li').find('> a').get(0).offsetLeft);
	});
}

function gcd(a, b) {
	return (b == 0) ? a : gcd(b, a % b);
}

function calFirstScreen(windowWidth) {
	var headerWidth = jQuery('#header .container').width(),
		height = jQuery(window).height(),
		gallery = jQuery('#gallery');
	// var gcdValue = gcd(windowWidth, height);
	var origintalRatio = 1366 / 768;

	var heightScreen = height;
	if (heightScreen <= 668) {
		heightScreen = 668;
	};

	jQuery('#indexslider, #gallery, #indexslider .slider__bg, #indexslider .indexslider__wrapper').css({
		height: heightScreen,
	});
	jQuery('#indexslider').css({
		height: heightScreen - 195,
	});

	if (gallery.length > 0) {
		var sliderItem = gallery.find('.indexslider__wrapper .slider__wrapper .slider__item');

		sliderItem.find('img').css({
			height: heightScreen,
		});
		sliderItem.css({
			height: heightScreen,
		});
	};
}