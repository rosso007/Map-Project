var attractions = [];

var Attraction = function(name,url,lat,lng,address,city,country,rating) {
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
	var self = this;
	var map;
	var mapLocation;
	var foursquareClientId = "K0R1ICQPTNSLDHJMIGCS3BJ4WDBLWEWWI5CJ0GANLJR3H3NY";
	var foursquareClientSecret = "OCVJ4QCILOMGPVH5EPOAL1BV1EEIDIVIVJN4UKJ4UA5ZKQ1Q";
	var foursquareDate = "20160110"
	var foursquareLocation = 'Wellington, NZ'
	var foursquareSection = "topPicks";
	var foursquareUrl = "https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&client_id=" + foursquareClientId + "&client_secret=" + foursquareClientSecret + "&v=" + foursquareDate + "&near=" + foursquareLocation + "&section=" + foursquareSection;
	var foursquareVenues = [];
	self.markerList = ko.observableArray([]);
	self.matchedMarkers = ko.observableArray([]);
	self.query = ko.observable('').extend({
		rateLimit: {
		timeout: 1000,
		method: "notifyWhenChangesStop"
		}
	});

	self.search = ko.computed(function(){ 
    	var resultsList = ko.utils.arrayFilter(self.matchedMarkers(), function(marker){
    		var result = marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0; 
    		if (result === false) {
    		marker.setMap(null); 
    		} else {marker.setMap(map)} 
    		return result;
    	});
    	return resultsList;
  	});
	
	var infowindow;
	self.setInfoWindow = function(clickedattraction) {
		console.log(clickedattraction);
		var index = self.markerList.indexOf(clickedattraction);
		console.log(index);
		infowindow.open(map, self.markerList()[index]);
		infowindow.setContent(self.markerList()[index].title);

	} 	

	function initialize() {
		mapLocation = new google.maps.LatLng(-41.2912176, 174.7784507);
	    map = new google.maps.Map(document.getElementById('map'), {
	    	center: mapLocation,
	    	zoom: 14
	    });
	    infowindow = new google.maps.InfoWindow({});

	    $.getJSON(foursquareUrl, function(data) {
	    	
	    	data.response.groups[0].items.forEach(function (item){
	    		foursquareVenues.push(item.venue);
	    	})

	    	foursquareVenues.forEach(function(venue) { 
	   			var attraction = new Attraction(venue.name,venue.url,venue.location.lat,venue.location.lng,venue.location.address,venue.location.city,venue.location.country,venue.rating);	   		
	   			attractions.push(attraction);
	   		});

	    	attractions.forEach(function(markerItem) {
	    		var marker = new google.maps.Marker({
	          	position: new google.maps.LatLng(markerItem.lat,markerItem.lng),
	          	map: map,
	          	title: markerItem.name

			});
	    	marker.addListener('click', function() {
    			infowindow.open(map, marker);
    			infowindow.setContent(marker.title);
  			});

			self.markerList.push(marker);
			self.matchedMarkers.push(marker);

	  		})
	    });
	}



	google.maps.event.addDomListener(window, 'load', initialize); 
}
var viewModel = new ViewModel();
ko.applyBindings(viewModel);