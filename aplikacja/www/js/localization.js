//lokalizacja
var dataAddress = 'http://127.0.0.1:8080'
var postData = dataAddress + '/postData'
var localizationString = "";
var Latitude = 0;
var Longitude = 0;

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
        Latitude = 51.1097163;
        Longitude = 17.0614762;

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
    var maxDistance = 10;
    var maxResults = maxDistance * 5;
    $.ajax({
        url: postData, //'http://127.0.0.1:8080/postData'
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify( { "lat":Latitude, "&lng":Longitude, "&maxDistanceKM":maxDistance, "&maxResults":maxResults } ),
        success: function(data){
            console.log(data);
        },
        error: function(a, b, c){
            console.log( JSON.stringify([postData, a, b, c]));
        }
    });
}

function initMap() {

    if (!((Latitude) && (Longitude)))
    {
        Latitude = 0;
        Longitude = 0;
    }
    var location = {lat: Latitude, lng: Longitude};
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: location});
    var marker = new google.maps.Marker({position: location, map: map});
  }

var options = { timeout: 30000, enableHighAccuracy: true };