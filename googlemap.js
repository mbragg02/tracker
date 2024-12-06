let map;
const infowindow = new google.maps.InfoWindow();
const bounds = new google.maps.LatLngBounds();

function initialize() {
    const myLatlng = new google.maps.LatLng(54.361652, -1.424279);
    const myOptions = {
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
		mapId: "fb2d16842071ada7"
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    jsonparse();
}

function jsonparse() {
    const locations = [];
    $.getJSON('positions.json')
        .done(data => {
            data.forEach(position => {
                const { latitude, longitude, name, normal_name, located_at } = position;
                locations.push([latitude, longitude, name, normal_name, located_at]);
            });
            setMarkers(map, locations);
        })
        .fail((jqxhr, textStatus, error) => {
            console.error("Request Failed: " + textStatus + ", " + error);
        });
}

function setMarkers(map, locations) {
    const polylinearray = [];
    locations.forEach(position => {
        const [lat, lng, name, address, located_at] = position;
        const positionLatLng = new google.maps.LatLng(lat, lng);
        polylinearray.push(positionLatLng);
        const marker = createMarker(map, positionLatLng, name, address, located_at);
        bounds.extend(positionLatLng);
        map.fitBounds(bounds);
    });

    const bikeroute = new google.maps.Polyline({
        path: polylinearray,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    bikeroute.setMap(map);
}

function createMarker(map, myLatLng, name, address, located_at) {
    const dt = new Date(located_at);
    const y = dt.getFullYear();
    const m = dt.getMonth() + 1;
    const d = dt.getDate();
    const formattedDate = `${y}-${m}-${d}`;

    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: myLatLng,
        map: map,
        title: `${name}\n${address}\n${formattedDate}`
    });

    google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(`<div><strong>${name}</strong><br>${address}<br>${formattedDate}</div>`);
        infowindow.open(map, marker);
    });

    return marker;
}
