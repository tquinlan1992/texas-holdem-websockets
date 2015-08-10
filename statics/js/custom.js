

(function($){

	/* ---------------------------------------------- /*
	 * Preloader
	/* ---------------------------------------------- */
	



	$(document).ready(function() {


		/* ---------------------------------------------- /*
		 * Background image
		/* ---------------------------------------------- */

		$('#intro').backstretch([
			'bg2.jpg',
			'bg3.jpg',
			'bg1.jpg'
		], {duration: 3000, fade: 750});

		/* ---------------------------------------------- /*
		 * Navbar
		/* ---------------------------------------------- */

		$('body').scrollspy({
			target: '.navbar-custom',
			offset: 70
		})

		var navbar = $('.navbar');
		var dropdown_menu = $('#dropdown-menu');
		var navHeight = navbar.height();

		$(window).scroll(function() {
			if($(this).scrollTop() >= navHeight) {
				navbar.addClass('navbar-color');
				dropdown_menu.removeClass('navbar-dropdown-transparent');
			}
			else {
				navbar.removeClass('navbar-color');
				dropdown_menu.addClass('navbar-dropdown-transparent');
			}
		});

		if($(window).width() <= 767) {
			navbar.addClass('custom-collapse');
		}

		$(window).resize(function() {
			if($(this).width() <= 767) {
				navbar.addClass('custom-collapse');
			}
			else {
				navbar.removeClass('custom-collapse');
			}
		});

		/* ---------------------------------------------- /*
		 * Knob Animation
	

		/* ---------------------------------------------- /*
		 * WOW Animation When You Scroll
		/* ---------------------------------------------- */

		wow = new WOW({
			mobile: false
		});
		wow.init();

		/* ---------------------------------------------- /*
		 * Owl slider - (clients, testimonials)
		/* ---------------------------------------------- */

		$("#owl-testimonials").owlCarousel({
			items : 1,
			navigation: true,
			navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
			slideSpeed : 300,
			paginationSpeed : 400,
			autoPlay: 5000,
			singleItem: true
		});

		$("#owl-clients").owlCarousel({
			items : 5,
			pagination: false,
			slideSpeed : 300,
			paginationSpeed : 400,
			autoPlay: 5000
		});


		/* ---------------------------------------------- /*
		 * Contact form ajax
		/* ---------------------------------------------- */

		$("#contact-form").submit(function(e) {

			e.preventDefault();

			var c_name = $("#c_name").val();
			var c_email = $("#c_email").val();
			var c_message = $("#c_message ").val();
			var responseMessage = $('#contact-form .ajax-response');

			if (( c_name== "" || c_email == "" || c_message == "")) {
				responseMessage.fadeIn(500);
				responseMessage.html('<i class="fa fa-warning"></i> Check all fields.');
			}

			else {
				$.ajax({
					type: "POST",
					url: "email",
					dataType: 'json',
					data: {
						c_email: c_email,
						c_name: c_name,
						c_message: c_message
					},
					beforeSend: function(result) {
						$('#contact-form button').empty();
						$('#contact-form button').append('<i class="fa fa-cog fa-spin"></i> Wait...');
					},
					success: function() {
						
							$('#contact-form .ajax-hidden').fadeOut(500);
							responseMessage.html("Your message has been sent, we will get back to you as soon as possible").fadeIn(500);
						
					}
				});
			}

			return false;

		});


	});

})(jQuery);
