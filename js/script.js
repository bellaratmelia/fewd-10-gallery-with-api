
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


// ---------------------------- SEARCH FILTER CODES ---------------------------- //

// everytime user type in a character on the search box,
// hide all items first and then
// find item whose alt contains those characters and then
// show these items

var $items = $(".gallery-item"); // basically grab all elements that fits the requirements

$("#user-search").keyup(function() {
	var term = $.trim($(this).val()).toLowerCase();

		//hide everything first
		// $items.hide().addClass("hide").filter(function() {
		$items.each(function(){
			// get the caption text
			var altText = $(this).children("a").children("img").attr("alt").toLowerCase();

			// check whether if term contained inside the caption text
	        if (altText.indexOf(term) > -1) {
	        	$(this).removeClass("hide").fadeIn(); // show elements that fulfil the search criteria 
	        } else {
	        	$(this).fadeOut().addClass("hide");
	        }

		});
	// }
});


// ---------------------------- DOCUMENT FUNCTION CALLS ---------------------------- //
populateArray();
document.onkeydown = checkKeyPress;





