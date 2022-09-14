let apiKey = "&appid=d34f0b45996f55d571b6eceb335266c3";
let city = $('#searchTerm');
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
let date = new Date();


$("#searchBtn").on("click", function () {
    $("#forecastH2").addClass("show"); //display H2 element
    city = $('#searchTerm').val(); //grab input
    $("#searchTerm").val(""); //clear input

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey,
        method: "GET"
    })
        .then(function (response) {
            getCurrentConditions(response);
            getCurrentForecast(response);
            makeList();
        })
});

function makeList() {
    let listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
}

function getCurrentConditions(response) {

    let tempF = (response.main.temp - 273.15) * 1.80 + 32; //had to ge help here; thought it would be easier to convert than repass URL to units imperial
    tempF = Math.floor(tempF);

    $('#currentCity').empty();

    let card = $("<div>").addClass("card");
    let cardBody = $("<div>").addClass("card-body");
    let city = $("<h4>").addClass("card-title").text(response.name);
    let cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    let temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    let humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    let wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    let image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png") //get image/icon from api

    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#currentCity").append(card)
}

function getCurrentForecast() {

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
        method: "GET"
    }).then(function (response) {
        $('#forecast').empty();
        let results = response.list;

        for (let i = 0; i < results.length; i++) {

            let day = Number(results[i].dt_txt.split("-")[2].split(" ")[0]); //this is the days is in the forecast

            if (results[i].dt_txt.indexOf("12:00:00") !== -1) {
                let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
                let tempF = Math.floor(temp);
                let card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
                let cardBody = $("<div>").addClass("card-body p-3 forecastBody")
                let cityDate = $("<h4>").addClass("card-title").text(day); //shows days in each card
                let temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
                let humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
                let image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
                cardBody.append(cityDate, image, temperature, humidity);
                card.append(cardBody);
                $("#forecast").append(card);
            }
        }
    });
}