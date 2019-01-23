/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var dataAddress = 'http://192.168.43.2:8080'
var latitude = 51.1082584;
var longitude = 17.0652491;

function getRanking(order, limit, page=0, notEmpty=0)
{
	return [dataAddress, "getStationRanking", order, limit, notEmpty, page].join("/");
}

function getNearStations(lat, long, radius=50, limit=100)
{
	return [dataAddress, "getNearStations", lat, long, radius, limit].join("/");
}	

function getLocationInfo(lat, long)
{
	return [dataAddress, "getLocationAirInfo", lat, long].join("/");
}

function getMyLocationInfo()
{
	return getLocationInfo(latitude, longitude);
}

var statusColors = {
    0: "rgb(0, 102, 0)",
    1: "rgb(0, 197, 5)",
    2: "rgb(228, 177, 0)",
    3: "rgb(255, 127, 77)",
    4: "rgb(220, 0, 0)",
	5: "rgb(139, 0, 0)",
	6: "rgb(0, 0, 0)"
};

function displayChart(data, chartLabel="", chartId="myChart")
{
	var maxChart = 300;
	var minChart = 0;

	$("canvas#"+chartId+"").remove();
	$("div#canvasDiv").empty();
	$("div#canvasDiv").append('<canvas id="'+chartId+'" class="chart mx-auto"></canvas>');

	chartLabels = [];
	values = [];
	barHeights = [];
	borderColor = [];
	barColors = [];
	percentage = [];

	$.each(data, 
		function (i, measureData)
		{
			console.log(measureData);
			values.push(measureData.value);
			barHeights.push(Math.max(Math.min(measureData.percentage, maxChart), minChart));
			chartLabels.push(measureData.name);
			percentage.push(measureData.percentage.toFixed(2));
			barColors.push(
				statusColors[measureData.airIndex].replace(")", ", 0.8)").replace("(", "a(")
			);
			borderColor.push(
				statusColors[measureData.airIndex].replace(")", ", 1)").replace("(", "a(")
			);
		}
	);

	var ctx = document.getElementById(""+chartId+"").getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: chartLabels,
			datasets: [{
				label: "legenda",
				data: barHeights,
				backgroundColor: barColors,
				borderColor: borderColor,
				borderWidth: 2
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						min: minChart,
						max: maxChart,
						display: false
					}
				}]
			},
			legend: {
				display: false
			},
			title: {
				display: true,
				text: chartLabel,
				fontSize: 14
			},
			animation: {
				duration: 250
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, data) {
						return values[tooltipItem.index] + ' µg/m3';
					},
					afterLabel: function (tooltipItem, data) {
						return percentage[tooltipItem.index] + '%';
					}
				}
			}
		}
	});
}

function displayLocationData(data, status, jqXHR)
{
	console.log("receive data");
	console.log(data);
	$("#overallState").empty();
    $("#overallState").append("<p id='overallStateParagraph'>Jakość powietrza: </p>");
    $("#overallStateParagraph").append("<p id='overallStateParagraphValue'>Bardzo dobra</p>");
    //var colorValue = colorTableEnum.verygood;
	console.log(data.airIndex);
	
	var airStatus = data.airIndex;
	if (data.airIndex == -1)
	{
		airStatus = 6
	}

	colorValue = statusColors[airStatus];
	$("#overallStateParagraphValue").text(data.airStatusMessage);

    var multiplier = 0.3;
    $("#overallState").css('background-color', colorValue);

    $("#overallStateParagraphValue").css('color', 'white');
    $("#smog-table .smog-head").css("background-color", colorValue);
    $("#smog-table").find(".smog-data-row").empty();
    $("#smog-table").find(".smog-value-row").empty();
    $("#smog-table").find(".smog-percent-row").empty();
	$("#smog-table").css("display", "table");
	displayChart(data.measurement);
    $.each(data.measurement, function (i, item) {
        if (item.airIndex == 5 || item.airIndex == 0) {
            multiplier = 0.55;
        }
        else {
            multiplier = 0.3;
        }

        var currentColorValue = statusColors[item.airIndex].replace(')', ', ' + multiplier + ')').replace('rgb', 'rgba');
        $("#smog-table").find(".smog-data-row").append("<td>" + item.name + "</td>");
        $("#smog-table").find(".smog-value-row").append("<td>" + item.value.toFixed(2) + "µg" + "</td>");
        $("#smog-table").find(".smog-percent-row").append("<td style='background-color: " + currentColorValue + "'>" + item.percentage.toFixed(2) + "%" + "</td>");
        if ((window.innerWidth < 760) && (i > 5)) {
            $("#smog-table").css("display", "block");
        }
    });

    $("#smog-table").find("td").css("border-color", colorValue);
}

function displayRanking(data, page=0, limit=50) {
	// "rankingPage-table
	mainId = "#rankingPage-table";
	$(mainId).find(".smog-body").empty();
	$.each(data, function (i, item) {
		id = page * limit + i;
		status = item.status;
		ranking = item.percentage.toFixed(2);
		locationInfo = [item.info.displayAdress1, item.info.displayAdress2].joing(" ");
		lat = item.info.location.latitude;
		long = item.info.location.longitude;
		$(mainId).find(".smog-body").append(
			"<tr><td>" + [id, status, ranking, locationInfo, lat, long].joing("</td><td>") + "</td></tr>"
		)
	});
}

function sendCommand(command, onSuccess=function(datac) {}, onError=function(jqXHR, textStatus, errorThrown) {}, timeout=15000)
{
	$.ajax({
        type: 'GET',
        url: command,
		timeout:timeout,
		crossDomain: true,
		contentType: 'application/json',
        success: function (data, status, jqXHR) {
			onSuccess(data, status, jqXHR);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Error during sending command "' + command + '"')
			console.log(errorThrown);
			console.log(textStatus);
			console.log(jqXHR)
			onError(jqXHR, textStatus, errorThrown);
		},
        statusCode: {
            404: function () {
                console.log('Error during sending command "' + command + '"');
            }
        }
    });
}

$(document).ready(function () {

	var pollutionScreenOpen = true;

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

	//ukryj sidebar klikajac na strone
	$('#content').on('click', function () {
		if ($('#sidebar').hasClass('active')) {
			$("#sidebar").toggleClass('active')
		}
	})

	//lokalizacja i sensory
	$("#geoButton").click(function () {
		$("#geoDiv").toggle();
		navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	});

	$("#sensorButton").click(function () {
		$("#accelerometerDiv").toggle();
		$("#gyroscopeDiv").toggle();
	});

	$("#mapButton").click(function () {
		$("#dataLoader").toggle(true);
		sendLocationToServer();
		$("#mapScreen").toggle(true);
		$("#pollutionScreen").toggle(false);
		pollutionScreenOpen = false;
		window.setTimeout(addStationsToMap, 1000);
		$("#dataLoader").toggle(false);
		$("#rankingPage").toggle(false);
	});

	function showPollutionData() {
		$("#dataLoader").toggle(true);
		var chartCompleteData = {};
		chartCompleteData.chartLabels = [];
		chartCompleteData.chartData = [];
		chartCompleteData.chartRawData = [];
		chartCompleteData.chartStatuses = [];
		chartCompleteData.chartBackgroundColors = [];
		chartCompleteData.chartBorderColors = [];
		chartCompleteData.chartLabel;

		//pobierz dane asynchronicznie z ajaxa w funkcji load, nastepnie na tych danych uruchom drawChrt i drawTable
		function myCallback(result) {
			var newData = pickColors(result[0]);
			drawChart(newData);
			drawTable(result[1], chartCompleteData.chartStatuses)
		}
		load(myCallback, chartCompleteData);
	}

	function showSmog(command, order, limit) {
		$("#dataLoader").toggle(true);
		var chartCompleteData = {};
		chartCompleteData.chartLabels = [];
		chartCompleteData.chartData = [];
		chartCompleteData.chartRawData = [];
		chartCompleteData.chartStatuses = [];
		chartCompleteData.chartBackgroundColors = [];
		chartCompleteData.chartBorderColors = [];
		chartCompleteData.chartLabel;

		//pobierz dane asynchronicznie z ajaxa w funkcji load, nastepnie na tych danych uruchom drawChrt i drawTable
		function myCallback(result) {
			var newData = pickColorsBestWorst(result[0]);
			drawChartSmog(newData);
			drawTableBestWorst(result[1], chartCompleteData.chartStatuses)
		}
		loadSmog(myCallback, chartCompleteData, command, order, limit);
	}

	//uruchom funkcje wczytania/rysowania raz, potem uruchamiaj co 15s.
	window.setInterval(function () {
		if (pollutionScreenOpen) { showSmog('', 0, 0); }
		// sendLocationToServer();
		navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	}, 15000);

	//uruchom funkcje guzikiem
	$('#myLocationInfo').click(function () {
		$("#pollutionScreen").toggle(true);
		$("#mapScreen").toggle(false);
		$("#rankingPage").toggle(false);
		pollutionScreenOpen = true;
		
		command = getMyLocationInfo();
		
		response = sendCommand(command, success=displayLocationData);

	});

	$('#showBest').click(function () {
		$("#pollutionScreen").toggle(true);
		$("#mapScreen").toggle(false);
		$("#rankingPage").toggle(false);
		pollutionScreenOpen = false;
		order = 'asc';
		command = 3;
		showSmog(command, order, 1);
	});

	
	$('#showBestList').click(function () {
		$("#pollutionScreen").toggle(false);
		$("#mapScreen").toggle(false);
		$("#rankingPage").toggle(true);
		limit = 50;
		page = 0;
		command = getRanking("asc", limit=limit, page=page);
		sendCommand(command, onSuccess=displayRanking)
	});

	$('#showWorst').click(function () {
		$("#pollutionScreen").toggle(true);
		$("#mapScreen").toggle(false);
		$("#rankingPage").toggle(false);
		pollutionScreenOpen = false;
		order = 'desc';
		command = 3;
		showSmog(command, order, 1);
	});

	//zmiana zrodla
	$("#source1").click(function () {
		getData = 'smog.json'
		showPollutionData()
	});

	$("#source2").click(function () {
		getData = 'smog2.json'
		showPollutionData()
	});

	$("#source3").click(function () {
		getData = 'smog3.json'
		showPollutionData()
	});

});

var app = {

	// Application Constructor
	initialize: function () {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},

	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	onDeviceReady: function () {
		this.receivedEvent('deviceready');
		navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
		sendLocationToServer();

		//sensory
		var accXYZ = ["", "", ""];
		var gyroXYZ = ["", "", ""];

		function accelerometerListener(event) {
			accXYZ[0] = "X: " + event.values[0];
			accXYZ[1] = "Y: " + event.values[1];
			accXYZ[2] = "Z: " + event.values[2];

			accelerometerValues = accXYZ.join("</br>");
			document.getElementById("accelerometerState").innerHTML = accelerometerValues;
		}

		function gyroscopeListener(event) {
			gyroXYZ[0] = "X: " + event.values[0];
			gyroXYZ[1] = "Y: " + event.values[1];
			gyroXYZ[2] = "Z: " + event.values[2];

			gyroscopeValues = gyroXYZ.join("</br>");
			document.getElementById("gyroscopeState").innerHTML = gyroscopeValues;
		}

		sensors.addSensorListener("ACCELEROMETER", "NORMAL", accelerometerListener, function (error) {
			if (error) accelerometerValues = "Could not listen to sensor";
		});

		sensors.addSensorListener("GYROSCOPE", "NORMAL", gyroscopeListener, function (error) {
			if (error) gyroscopeValues = "Could not listen to sensor";
		});
	},

	// Update DOM on a Received Event
	receivedEvent: function (id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);
	}
};

app.initialize();