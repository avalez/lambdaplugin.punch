var scrollToTop = function(event) {
	var el = $(event.target.attributes['href']);
	$("html, body").animate({
		scrollTop: el.offset().top + "px"
	}, {
		duration: 400,
		easing: "swing"
	});
	return false;
}

$(function() {
	$('a.back-to-top').live('click', scrollToTop);

    function el(event) {
	    return event.target.localName == 'span' ?
	        $(event.target) : $('span', event.target);
    }

	$('h3').live('mouseleave', function(event) {
		el(event).hide();
	}).live('mouseenter', function(event) {
		el(event).show();
	})

    $('#slider').nivoSlider();

});

