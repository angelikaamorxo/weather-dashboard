// Linking HTML 
var searchButton = document.querySelector("#searchBtn");
var weatherSectionE1 = document.querySelector("#weatherContent");
var sideBar = document.querySelector("#sideBar");
var historyContent = document.querySelector(".history");
var input = document.querySelector("#input");
var createHistory;
var searchHistory = [];

// Variables
var lon;
var lat;
var city;
var APIKey = "1112e3fcb547812716547c3829826d88";

function init() {
    getHistory();
};

function searchApi(city) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;

    var lon;
    var lat;
    var city;

    fetch(queryURL) 
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            lon = data.coord.lon;
            lat = data.coord.lat;
            city = data.name;
        })
        .then(function () {
            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;
            fetch(weatherUrl)
                .then(function (response) {
                    if (!response.ok) {
                        throw response.json();
                    }
                    return response.json();
                })
                .then(function (data) {
                    printResults(data, city);
                })

        })
};


function printResults(results, name) {

    weatherSectionE1.innerHTML = "";

    var locationE1 = document.createElement('div');
    locationE1.classList.add('card');
    weatherSectionE1.append(locationE1);
    var locationHeader = document.createElement('div');
    locationHeader.classList.add('cardHeader', 'd-flex', 'flex-row');
    var locationInfo = document.createElement('div');
    locationInfo.classList.add('card-body');
    locationE1.append(locationHeader, locationInfo);

    var title = document.createElement('h2');
    title.textContent = name;
    title.classList.add('card-title');

    var weatherImage = document.createElement('img');
    var iconcode = results.current.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    weatherImage.setAttribute('src', iconurl);
    locationHeader.append(title, weatherImage);

    var temp = document.createElement('p');
    temp.textContent = "Temp: " + results.current.temp + "°C";

    var wind = document.createElement('p');
    wind.textContent = "Wind: " + results.current.wind_speed + "km/h";

    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: " + results.current.humidity + "%";

    var index = document.createElement('p');
    index.textContent = "UV Index: " + results.current.uvi;
    if(results.current.uvi < 3) {
        index.classList.add("text-success", "fw-bold");
    } else if (results.current.uvi > 3  && results.current.uvi < 6) {
        index.classList.add("text-warning", "fw-bold");
    } else {
        index.classList.add("text-danger", "fw-bold");
    }

    locationInfo.append(temp, wind, humidity, index);

    var forecast = document.createElement('div');
    forecast.classList.add('d-flex', 'daily');
    weatherSectionE1.append(forecast);
    setHistory(name);

    for (var i = 0; i < 5; i++) {
        var dayContainer = document.createElement('div');
        dayContainer.classList.add('weekday', 'card');
        forecast.append(dayContainer);

        var day = document.createElement('div');
        day.classList.add('card-body', 'forecast');

        var date = document.createElement('h3');
        date.textContent = moment().add(i + 1, 'days').format('dddd');
        date.classList.add('card-title');
        day.append(date);

        var image = document.createElement('img');
        var code = results.daily[i].weather[0].icon;
        var imageUrl = "https://openweathermap.org/img/w/" + code + ".png";
        image.setAttribute('src', imageUrl);
        date.classList.add('card-text');
        day.append(image);

        var temp = document.createElement('p');
        temp.textContent = "Temp: " + results.daily[i].temp.day + '°C';
        day.append(temp);

        var wind = document.createElement('p');
        wind.textContent = "Wind: " + results.daily[i].wind_speed + 'km/h';
        day.append(wind);

        var humidity = document.createElement('p');
        humidity.textContent = "Humiditiy: " + results.daily[i].humidity + '%';
        day.append(humidity);

        dayContainer.append(day);
    }
};

function handleSearchResults() {
    var inputVal = document.querySelector("#input").value;

    if (!inputVal) {
        console.error("Try again..");
        return;
    }
    searchApi(inputVal);
};

function setHistory(name) {
    if (searchHistory.includes(name) == false) {
        searchHistory.push(name);
        localStorage.setItem("location", JSON.stringify(searchHistory));
        addCity(name);
    }
};

function getHistoryFromStorage() {
    return JSON.parse(localStorage.getItem("location")) || [];
};

function addCity(city) {
    createHistory = document.createElement('button');
    createHistory.classList.add('form-item', 'btn');
    createHistory.textContent = city;
    createHistory.setAttribute("city-data", city);
    historyContent.append(createHistory);
};

function getHistory() {
    searchHistory = getHistoryFromStorage();
    historyContent.innerHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        addCity(searchHistory[i]);
    }
};

init();

searchButton.addEventListener("click", function () {
    handleSearchResults();
    getHistory();
    input.value = "";
});

historyContent.addEventListener("click", function (event) {
    searchApi(event.target.dataset.city);
});

