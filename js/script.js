// ---------------------------- VARS ---------------------------- //
// Declare media item array
var item_array = [];

// Declare global current item counter
var counter = 0;

// Get overlay and its components
var $overlay = $('#overlay');
var $overlay_content = $('#overlay-content');
var $img = $("#overlay img");
var $title = $('#title');
var $date_or_album = $('#date-or-album');
var $user = $('#user');
var $linktofile = $('#linktofile');
var $prev_btn = $('#btn-prev');
var $next_btn = $('#btn-next');

// Sort buttons
var $sort_container = $('.buttons-container');
var $name_sort = $('#sort-name');
var $artist_sort = $('#sort-artist');
var $date_sort = $('#sort-date');


// ---------------------------- FUNCTIONS ---------------------------- //
function disable_form_elems() {
	$('#btn-search').val('Searching...');
	$('#search').prop('disabled', true);
	$('#options').prop('disabled', true);
}

function enable_form_elems() {
	$('#btn-search').val('SEARCH');
	$('#search').prop('disabled', false);
	$('#options').prop('disabled', false);
}

function flickr_response(data) {
	process_response(data, 'Flickr');
}

function spotify_response(data) {
	process_response(data, 'Spotify');
}

function process_response(data, source) {
	// clear item_array data
	item_array = [];

	if (source === 'Spotify') {
		$.each(data.tracks.items, function(i, track) {
			var item_object = {	image : track.album.images[1].url,
								title : track.name,
								date_or_album : track.album.name,
								user : track.artists[0].name,
								linktofile : track.external_urls.spotify,
								source : 'Spotify',
								id : i
							};

			item_array.push(item_object);
		});
	} else if (source === 'Flickr') {
		$.each(data.items, function(i, photo) {
			var item_object = {	image : photo.media.m,
								title : photo.title,
								date_or_album : photo.published,
								user : photo.author,
								linktofile : photo.link,
								source : 'Flickr',
								id : i
							};

			item_array.push(item_object);
		});
	}

	// UPDATE THE GALLERY
	update_gallery();

}

function get_next_item() {
	// check if counter is at the end. if not, +1
	// else, go back to first image
	if (counter < item_array.length - 1 && counter >= 0) {
		counter++;
	} else {
		counter = 0;
	}
	update_overlay();
}

function get_prev_item() {
	// check if counter is at the beginning. if not, -1
	// else, go back to last image.
	if (counter <= item_array.length - 1 && counter > 0) {
		counter--;
	} else {
		counter = item_array.length - 1;
	}
	update_overlay();
}

function update_overlay() {

	$img.attr("src", item_array[counter].image);
	$title.html(item_array[counter].title);
	if (item_array[counter].source === 'Spotify') {
		$date_or_album.html('From the album: <strong>' + item_array[counter].date_or_album + '</strong>');
	} else {
		$date_or_album.html('Published on: <strong>' + item_array[counter].date_or_album) + '</strong>';
	}
	$user.html('By <strong>' + item_array[counter].user + '</strong>');
	$linktofile.attr("href", item_array[counter].linktofile);
	$linktofile.text('View in ' + item_array[counter].source);

	// show
	$overlay.show();
	$overlay_content.fadeIn();

}

function update_gallery() {
	$('.gallery-container').empty();
	var the_html = '';
	var source = '';

	// Display the items inside item_array
	$.each(item_array, function(i, item) {
		the_html += '<div class="gallery-item">';
		the_html += '<a href="' + item.linktofile +'">';
		the_html += '<img src="'+ item.image + '" alt="'+ item.title + '" title="' + item.title +'" id="' + item.id + '"/>';
		the_html += '</a>';
		the_html += '</div>';
		source = item.source;
	});

	$('.gallery-container').html(the_html);

	// Show and hide the appropriate sort buttons;
	$sort_container.show();
	$name_sort.show();
	if (source === 'Flickr') {
		$date_sort.show();
		$artist_sort.hide();
	} else {
		$date_sort.hide();
		$artist_sort.show();
	}

	// enable the search form elements
	enable_form_elems();
}

function on_keypress(e) {
	if (e.keyCode === 37) {
		// left arrow button
       get_prev_item();
    }
    else if (e.keyCode === 39) {
       // right arrow button
       get_next_item();
    }
}

// Sort function to sort by name
function compare_name(a, b) {
  	if (a.name < b.name) {
		return -1;
	} else if (a.name > b.name) {
		return 1;
	} else {
		return 0;
	}
}

// Sort function to sort by artist
function compare_artist(a, b) {
  	if (a.user < b.user) {
		return -1;
	} else if (a.user > b.user) {
		return 1;
	} else {
		return 0;
	}
}

function compare_date(a, b) {
  	if (a.date_or_album < b.date_or_album) {
		return -1;
	} else if (a.date_or_album > b.date_or_album) {
		return 1;
	} else {
		return 0;
	}
}

// ---------------------------- EVENT TRIGGERS ---------------------------- //

// on gallery item click function
$( ".gallery-container" ).on( "click", ".gallery-item", function(event) {
// $(".gallery-item").click(function(event) {
	event.preventDefault();

	//find image position in array, update_or_album the counter
	var $img = $('img');
	counter = $(this).find($img).attr("id");

	// call function to update_or_album overlay
	update_overlay();

	// Show overlay
	$overlay.fadeIn();
});

//on next button click function
$next_btn.click(function() {
	event.stopPropagation();
	get_next_item();
});

//on previous button click function
$prev_btn.click(function() {
	event.stopPropagation();
	get_prev_item();
});

// on close button click function
$overlay.click(function() {
	//hide overlay
	$overlay.fadeOut();
});

$name_sort.click(function(event) {
	event.preventDefault(event);

	// sort items
	item_array.sort(compare_name);

	// update gallery
	update_gallery();

	// remove and add the appropriate classes
	$('.sort-button').removeClass('active');
	$(this).addClass('active');
});

$artist_sort.click(function(event) {
	event.preventDefault(event);

	// sort items
	item_array.sort(compare_artist);

	// update gallery
	update_gallery();

	// remove and add the appropriate classes
	$('.sort-button').removeClass('active');
	$(this).addClass('active');
});

$date_sort.click(function(event) {
	event.preventDefault(event);

	// sort items
	item_array.sort(compare_date);

	// update gallery
	update_gallery();

	// remove and add the appropriate classes
	$('.sort-button').removeClass('active');
	$(this).addClass('active');
});

$(document).ready(function() {
	$overlay.hide();
	$sort_container.hide();

	$('form').submit(function(event) {
		event.preventDefault(event);

		// disable form elements
		disable_form_elems();

		// get the search term
		var tag = $('#search').val();

		// Based on the options chosen, send request to the source
		if ($('#options').val() === 'photos') {
			var flickr_api = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
			var flickr_opts = {
				tags : tag,
				format : 'json'
			};
			$.getJSON(flickr_api, flickr_opts, flickr_response);

		} else {
			var spotify_api = "https://api.spotify.com/v1/search";
			var spotify_opts = {
				q : tag,
    			type : 'track',
    			limit : 20
			};
			$.getJSON(spotify_api, spotify_opts, spotify_response);
		}
	});

	$(document).keydown(on_keypress);

});
