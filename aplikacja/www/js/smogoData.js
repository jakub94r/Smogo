
var dataAddress = 'http://127.0.0.1:8080'
var getData = dataAddress + '/getData'
//var getData = 'smog.json' //pobierz dane z pliku, zakomentowac zeby pobierac z serwera

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

var colorTableEnum = {
    verygood: "rgb(0, 102, 0)",
    good: "rgb(0, 197, 5)",
    medium: "rgb(176, 178, 0)",
    bad: "rgb(255, 77, 77)",
    verybad: "rgb(128, 0, 0)"
};

//zmiana zrodla
$("#source1").click(function () {
    getData = 'smog.json'
});

$("#source2").click(function () {
    getData = 'smog2.json'
});

//wczytaj dane
function load(callback, chartCompleteData) {
    $.ajax({
        type: 'GET',
        url: getData,
        dataType: 'json',
        success: function (data) {

            chartCompleteData.chartLabels = [];
            chartCompleteData.chartData = [];
            chartCompleteData.chartRawData = [];
            chartCompleteData.chartStatuses = [];
            chartCompleteData.chartBackgroundColors = [];
            chartCompleteData.chartBorderColors = [];
            chartCompleteData.chartLabel = data.name;

            $.each(data.data, function (i, item) {
                chartCompleteData.chartLabels.push(item.name);
                chartCompleteData.chartData.push(item.value);
                chartCompleteData.chartStatuses.push(item.status);
                chartCompleteData.chartRawData.push(item.raw_value);
            })
            callback([chartCompleteData, data.data]);
            //pickColors(chartCompleteData)
            //drawChart(chartCompleteData)	//narysuj wykres
            //drawTable(data.data, chartCompleteData.chartStatuses)

        },
        statusCode: {
            404: function () {
                alert('Could not load data');
            }
        }
    });
    newChartCompleteData = chartCompleteData;
    return newChartCompleteData;
}
//dobierz kolory slupkow na podstawie stanu z json-a
function pickColors(chartCompleteData) {
    var newChartCompleteData;
    chartCompleteData.chartStatuses.forEach(function (item, index) {
        switch (item) {
            case "verygood":
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet[0]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet[0]);
                break;
            case "good":
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet[1]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet[1]);
                break;
            case "medium":
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet[2]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet[2]);
                break;
            case "bad":
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet[3]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet[3]);
                break;
            case "verybad":
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet[4]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet[4]);
                break;
        }
    });
    newChartCompleteData = chartCompleteData;
    return newChartCompleteData;
}

//rysuj wykres
function drawChart(chartCompleteData) {
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
            labels: chartCompleteData.chartLabels,
            datasets: [{
                label: "legenda",
                data: chartCompleteData.chartData,
                backgroundColor: chartCompleteData.chartBackgroundColors,
                borderColor: chartCompleteData.chartBorderColors,
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
                text: chartCompleteData.chartLabel,
                fontSize: 14
            },
            animation: {
                duration: 250
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return chartRawData[tooltipItem.index] + ' µg/m3';
                    }
                }
            }
        }
    });
};

function drawTable(pollutionData, chartStatuses) {
    $("#overallState").empty();
    $("#overallState").append("<p id='overallStateParagraph'>'Ogólna jakość powietrza: </p>");
    $("#overallStateParagraph").append("<span id='overallStateParagraphValue'>Bardzo dobra</span>");
    $("#overallStateParagraphValue").css("color", colorTableEnum.verygood);
    //var colorValue = colorTableEnum.verygood;

    var worstStatus = 5;
    chartStatuses.forEach(function (item, index) {
        switch (item) {
            case "good": if (worstStatus > 4) {
                worstStatus = 4; $("#overallStateParagraphValue").text('Dobra');
                //var colorValue = colorTableEnum.good;
                $("#overallStateParagraphValue").css("color", colorTableEnum.good);
            }
                break;
            case "medium": if (worstStatus > 3) {
                worstStatus = 3; $("#overallStateParagraphValue").text('Średnia');
                //var colorValue = colorTableEnum.medium;
                $("#overallStateParagraphValue").css("color", colorTableEnum.medium);
            }
                break;
            case "bad": if (worstStatus > 2) {
                worstStatus = 2; $("#overallStateParagraphValue").text('Zła');
                //var colorValue = colorTableEnum.bad;
                $("#overallStateParagraphValue").css("color", colorTableEnum.bad);
            }
                break;
            case "verybad": if (worstStatus > 1) {
                worstStatus = 1; $("#overallStateParagraphValue").text('Bardzo zła');
                //var colorValue = colorTableEnum.verybad;
                $("#overallStateParagraphValue").css("color", colorTableEnum.verybad);
            }
                break;
        }
    });

    var colorValue = $("#overallStateParagraphValue").css('color');
    var colorValueBackground = colorValue.replace(')', ', 0.25)').replace('rgb', 'rgba');
    $("#smog-table .smog-head").css("background-color", colorValue);
    //$("#overallState").css("background-color", colorValueBackground);
    $(".smog-value-row").empty();
    $(".smog-percent-row").empty();
    $.each(pollutionData, function (i, item) {
        var currentColorValue = colorTableEnum[item.status].replace(')', ', 0.25)').replace('rgb', 'rgba');
        $(".smog-value-row").append("<td>" + item.raw_value + "µg" + "</td>");
        $(".smog-percent-row").append("<td style='background-color: " + currentColorValue + "'>" + item.value + "%" + "</td>");
    });

    $("#smog-table").find("td").css("border-color", colorValue);
}