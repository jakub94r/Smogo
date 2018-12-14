//lokalizacja
var localizationString = "";
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

    document.getElementById("geoState").innerHTML = localizationString;
};

function onError(error) {
    localizationString =
        'code: ' + error.code + "</br>" +
        'message: ' + error.message + "</br>";

    document.getElementById("geoState").innerHTML = localizationString;
}

var options = { timeout: 30000, enableHighAccuracy: true };