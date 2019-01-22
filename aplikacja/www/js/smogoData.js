
var dataAddress = 'http://192.168.43.147:8080'
var getData = dataAddress + '/getLocationAirInfo/' + latitude + '/' + longitude
//var getData = 'smog.json' //pobierz dane z pliku, zakomentowac zeby pobierac z serwera

//paleta kolorow dla poszczegolnych stanow zanieczyszcenia
var backgroundColorsPallet = [
    'rgba(0, 148, 0, 0.8)',		//very good
    'rgba(81, 255, 81, 0.8)', //good
    'rgba(255, 200, 0, 0.8)', //medium
    'rgba(255, 77, 77, 0.8)', //bad
    'rgba(128, 0, 0, 0.8)'];	//verybad

var backgroundColorsPallet2 = [
     'rgba(0, 148, 0, 0.8)',		//very good
    'rgba(81, 255, 81, 0.8)', //good
    'rgba(255, 200, 0, 0.8)', //medium
    'rgba(255, 100, 0, 0.8)', //medium-bad
    'rgba(255, 77, 77, 0.8)', //bad
    'rgba(128, 0, 0, 0.8)'];	//verybad

//krawedzie slupkow
var borderdColorsPallet = [
    'rgba(0, 148, 0, 1)',
    'rgba(81, 255, 81, 1)',
    'rgba(255, 200, 0, 1)',
    'rgba(255, 77, 77, 1)',
    'rgba(128, 0, 0, 1)'];

var borderdColorsPallet2 = [
    'rgba(0, 148, 0, 1)',
    'rgba(81, 255, 81, 1)',
    'rgba(255, 200, 0, 1)',
    'rgba(255, 100, 0, 0.8)',
    'rgba(255, 77, 77, 1)',
    'rgba(128, 0, 0, 1)'];

var colorTableEnum = {
    verygood: "rgb(0, 102, 0)",
    good: "rgb(0, 197, 5)",
    medium: "rgb(228, 177, 0)",
    bad: "rgb(255, 127, 77)",
    verybad: "rgb(128, 0, 0)"
};

var colorTableEnum2 = {
    0: "rgb(0, 102, 0)",
    1: "rgb(0, 197, 5)",
    2: "rgb(228, 177, 0)",
    3: "rgb(255, 127, 77)",
    4: "rgb(220, 0, 0)",
    5: "rgb(139, 0, 0)"
};

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

            $("#dataLoader").toggle(false);

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

function loadSmog(callback, chartCompleteData, command, order) {
    var urlValue;
    var receivedData;
    switch (command) {
        case 0:
            urlValue = dataAddress + '/getLocationAirInfo/' + latitude + '/' + longitude;
            break;
        case 3:
            urlValue = dataAddress + '/getStationRanking/' + order + '/1/1';
            break;
    }

    $.ajax({
        type: 'GET',
        url: urlValue,
        dataType: 'json',
        success: function (data) {
            chartCompleteData.chartLabels = [];
            chartCompleteData.chartData = [];
            chartCompleteData.chartRawData = [];
            chartCompleteData.chartStatuses = [];
            chartCompleteData.chartBackgroundColors = [];
            chartCompleteData.chartBorderColors = [];
            chartCompleteData.chartLabel = data.id;

            if (command==0){ receivedData = data } else { receivedData = data[0] };

            $.each(receivedData.measurement, function (i, item) {
                chartCompleteData.chartLabels.push(item.name);
                chartCompleteData.chartData.push(item.percentage);
                chartCompleteData.chartStatuses.push(item.airIndex);
                chartCompleteData.chartRawData.push(item.value);
            })

            $("#dataLoader").toggle(false);

            callback([chartCompleteData, receivedData.measurement]);
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

function pickColorsBestWorst(chartCompleteData) {
    var newChartCompleteData;
    chartCompleteData.chartStatuses.forEach(function (item, index) {
        switch (item) {
            case 0:
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet2[0]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet2[0]);
                break;
            case 1:
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet2[1]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet2[1]);
                break;
            case 2:
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet2[2]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet2[2]);
                break;
            case 3:
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet2[3]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet2[3]);
                break;
            case 4:
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet2[4]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet2[4]);
                break;
            case 5:
                chartCompleteData.chartBackgroundColors.push(backgroundColorsPallet2[5]);
                chartCompleteData.chartBorderColors.push(borderdColorsPallet2[5]);
                break;
        }
    });
    newChartCompleteData = chartCompleteData;
    return newChartCompleteData;
}

//rysuj wykres
function drawChart(chartCompleteData) {
    var maxChart = 100;
    var minChart = 0;
    
    //usun wszystkie poprzednie wykresy
    $("canvas#myChart").remove();
    $("div#canvasDiv").empty();
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
                text: chartCompleteData.chartLabel,
                fontSize: 14
            },
            animation: {
                duration: 250
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return chartCompleteData.chartRawData[tooltipItem.index] + ' µg/m3';
                    }
                }
            }
        }
    });
};

function drawChartSmog(chartCompleteData) {
    var maxChart = 250;
    var minChart = 0;

    chartCompleteData.chartData.forEach(function (item, index) {
        if (item < 5) { maxChart = item*10 }
    });

    chartCompleteData.chartData.forEach(function (item, index) {
        if (item > maxChart) { maxChart = item }
    });


    
    //usun wszystkie poprzednie wykresy
    $("canvas#myChart").remove();
    $("div#canvasDiv").empty();
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
                text: chartCompleteData.chartLabel,
                fontSize: 14
            },
            animation: {
                duration: 250
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return chartCompleteData.chartRawData[tooltipItem.index] + ' µg/m3';
                    }
                }
            }
        }
    });
};

function drawTable(pollutionData, chartStatuses) {
    $("#overallState").empty();
    $("#overallState").append("<p id='overallStateParagraph'>Jakość powietrza: </p>");
    $("#overallStateParagraph").append("<p id='overallStateParagraphValue'>Bardzo dobra</p>");
    //var colorValue = colorTableEnum.verygood;

    var worstStatus = 5;
    var colorValue = colorTableEnum.verygood;
    chartStatuses.forEach(function (item, index) {
        switch (item) {
            case "good": if (worstStatus > 4) {
                worstStatus = 4; $("#overallStateParagraphValue").text('Dobra');
                colorValue = colorTableEnum.good;
            }
                break;
            case "medium": if (worstStatus > 3) {
                worstStatus = 3; $("#overallStateParagraphValue").text('Umiarkowana');
                colorValue = colorTableEnum.medium;
            }
                break;
            case "bad": if (worstStatus > 2) {
                worstStatus = 2; $("#overallStateParagraphValue").text('Zła');
                colorValue = colorTableEnum.bad;
            }
                break;
            case "verybad": if (worstStatus > 1) {
                worstStatus = 1; $("#overallStateParagraphValue").text('Bardzo zła');
                colorValue = colorTableEnum.verybad;
            }
                break;
        }
    });

    var colorValueBackground = colorValue.replace(')', ', 0.25)').replace('rgb', 'rgba');
    var multiplier = 0.3;
    $("#overallState").css('background-color', colorValue);

    //$("#overallStateParagraphValue").css('color', colorValue);
    $("#overallStateParagraphValue").css('color', 'white');
    $("#smog-table .smog-head").css("background-color", colorValue);
    $(".smog-data-row").empty();
    $(".smog-value-row").empty();
    $(".smog-percent-row").empty();
    $("#smog-table").css("display", "table");
    $.each(pollutionData, function (i, item) {
        if (item.status == "verybad" || item.status == "verygood") {
            multiplier = 0.55;
        }
        else {
            multiplier = 0.3;
        }

        var currentColorValue = colorTableEnum[item.status].replace(')', ', ' + multiplier + ')').replace('rgb', 'rgba');
        $(".smog-data-row").append("<td>" + item.name + "</td>");
        $(".smog-value-row").append("<td>" + item.raw_value + "µg" + "</td>");
        $(".smog-percent-row").append("<td style='background-color: " + currentColorValue + "'>" + item.value + "%" + "</td>");
        if ((window.innerWidth < 760) && (i > 5)) {
            $("#smog-table").css("display", "block");
        }
    });

    $("#smog-table").find("td").css("border-color", colorValue);
    
}

function drawTableBestWorst(pollutionData, chartStatuses) {
    $("#overallState").empty();
    $("#overallState").append("<p id='overallStateParagraph'>Jakość powietrza: </p>");
    $("#overallStateParagraph").append("<p id='overallStateParagraphValue'>Bardzo dobra</p>");
    //var colorValue = colorTableEnum.verygood;

    var worstStatus = 5;
    var colorValue = colorTableEnum2[0];
    chartStatuses.forEach(function (item, index) {
        switch (item) {
            case 1: if (worstStatus > 4) {
                worstStatus = 4; $("#overallStateParagraphValue").text('Dobra');
                colorValue = colorTableEnum2[item];
            }
                break;
            case 2: if (worstStatus > 3) {
                worstStatus = 3; $("#overallStateParagraphValue").text('Umiarkowana');
                colorValue = colorTableEnum2[item];
            }
                break;
            case 3: if (worstStatus > 2) {
                worstStatus = 2; $("#overallStateParagraphValue").text('Dostateczna');
                colorValue = colorTableEnum2[item];
            }
                break;
            case 4: if (worstStatus > 1) {
                worstStatus = 1; $("#overallStateParagraphValue").text('Zła');
                colorValue = colorTableEnum2[item];
            }
                break;
            case 5: if (worstStatus > 0) {
                worstStatus = 0; $("#overallStateParagraphValue").text('Bardzo zła');
                colorValue = colorTableEnum2[item];
            }
                break;
        }
    });

    var colorValueBackground = colorValue.replace(')', ', 0.25)').replace('rgb', 'rgba');
    var multiplier = 0.3;
    $("#overallState").css('background-color', colorValue);

    //$("#overallStateParagraphValue").css('color', colorValue);
    $("#overallStateParagraphValue").css('color', 'white');
    $("#smog-table .smog-head").css("background-color", colorValue);
    $(".smog-data-row").empty();
    $(".smog-value-row").empty();
    $(".smog-percent-row").empty();
    $("#smog-table").css("display", "table");
    $.each(pollutionData, function (i, item) {
        if (item.airIndex == 5 || item.airIndex == 0) {
            multiplier = 0.55;
        }
        else {
            multiplier = 0.3;
        }

        var currentColorValue = colorTableEnum2[item.airIndex].replace(')', ', ' + multiplier + ')').replace('rgb', 'rgba');
        $(".smog-data-row").append("<td>" + item.name + "</td>");
        $(".smog-value-row").append("<td>" + item.value.toFixed(2) + "µg" + "</td>");
        $(".smog-percent-row").append("<td style='background-color: " + currentColorValue + "'>" + item.percentage.toFixed(2) + "%" + "</td>");
        if ((window.innerWidth < 760) && (i > 5)) {
            $("#smog-table").css("display", "block");
        }
    });

    $("#smog-table").find("td").css("border-color", colorValue);
}