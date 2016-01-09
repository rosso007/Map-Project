var initialMarkers = [
	{ 
			"name": "Museum Art Hotel",
			"place_id": "ChIJPUUrP9CvOG0R0Q2eyhDNe2g",
			"position": {
				"lat": -25.363, 
				"lng": 131.044
			}
		}, {
			"name": "Museum of New Zealand Te Papa Tongarewa",
			"place_id": "ChIJnRaYrdGvOG0RMJot6PyfQJo",
			"position": {
				"lat": -41.290404, 
				"lng": 174.782092
			}
		}, {
			"name": "St James Theatre",
			"place_id": "ChIJHX9AddqvOG0RjRLfnBMstG4",
			"position": {
				"lat": -41.292938, 
				"lng": 174.779664
			}
		}, {
			"name": "Embassy Theatre",
			"place_id": "ChIJ41LdS8WvOG0RCsV2BBbXH1A",
			"position": {
				"lat": -41.294111, 
				"lng": 174.784015
			}
		}, {
			"name": "Hotel St George",
			"place_id": "ChIJP2MAP9avOG0RBzRY4hOj7A0",
			"position": {
				"lat": -41.289008, 
				"lng": 174.774589
			}
		}, {
			"name": "Bodega",
			"place_id": "ChIJ46za_tevOG0RxIvfK4qnTjo",
			"position": {
				"lat": -41.292485, 
				"lng": 174.773183
			}
		}, {
			"name": "Amora Hotel Wellington",
			"place_id": "ChIJE6zu0NCvOG0RW__QOaEimhU",
			"position": {
				"lat": -41.290809, 
				"lng": 174.778961
			}
		}
]

function ViewModel() {
	var self = this;
	var map;
	var mapLocation;

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

	function initialize() {
		mapLocation = new google.maps.LatLng(-41.2912176, 174.7784507);
	    map = new google.maps.Map(document.getElementById('map'), {
	      center: mapLocation,
	      zoom: 14,
	    });

	    initialMarkers.forEach(function(markerItem){

			var marker = new google.maps.Marker({
	          position: new google.maps.LatLng(markerItem.position),
	          map: map,
	          title: markerItem.name
			});

			self.markerList.push(marker);
			self.matchedMarkers.push(marker);

	  	})

	}
	google.maps.event.addDomListener(window, 'load', initialize); 
}



var viewModel = new ViewModel();
ko.applyBindings(viewModel);




/*
	  	var service = new google.maps.places.PlacesService(map);
	  	service.getDetails({
	    placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
	  	}, function(place, status) {
	    if (status === google.maps.places.PlacesServiceStatus.OK) {
	      var marker = new google.maps.Marker({
	        map: map,
	        position: place.geometry.location
	      });
	      google.maps.event.addListener(marker, 'click', function() {
	        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
	          'Place ID: ' + place.place_id + '<br>' +
	          place.formatted_address + '</div>');
	        infowindow.open(map, this);
	      });
*/