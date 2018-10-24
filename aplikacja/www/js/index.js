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


 	var filename = 'smog.json'

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
    });

	$("#tomek").click( function(){
		$("#tomasz").toggle()
		});

	//zmiana zrodla
	$("#source1").click( function(){
		filename = 'smog.json'
		alert('Zmieniono źródło na 1');
		});

	$("#source2").click( function(){
		filename = 'smog2.json'
		alert('Zmieniono źródło na 2');
		});

	//funkcja wczytania danych, na razie z pliku
	function load() {
	  $.ajax({
		  type: 'GET',
		  url: filename,
		  dataType: 'json',
		  success: function(data) {

			//$(".smog-row").empty();

			$.each(data.PM10, function(key, val) {
				//$("#smog-table").append("<tr class='smog-row'><td>" + val + "</td><td>" + data.O3[key] + "</td><td>" + data.SO2[key] + "</td><td>" + data.PM25[key] + "</td></tr>");
			});
		},
      statusCode: {
         404: function() {
           alert('Could not load data');
         }
       }
    });
  }
  
	//uruchamiaj funkcje wczytania co 15s.
	window.setInterval(function(){
	  load()
	  }, 15000);
		
	//uruchom funkcje wczytania guzikiem
	$('#load').click(function() {
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
		$("#tomasz").hide()
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