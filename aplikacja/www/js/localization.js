//lokalizacja
var localizationString = "";
var Latitude;
var Longitude;

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
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;

    document.getElementById("geoState").innerHTML = localizationString;
};

function onError(error) {
    localizationString =
        'code: ' + error.code + "</br>" +
        'message: ' + error.message + "</br>";

    document.getElementById("geoState").innerHTML = localizationString;
}

function initMap() {

    if (!((Latitude) && (Longitude)))
    {
        Latitude = 0;
        Longitude = 0;
    }
    var location = {lat: Latitude, lng: Longitude};
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 12, center: location});
    var marker = new google.maps.Marker({position: location, map: map});
  }

var options = { timeout: 30000, enableHighAccuracy: true };