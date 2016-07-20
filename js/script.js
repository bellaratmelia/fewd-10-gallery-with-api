
// Declare media item array
var itemArray = [];

// ---------------------------- LIGHTBOX CODES ---------------------------- //

// Declare global current item counter
var counter = 0;

// Declare overlay and its components
var $overlay = $('<div id="overlay"></div>');
var $img = $("<img>");
var $vid = $('<iframe src=""></iframe>');
var $caption = $("<p></p>");
var $prevBtn = $('<i class="fa fa-arrow-circle-left fa-2x" id="btn-prev"></i>');
var $nextBtn = $('<i class="fa fa-arrow-circle-right fa-2x" id="btn-next"></i>');
var $closeBtn = $('<i class="fa fa-times fa-2x" id="btn-close"></i>');

// Append the components to overlay, then append it to html body
$overlay.append($closeBtn);
$overlay.append($img);
$overlay.append($vid);
$overlay.append($prevBtn);
$overlay.append($nextBtn);
$overlay.append($caption);
$("body").append($overlay);

// populate array of object with href, alt text, and type
function populateArray() {
	$(".gallery-item a").each(function() {

		var itemObject = {	itemURL : $(this).attr("href"),
							itemCaption : $(this).children("img").attr("alt"),
							itemType : "image" }; // default type is "image"

		// if it's a video, change the itemType to video
		if ( $(this).hasClass("video") ) {
			itemObject.itemType = "video";
		}

		itemArray.push(itemObject);

	});
}

// function to find img position in array of object based on the img URL
function findItemInArray(arrayOfObj, theURL) {
	for (var i = 0; i < arrayOfObj.length; i++) {
		if (arrayOfObj[i].itemURL === theURL) {
			return i;
		}
	}
}

function getNextItem() {
	// check if counter is at the end. if not, +1
	// else, go back to first image
	if (counter < itemArray.length - 1 && counter >= 0) {
		counter++;
	} else {
		counter = 0;
	}
	updateOverlay();
}

function getPrevItem() {
	// check if counter is at the beginning. if not, -1
	// else, go back to last image.
	if (counter <= itemArray.length - 1 && counter > 0) {
		counter--;
	} else {
		counter = itemArray.length - 1;
	}
	updateOverlay();
}

function updateOverlay() {
	// get the object, setup the image URL & caption based on current counter
	if ( itemArray[counter].itemType === 'video' ) {
		// if it's a video,
		$img.hide();

		$vid.attr("src", itemArray[counter].itemURL);
		$caption.text(itemArray[counter].itemCaption);

		//animate the video a little bit
		$vid.hide();
		$vid.fadeIn(500);

	} else {
		// if it's an image
		$vid.hide();

		$img.attr("src", itemArray[counter].itemURL);
		$caption.text(itemArray[counter].itemCaption);

		// animate the image a little bit
		$img.hide();
		$img.fadeIn();
	}

	// show captions
	$caption.hide();
	$caption.fadeIn();

}

function checkKeyPress(e) {
	if (e.keyCode === 37) {
		// left arrow button
       getPrevItem();
    }
    else if (e.keyCode === 39) {
       // right arrow button
       getNextItem();
    }
}

// on gallery item click function
$(".gallery-item a").click(function(event) {
	event.preventDefault();

	//find image position in array, update the counter
	var itemLocation = $(this).attr("href");
	counter = findItemInArray(itemArray, itemLocation);

	// call function to update overlay
	updateOverlay();

	// Show overlay
	$overlay.fadeIn();
	// console.log(counter);
});

// on close button click function
$closeBtn.click(function() {
	//hide overlay
	$overlay.fadeOut();
});

//on next button click function
$nextBtn.click(function() {
	getNextItem();
});

//on previous button click function
$prevBtn.click(function() {
	getPrevItem();
});

function flickr_display(data) {
	$('.gallery-container').html('');
	var the_html = '';
	$.each(data.items, function(i, photo) {
		the_html += '<div class="gallery-item">';
		the_html += '<a href="' + photo.media.m +'">';
		the_html += '<img src="'+ photo.media.m + '" alt="'+ photo.title + '" />';
		the_html += '</a>';
		the_html += '</div>';
	});

	$('.gallery-container').html(the_html);
}

function spotify_display(data) {
	$('.gallery-container').html('');
	var the_html = '';
	console.log(data);
	$.each(data.tracks.items, function(i, track) {
		the_html += '<div class="gallery-item">';
		the_html += '<a href="' + track.uri +'">';
		the_html += '<img src="'+ track.album.images[0].url + '" alt="'+ track.name + '" />';
		the_html += '</a>';
		the_html += '</div>';
		console.log(track);
	});

	$('.gallery-container').html(the_html);
}

// ---------------------------- DOCUMENT FUNCTION CALLS ---------------------------- //

$(document).ready(function() {
	// populateArray();
	// $(document).keydown(checkKeyPress);

	$('form').submit(function(event) {
		event.preventDefault(event);
		var tag = $('#search').val();

		if ($('#options').val() === 'photos') {
			var flickr_api = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
			var flickr_opts = {
				tags : tag,
				format : 'json'
			};
			$.getJSON(flickr_api, flickr_opts, flickr_display);

		} else {
			var spotify_api = "https://api.spotify.com/v1/search";
			var spotify_opts = {
				q : tag,
    			type : 'track',
    			limit : 20
			};
			$.getJSON(spotify_api, spotify_opts, spotify_display);
		}


  });

});
