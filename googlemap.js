var map;
var infowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

function initialize() {
	var myLatlng = new google.maps.LatLng(54.361652,-1.424279);
	var myOptions = {
		 // zoom: 3,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	jsonparse();
}

function jsonparse() {
	var locations = new Array(); 
	$.getJSON('positions.json', function(data){ 
	//	console.log(data)
    $.each(data, function(i, position){ 	
		var lat = data[i].latitude;
		var lng = data[i].longitude;
		var name = data[i].name;
		var address = data[i].normal_name;
		var located_at = data[i].located_at
		locations.push([lat,lng, name, address, located_at]);
	});
	setMarkers(map, locations);
 // console.log(locations)
	});
}

function setMarkers(map, locations) {
	var polylinearray =[];
	for (var i = 0; i < locations.length; i++) {
		var position = locations[i];		
		var positionLatLng = new google.maps.LatLng(position[0], position[1]);
		polylinearray.push(positionLatLng);
		var marker = createMarker(map, positionLatLng, position[2], position[3], position[4]);
		bounds.extend(positionLatLng);
		map.fitBounds(bounds);		
	}
//	console.log(polylinearray);
	var bikeroute = new google.maps.Polyline({
	    path: polylinearray,
	    strokeColor: "#FF0000",
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	  });
	bikeroute.setMap(map);
}

function createMarker(map, myLatLng, name, address, located_at) {
	var dt = new Date(located_at);
	var y = dt.getFullYear()
	var m = dt.getMonth() + 1;
	var d = dt.getDate()
	//console.log(d)
	var contentString = '<b>'+name+'</b><br />'+address+'<br />Located on: '+d+'-'+m+'-'+y+'</div>';	

	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: name
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(contentString);
		infowindow.open(map, marker);
	});
}