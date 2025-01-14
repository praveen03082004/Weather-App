// selecting elements
const temp = document.getElementById("temp")
const date = document.getElementById("date-time")
let condition = document.getElementById("condition")
let perc = document.getElementById("rain")
let curLocation = document.getElementById("location")
let mainIcon = document.getElementById("weather-image")
let searchLocation = document.getElementById("serLocat")
let searchButton = document.getElementById("searchButton")

let uvIndex = document.querySelector(".uv-index")
let uvText = document.querySelector(".uv-text")
let windSpeed = document.querySelector(".wind-speed")
let windLevel = document.querySelector(".wind-level")
let sunRice = document.querySelector(".sunrise")
let sunSet = document.querySelector(".sunset")
let humidity = document.querySelector(".humidity")
let humidityStatus = document.querySelector(".humidity-status")
let visibility = document.querySelector(".visibility")
let visibilityStatus = document.querySelector(".visibility-status")
let airQuality = document.querySelector(".air-quality")
let airQualityStatus = document.querySelector(".air-quality-status")
let weatherCards = document.querySelector("#weather-cards")
let celciusBtn = document.querySelector(".celcius")
let fahrenheitBtn = document.querySelector(".fahrenheit")
let hourlyBtn = document.querySelector(".hourly")
let weekBtn = document.querySelector(".active")
let temperUnit = document.querySelectorAll(".temp-unit")

let currentCity = ''
let currentUnit = 'c'
let hourlyorWeek = 'Week'
let today;
let city = ""

// update time & date

function updateDateTime() {
    let now = new Date(),
        hours = now.getHours(),
        minutes = now.getMinutes();

    let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

    // 12 hours format
    hours = hours % 12

    // add leading zero
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hours}:${minutes}`

}
date.textContent = updateDateTime();
// update time every second
setInterval(() => {
    date.textContent = updateDateTime();
}, 1000)


// function to fetch data from api
function geoLocation() {
    fetch("https://geolocation-db.com/json/")
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.city;
            console.log(data);
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        })
        .catch((err) => {
            alert("Unable to retrieve location. Please try again.");
        })
}
geoLocation();


searchLocation.addEventListener("keyup", (event) => {
    city = event.target.value;

});


//Weather data
searchButton.addEventListener("click", () => {

    if (city.trim() === "") {
        alert("Please enter a city name.");
        return;
    }

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`)
        .then((res) => { return res.json() })
        .then((data) => {
            console.log(data);
            currentCity = city;
            today = data.currentConditions;
            curLocation.innerText = data.resolvedAddress;
            temp.innerText = today.temp;
            condition.innerText = today.conditions;
            perc.innerText = "Perc -" + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            windLevel.textContent = "km/h"
            humidity.innerText = today.humidity + "%"
            visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirQualityStatus(today.winddir);
            sunRice.innerText = convertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            mainIcon.src = getWeatherImg(today.icon);
            changeBackground(today.icon);



            function updateForecast(data, unit, type) {
                weatherCards.innerHTML = ""
            
                let day = 0
                let numberCards = 0
            
                if (type == "day") {
                    numberCards = 24;
                }
                else {
                    numberCards = 7;
                }
                for (let i = 0; i < numberCards; i++) {
                    let card = document.createElement("div");
                    card.classList.add("card");
                    // hour if hourly time and day name if weekly
                    let dayName = getHour(data[day].datetime);
                    if (type === "week") {
                        dayName = getDayName(data[day].datetime);
                    }
                    let dayTemp = data[day].temp
                    
                    if (unit === "f") {
                        dayTemp = celciusToFahrenheit(data[day].temp);
                        temp.innerText = celciusToFahrenheit(data[day].temp);
                    }
                    let iconCondition = data[day].icon;
                    
                    let iconSrc = getWeatherImg(iconCondition);
                    let temperUnit = "°C"
                    if (unit === "f") {
                        temperUnit = "°F"
                    }
                    card.innerHTML = `
                             <h2 class="day-name">${dayName}</h2>
                                <div class="card-icon">
                                    <img src="${iconSrc}" id="imgSrc" alt="">
                                </div>
                                <div class="day-temp">
                                    <h2 class="temp">${dayTemp}</h2>
                                    <span class="temp-unit">${temperUnit}</span>
                                </div>`;
            
                    weatherCards.appendChild(card);
                    day++;
                }
            }

            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, currentUnit, "day")
            }
            else {
                updateForecast(data.days, currentUnit, "week")
            }

        })
})


function getWeatherData(city, unit, hourlyorWeek) {
    
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            }
            else {
                temp.innerText = celciusToFahrenheit(today.temp);
            }
            curLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            temp.innerText = today.temp;
            perc.innerText = "Perc -" + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            windLevel.textContent = "km/h"
            humidity.innerText = today.humidity + "%"
            visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirQualityStatus(today.winddir);
            sunRice.innerText = convertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            mainIcon.src = getWeatherImg(today.icon);
            changeBackground(today.icon);

            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day")
            }
            else {
                updateForecast(data.days, unit, "week")
            }

        })
        .catch((err) => {
            alert("city not found");

        })
}

// convert cencius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}


// function to get uv index status

function measureUvIndex(uvIndex) {

    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    }
    else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    }
    else {
        uvText.innerText = "Extreme";
    }
}

// function to get Humidity Status

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    }
    else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    }
    else {
        humidityStatus.innerText = "High";
    }
}

// function to get Visibility Status

function updateVisibilityStatus(visibility) {
    if (visibility <= 0.10) {
        visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

// function to get AirQuality Status

function updateAirQualityStatus(airQuality) {
    if (airQuality <= 50) {
        airQualityStatus.innerText = "Good";
    }
    else if (airQuality <= 100) {
        airQualityStatus.innerText = "Moderate";
    } else if (airQuality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
        if(airQualityStatus.innerText = "Unhealthy for Sensitive Groups"){
            airQualityStatus.style.display = "inline"
        }else{
            
        }
    } else if (airQuality <= 200) {
        airQualityStatus.innerText = "Unhealthy";
    } else if (airQuality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy";
    } else {
        airQualityStatus.innerText = "Hazardous";
    }
}


function convertTimeTo12HourFormat(time) {
    let hours = parseInt(time.split(":")[0]);
    let minutes = parseInt(time.split(":")[1]);
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}

// wather-image   
function getWeatherImg(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png"
    }
    else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png"
    }
    else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png"
    }
    else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png"
    }
    else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png"
    }
    else {
        return "https://i.ibb.co/rb4rrJL/26.png"
    }
}

function getDayName(date) {
    let day = new Date(date);
    let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[day.getDay()]
}

function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`
    } else {
        return `${hour}:${min} AM`
    }
}

function updateForecast(data, unit, type) {
    weatherCards.innerHTML = ""

    let day = 0
    let numberCards = 0

    if (type == "day") {
        numberCards = 24;
    }
    else {
        numberCards = 7;
    }
    for (let i = 0; i < numberCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        // hour if hourly time and day name if weekly
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp
        
        if (unit === "f") {
            dayTemp = celciusToFahrenheit(data[day].temp);
            temp.innerText = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getWeatherImg(iconCondition);
        let temperUnit = "°C"
        if (unit === "f") {
            temperUnit = "°F"
        }
        card.innerHTML = `
                 <h2 class="day-name">${dayName}</h2>
                    <div class="card-icon">
                        <img src="${iconSrc}" id="imgSrc" alt="">
                    </div>
                    <div class="day-temp">
                        <h2 class="temp">${dayTemp}</h2>
                        <span class="temp-unit">${temperUnit}</span>
                    </div>`;

        weatherCards.appendChild(card);
        day++;
    }
}

function changeBackground(condition) {
    let body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp"
    }
    else if (condition === "partly-cloudy-night") {
        bg = "https://i.ibb.co/RDfPqXz/pcn.jpg"
    }
    else if (condition === "rain") {
        bg = "https://i.ibb.co/h2p6Yhd/rain.webp"
    }
    else if (condition === "clear-day") {
        bg = "https://i.ibb.co/WGry01m/cd.jpg"
    }
    else if (condition === "clear-night") {
        bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg"
    }
    else {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp"
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg}) `
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
    
})

celciusBtn.addEventListener("click", () => {
    changeUnit("c");
    
})

function changeUnit(unit) {

    if (currentUnit !== unit) {
        currentUnit = unit;
        {
            temperUnit.forEach((ele) => {
                ele.innerText = `°${unit.toUpperCase()}`;
            });
            if (unit === "c") {
                celciusBtn.classList.add("active")
                fahrenheitBtn.classList.remove("active")
            } else {
                celciusBtn.classList.remove("active")
                fahrenheitBtn.classList.add("active")
            }
            // call get weather after change unit
            getWeatherData(currentCity, currentUnit, hourlyorWeek);
        }
    }
}



hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
})

function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;

        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}


