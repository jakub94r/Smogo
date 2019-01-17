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

$(document).ready(function () {

	var pollutionScreenOpen = true;
	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

	sendLocationToServer();

	
	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

	//ukryj sidebar klikajac na strone
	$('#content').on('click', function () {
		if ($('#sidebar').hasClass('active')) {
			$("#sidebar").toggleClass('active')
		}
	})

	$("#about").click(function () {
		$("#aboutBar").toggle()
	});

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
		initMap();
		$("#mapScreen").toggle(true);
		$("#pollutionScreen").toggle(false);
		pollutionScreenOpen = false;
		sendLocationToServer();
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

	//uruchom funkcje wczytania/rysowania raz, potem uruchamiaj co 15s.
	window.setInterval(function () {
		if (pollutionScreenOpen) {showPollutionData(); }
	}, 15000);

	//uruchom funkcje guzikiem
	$('#load').click(function () {
		$("#pollutionScreen").toggle(true);
		$("#mapScreen").toggle(false);
		pollutionScreenOpen = true;
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