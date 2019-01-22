//lokalizacja
var dataAddress = 'http://192.168.43.147:8080'
var postData = dataAddress + '/getNearStations'
var localizationString = "";
var latitude = 51.1082584;
var longitude = 17.0652491;
var nearStationsList = [];

var onSuccess = function (position) {
    document.getElementById("geoState").innerHTML = "loading";
    localizationString =
        'Latitude: ' + position.coords.latitude + "</br>" +
        'Longitude: ' + position.coords.longitude + "</br>" +
        'Altitude: ' + position.coords.altitude + "</br>" +
        'Accuracy: ' + position.coords.accuracy + "</br>" +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + "</br>" +
        'Heading: ' + position.coords.heading + "</br>" +
        'Speed: ' + position.coords.speed + "</br>" +
        'Timestamp: ' + position.timestamp + "</br>";
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    document.getElementById("geoState").innerHTML = localizationString;
};

function onError(error) {
    localizationString =
        'code: ' + error.code + "</br>" +
        'message: ' + error.message + "</br>";

    document.getElementById("geoState").innerHTML = localizationString;
}

//lat=50.062006&lng=19.940984&maxDistanceKM=5&maxResults=3
function sendLocationToServer() {
    var stationExists = false;
    var maxDistance = 15;
    var maxResults = maxDistance * 5;
    $.ajax({
        url: [postData, latitude, longitude, maxDistance, maxResults].join("/"), //'http://127.0.0.1:8080/postData'
        type: 'GET',
        crossDomain: true,
        contentType: 'application/json',
        success: function (data) {
            data.forEach(function (item, index) {
                for (var i in nearStationsList) {
                    if (nearStationsList[i].id == item.id) {
                        stationExists = true;
                        break;
                    }
                }
                if (stationExists == false) {
                    var currentStation = { "id": item.id, "lat": item.location.latitude, "lng": item.location.longitude, "address": item.address, "sponsor": item.sponsor };
                    nearStationsList.push(currentStation);
                }
                stationExists = false;
            });
            console.log(nearStationsList);
        },
        error: function (a, b, c) {
            console.log(JSON.stringify([postData, a, b, c]));
        }
    });
}

function initMap() {

    if (!((latitude) && (longitude))) {
        latitude = 0;
        longitude = 0;
    }

    var location = { lat: latitude, lng: longitude };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 4, center: location });
    var marker = new google.maps.Marker({ position: location, map: map });
}

function addStationsToMap() {
    var center = { lat: latitude, lng: longitude };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: center
    });
    var marker = new google.maps.Marker({
        position: center,
        map: map
    });

    var infowindow = new google.maps.InfoWindow({});
    var marker, count;
    for (count = 0; count < nearStationsList.length; count++) {

        var currentColor = colorTableEnum.medium;
        if ((count % 13) == 0) {
            var currentColor = colorTableEnum.verybad;
        }
        if ((count % 3) == 0) {
            var currentColor = colorTableEnum.bad;
        }

        var innerCircle = new google.maps.Circle({
            strokeWeight: 0,
            fillColor: currentColor,
            fillOpacity: 0.4,
            map: map,
            center: { lat: nearStationsList[count].lat, lng: nearStationsList[count].lng },
            radius: 300
        });

        var middleCircle = new google.maps.Circle({
            strokeWeight: 0,
            fillColor: currentColor,
            fillOpacity: 0.3,
            map: map,
            center: { lat: nearStationsList[count].lat, lng: nearStationsList[count].lng },
            radius: 800
        });

        var outerCircle = new google.maps.Circle({
            strokeWeight: 0.8,
            strokeColor: currentColor,
            strokeOpacity: 0.2,
            fillColor: currentColor,
            fillOpacity: 0.15,
            map: map,
            center: { lat: nearStationsList[count].lat, lng: nearStationsList[count].lng },
            radius: 1300
        });
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(nearStationsList[count].lat, nearStationsList[count].lng),
            map: map,
            icon: {
                path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
                fillColor: currentColor,
                fillOpacity: 0.7,
                scale: 4,
                strokeColor: currentColor,
                strokeWeight: 1
            },
            title: "Stacja"
        });
        google.maps.event.addListener(marker, 'click', (function (marker, count) {
            return function () {
                var stationDescription = nearStationsList[count].address.city + ", " + nearStationsList[count].address.street + " ";
                if (nearStationsList[count].address.number != null) {
                    stationDescription += nearStationsList[count].address.number;
                }
                sponsorDescription = nearStationsList[count].sponsor.name;

                infowindow.setContent(stationDescription + "<br />" + "Sponsor: " + nearStationsList[count].sponsor.name + "<br />" + "<div style='float:left'><img src='" + nearStationsList[count].sponsor.logo + "' style='max-width:50%; max-height:50%;'></div>");
                infowindow.open(map, marker);
            }
        })(marker, count));
    }
}

var options = { timeout: 30000, enableHighAccuracy: true }