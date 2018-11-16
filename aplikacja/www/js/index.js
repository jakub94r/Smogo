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

 $(document).ready(function() {


	 
	 var dataAddress = 'http://127.0.0.1:8080'
	 var getData = dataAddress + '/getData'
	 
	 //var getData = 'smog.json' //pobierz dane z pliku, zakomentowac zeby pobierac z serwera

	 //zmienne do wykresow
	 var chartLabels = [];
	 var chartData = [];
	 var chartRawData = [];
	 var chartStatuses = [];
	 var chartBackgroundColors = [];
	 var chartBorderColors = [];
	 var chartLabel;

	 //paleta kolorow dla poszczegolnych stanow zanieczyszcenia
	 var backgroundColorsPallet = [
		'rgba(0, 148, 0, 0.8)',		//very good
		'rgba(81, 255, 81, 0.8)', //good
		'rgba(230, 230, 0, 0.8)', //medium
		'rgba(255, 77, 77, 0.8)', //bad
		'rgba(128, 0, 0, 0.8)'];	//verybad
		
		//krawedzie slupkow
		var borderdColorsPallet = [
		'rgba(0, 148, 0, 1)',
		'rgba(81, 255, 81, 1)',
		'rgba(230, 230, 0, 1)',
		'rgba(255, 77, 77, 1)',
		'rgba(128, 0, 0, 1)'];

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
    });

	//ukryj sidebar klikajac na strone
	$('#content').on('click', function() {
		if ($('#sidebar').hasClass('active')) {
			$("#sidebar").toggleClass('active')
		}
	})

	$("#about").click( function(){
		$("#aboutBar").toggle()
		});

	//zmiana zrodla
	$("#source1").click( function(){
		getData = 'smog.json'
		alert('Zmieniono źródło na 1');
		});

	$("#source2").click( function(){
		getData = 'smog2.json'
		alert('Zmieniono źródło na 2');
		});	
	
	 //dobierz kolory slupkow na podstawie stanu z json-a
	 function pickColors() {
		 chartStatuses.forEach(function (item, index) {
			 switch (item) {
				 case "verygood":
					 chartBackgroundColors.push(backgroundColorsPallet[0]);
					 chartBorderColors.push(borderdColorsPallet[0]);
					 break;
				 case "good":
					 chartBackgroundColors.push(backgroundColorsPallet[1]);
					 chartBorderColors.push(borderdColorsPallet[1]);
					 break;
				 case "medium":
					 chartBackgroundColors.push(backgroundColorsPallet[2]);
					 chartBorderColors.push(borderdColorsPallet[2]);
					 break;
				 case "bad":
					 chartBackgroundColors.push(backgroundColorsPallet[3]);
					 chartBorderColors.push(borderdColorsPallet[3]);
					 break;
				 case "verybad":
					 chartBackgroundColors.push(backgroundColorsPallet[4]);
					 chartBorderColors.push(borderdColorsPallet[4]);
					 break;
			 }
		 });
	 }

	 //rysuj wykres
	 function drawChart() {
		$("#myChart").remove();
		$("#chartContainer").append('<canvas id="myChart" class="chart mx-auto"></canvas>');

		//usun wszystkie poprzednie wykresy
		 $("canvas#myChart").remove();
		 $("div#canvasDiv").append('<canvas id="myChart" class="chart mx-auto"></canvas>');

		 //rysuj nowy wykres
		 var ctx = document.getElementById("myChart").getContext('2d');
		 var myChart = new Chart(ctx, {
			 type: 'bar',
			 data: {
				 labels: chartLabels,
				 datasets: [{
					 label: "legenda",
					 data: chartData,
					 backgroundColor: chartBackgroundColors,
					 borderColor: chartBorderColors,
					 borderWidth: 2
				 }]
			 },
			 options: {
				 scales: {
					 yAxes: [{
						 ticks: {
							min: 0,
							max: 100,
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
					   label: function(tooltipItem, data) {
							return chartRawData[tooltipItem.index] + ' µg/m3';
					   }
					}
				 }
			 }
		 });
	 };

	 //wczytaj dane
	 function load() {
		 $.ajax({
			 type: 'GET',
			 url: getData,
			 dataType: 'json',
			 success: function (data) {

				 chartLabels = [];
				 chartData = [];
				 chartStatuses = [];
				 chartBackgroundColors = [];
				 chartBorderColors = [];
				 chartLabel = data.name;

				 $.each(data.data, function (i, item) {
					 chartLabels.push(item.name);
					 chartData.push(item.value);
					 chartStatuses.push(item.status);
					 chartRawData.push(item.raw_value);
				 })
				 pickColors()
				 drawChart()	//narysuj wykres
				 
				$("#overallState").empty();
				$("#overallState").append("<p id='overallStateParagraph'>'Ogólna jakość powietrza: </p>");
				$("#overallStateParagraph").append("<span id='overallStateParagraphValue'>Bardzo dobra</span>");
				$("#overallStateParagraphValue").css("color", "rgb(0, 148, 0)");
				var worstStatus = 5;
				chartStatuses.forEach(function (item, index)
				{
					switch (item) {
						case "good": if (worstStatus > 4) { worstStatus = 4; $("#overallStateParagraphValue").text('Dobra'); $("#overallStateParagraphValue").css("color", "rgb(0, 197, 5)"); }
						break;
						case "medium": if (worstStatus > 3) { worstStatus = 3; $("#overallStateParagraphValue").text('Średnia'); $("#overallStateParagraphValue").css("color", "rgb(202, 204, 0)"); }
						break;
						case "bad": if (worstStatus > 2) { worstStatus = 2; $("#overallStateParagraphValue").text('Zła'); $("#overallStateParagraphValue").css("color", "rgb(255, 77, 77)"); }
						break;
						case "verybad": if (worstStatus > 1) { worstStatus = 1; $("#overallStateParagraphValue").text('Bardzo zła'); $("#overallStateParagraphValue").css("color", "rgb(128, 0, 0)"); }
						break;
					}
				});
				console.log(worstStatus);

				 $(".smog-row").empty();
				 $.each(data.data, function(i, item) {
					 $(".smog-row").append("<td>" + item.value + "</td>");
					});
			 },
			 statusCode: {
				 404: function () {
					 alert('Could not load data');
				 }
			 }
		 });
	 }

	 //uruchom funkcje wczytania/rysowania raz, potem uruchamiaj co 15s.
	 load()
	 window.setInterval(function () {
		 load()
	 }, 15000);

	 //uruchom funkcje guzikiem
	 $('#load').click(function () {
		 load()
	 });
 });

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();