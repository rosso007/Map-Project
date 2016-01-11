//Attractions are created using the Attraction model and stored in the attactions array.
var attractions = [];
var Attraction = function(name, url, lat, lng, address, city, country, rating) {
	this.name = name;
	this.url = url;
	this.lat = lat;
	this.lng = lng;
	this.address = address;
	this.city = city;
	this.country = country;
	this.rating = rating;
}

function ViewModel() {
	//Error handling for google maps.
	if (typeof google === 'undefined' || google === null) {
		googleError()
	} else {
		function datestring() {
			//used to generated the date for the request URL with foursquare.
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd
			}
			if (mm < 10) {
				mm = '0' + mm
			}
			today = yyyy + mm + dd;
			return today;
		}
		var self = this;
		var map;
		var mapLocation;
		//Foursquare API request variables.
		var foursquareClientId = "K0R1ICQPTNSLDHJMIGCS3BJ4WDBLWEWWI5CJ0GANLJR3H3NY";
		var foursquareClientSecret = "OCVJ4QCILOMGPVH5EPOAL1BV1EEIDIVIVJN4UKJ4UA5ZKQ1Q";
		var foursquareDate = datestring();
		var foursquareLocation = 'Wellington, NZ'
		var foursquareSection = "topPicks";
		var foursquareUrl = "https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&client_id=" + foursquareClientId + "&client_secret=" + foursquareClientSecret + "&v=" + foursquareDate + "&near=" + foursquareLocation + "&section=" + foursquareSection;
		var foursquareVenues = [];
		//markerList is used to store all markers. matchedMarkers stores the markers which are visible within the list view on screen.
		self.markerList = ko.observableArray([]);
		self.matchedMarkers = ko.observableArray([]);
		self.query = ko.observable('').extend({
			rateLimit: {
				timeout: 1000,
				method: "notifyWhenChangesStop"
			}
		});
		// The search function filters the markers.
		self.search = ko.computed(function() {
			var resultsList = ko.utils.arrayFilter(self.matchedMarkers(), function(marker) {
				var result = marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
				if (result === false) {
					marker.setMap(null);
				} else {
					marker.setMap(map)
				}
				return result;
			});
			return resultsList;
		});
		var infowindow;
		var toggleAnimation;
		// InfowindowGenerator function creates the HTML used to populate the infowindow.
		function infowindowGenerator(name, url, address, city, country, rating) {
			var content = '<div>' + '<h4>' + name + '</h4>' + '<h4>Rating: ' + rating + '</h4>' + '<h6>Address: ' + address + '</h6>' + '<h6>City: ' + city + '</h6>' + '<h6>Country: ' + country + '</h6>' + '</div>'
			return content;
		};
		// setInfoWIndow function changes the infowindow to the clicked marker.
		self.setInfoWindow = function(clickedattraction) {
			var index = self.markerList.indexOf(clickedattraction);
			toggleAnimation(self.markerList()[index]);
		}
		// google maps initialize function.
		function initialize() {
			mapLocation = new google.maps.LatLng(-41.3, 174.79);
			map = new google.maps.Map(document.getElementById('map'), {
				center: mapLocation,
				zoom: 13
			});
			infowindow = new google.maps.InfoWindow({});
			//Foursquare ajax request with success and error handling.
			$.ajax({
				url: foursquareUrl,
				dataType: 'json',
				// The success function stores the returned vanues within the foursquarevenues array. Then for each venue, it creates and attraction object. Then for each attraction with will create the marker and content.
				success: function(data) {
					data.response.groups[0].items.forEach(function(item) {
						foursquareVenues.push(item.venue);
					})
					foursquareVenues.forEach(function(venue) {
						var attraction = new Attraction(venue.name, venue.url, venue.location.lat, venue.location.lng, venue.location.address, venue.location.city, venue.location.country, venue.rating);
						attractions.push(attraction);
					});
					attractions.forEach(function(markerItem) {
						var content = infowindowGenerator(markerItem.name, markerItem.url, markerItem.address, markerItem.city, markerItem.country, markerItem.rating);
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(markerItem.lat, markerItem.lng),
							map: map,
							animation: google.maps.Animation.DROP,
							title: markerItem.name,
							content: content
						});
						marker.addListener('click', function() {
							toggleAnimation(marker);
						});
						toggleAnimation = function(marker) {
							self.markerList().forEach(function(marker) {
								marker.setAnimation(null)
							})
							marker.setAnimation(google.maps.Animation.BOUNCE);
							infowindow.open(map, marker);
							infowindow.setContent(marker.content);
						}
						self.markerList.push(marker);
						self.matchedMarkers.push(marker);
					})
				},
				error: function() {
					apiError("Foursquare");
				}
			});
			// resizes the google map on browser window change.
			google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});
		}
		initialize();
	}
}
// wrapper function to hide the error message container and create the viewmodel instance + apply bindings for knockout.
function init() {
	$('#map-error').hide();
	var viewModel = new ViewModel();
	ko.applyBindings(viewModel);
}
// generic API error message to handle errors for both google maps and foursquare in a consistent manner.
function apiError(api) {
	$('#map').hide();
	$('#list').hide();
	$('#map-error').html('<h5>There was problem retrieving map information from ' + api + '.<br>' + api + ' is working on this... probably. <br>Take a break and try later. :)</h5>');
}